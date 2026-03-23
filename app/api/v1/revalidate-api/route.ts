import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_REVALIDATE_TAGS = ['api', 'wordpress'] as const;

type RevalidationRequestMode = 'auto' | 'manual';
type CloudflarePurgeMode = 'files' | 'prefixes' | 'hosts' | 'everything';

type CloudflarePurgeBody =
  | { files: string[] }
  | { prefixes: string[] }
  | { hosts: string[] }
  | { purge_everything: true };

interface RevalidateRequestBody {
  action?: string;
  mode?: string;
  source?: string;
}

interface CloudflarePurgeInput {
  apiToken: string;
  purgeUrl: string;
  mode: string;
  targets: string[];
}

interface CloudflarePurgeResult {
  ok: boolean;
  mode: CloudflarePurgeMode;
  statusCode: number;
  targets: string[];
  responseBody: unknown;
}

export const isRevalidationAuthorized = (authHeader: string | null, expectedKey?: string) => {
  return Boolean(expectedKey && authHeader === `Bearer ${expectedKey}`);
};

export const parseListEnvironmentValue = (value?: string | null) => {
  if (!value?.trim()) {
    return [];
  }

  const trimmedValue = value.trim();

  if (trimmedValue.startsWith('[')) {
    try {
      const parsedValue = JSON.parse(trimmedValue);

      if (Array.isArray(parsedValue)) {
        return parsedValue
          .filter((entry): entry is string => typeof entry === 'string')
          .map((entry) => entry.trim())
          .filter(Boolean);
      }
    } catch {
      // Fall back to comma/newline parsing.
    }
  }

  return trimmedValue
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const isTruthyEnvironmentValue = (value?: string) => /^(1|true|yes)$/i.test(value ?? '');

const uniqueValues = (values: string[]) => [...new Set(values.filter(Boolean))];

const normalizeHostTarget = (value: string) => {
  const trimmedValue = value.trim();

  if (/^https?:\/\//i.test(trimmedValue)) {
    return new URL(trimmedValue).host;
  }

  return (
    trimmedValue
      .replace(/^https?:\/\//i, '')
      .split(/[/?#]/, 1)[0]
      ?.trim() ?? ''
  );
};

const normalizePrefixTarget = (value: string) => {
  const trimmedValue = value.trim();

  if (/^https?:\/\//i.test(trimmedValue)) {
    const url = new URL(trimmedValue);
    return `${url.host}${url.pathname === '/' ? '' : url.pathname.replace(/\/$/, '')}`;
  }

  const [withoutHashOrQuery] = trimmedValue.split(/[?#]/, 1);

  if (withoutHashOrQuery.startsWith('/')) {
    throw new Error('Cloudflare prefix purge targets must include the host, for example www.example.com/blog.');
  }

  return withoutHashOrQuery.replace(/\/$/, '');
};

const normalizeFileTarget = (value: string) => {
  const trimmedValue = value.trim();

  if (trimmedValue.startsWith('/')) {
    throw new Error('Cloudflare file purge targets must be full URLs or host/path values.');
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    const url = new URL(trimmedValue);
    url.hash = '';
    return url.toString();
  }

  return new URL(`https://${trimmedValue.replace(/^\/+/, '')}`).toString();
};

export const buildCloudflarePurgeRequest = ({
  mode,
  targets,
}: {
  mode: string;
  targets: string[];
}): CloudflarePurgeBody => {
  const normalizedMode = mode.trim().toLowerCase() as CloudflarePurgeMode;

  if (normalizedMode === 'everything') {
    return { purge_everything: true };
  }

  if (normalizedMode === 'hosts') {
    const hostTargets = uniqueValues(targets.map((target) => normalizeHostTarget(target)));

    if (hostTargets.length === 0) {
      throw new Error('Cloudflare host purge requires at least one host target.');
    }

    return { hosts: hostTargets };
  }

  if (normalizedMode === 'prefixes') {
    const prefixTargets = uniqueValues(targets.map((target) => normalizePrefixTarget(target)));

    if (prefixTargets.length === 0) {
      throw new Error('Cloudflare prefix purge requires at least one target.');
    }

    return { prefixes: prefixTargets };
  }

  if (normalizedMode === 'files') {
    const fileTargets = uniqueValues(targets.map((target) => normalizeFileTarget(target)));

    if (fileTargets.length === 0) {
      throw new Error('Cloudflare file purge requires at least one target.');
    }

    return { files: fileTargets };
  }

  throw new Error(`Unsupported Cloudflare purge mode: ${mode}`);
};

export const purgeCloudflareCache = async (
  { apiToken, purgeUrl, mode, targets }: CloudflarePurgeInput,
  fetcher: typeof fetch = fetch
): Promise<CloudflarePurgeResult> => {
  const requestBody = buildCloudflarePurgeRequest({ mode, targets });
  const response = await fetcher(purgeUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    cache: 'no-store',
  });

  const responseText = await response.text();

  let responseBody: unknown = responseText;

  if (responseText) {
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = responseText;
    }
  }

  const cloudflareSuccess = Boolean(
    response.ok && typeof responseBody === 'object' && responseBody !== null && 'success' in responseBody
      ? (responseBody as { success: boolean }).success
      : response.ok
  );

  const resolvedTargets =
    'purge_everything' in requestBody
      ? ['purge_everything']
      : uniqueValues(Object.values(requestBody).flatMap((value) => (Array.isArray(value) ? value : [])));

  return {
    ok: cloudflareSuccess,
    mode: mode.trim().toLowerCase() as CloudflarePurgeMode,
    statusCode: response.status,
    targets: resolvedTargets,
    responseBody,
  };
};

export const POST = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  const expectedKey = process.env.WORDPRESS_API_KEY;

  if (!isRevalidationAuthorized(authHeader, expectedKey)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const requestBody = (await request.json().catch(() => null)) as RevalidateRequestBody | null;
    const requestMode: RevalidationRequestMode = requestBody?.mode === 'manual' ? 'manual' : 'auto';

    for (const tag of DEFAULT_REVALIDATE_TAGS) {
      revalidateTag(tag, 'max');
    }

    const manualOnly = isTruthyEnvironmentValue(process.env.CLOUDFLARE_PURGE_ON_MANUAL_ONLY);
    const cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN;
    const cloudflarePurgeUrl = process.env.CLOUDFLARE_PURGE_URL;
    const cloudflarePurgeMode = process.env.CLOUDFLARE_PURGE_MODE;
    const cloudflareTargets = parseListEnvironmentValue(process.env.CLOUDFLARE_PURGE_TARGETS);
    const hasCloudflareConfig = Boolean(cloudflareApiToken && cloudflarePurgeUrl && cloudflarePurgeMode);

    if (manualOnly && requestMode !== 'manual') {
      return NextResponse.json({
        success: true,
        status: 'success',
        message: 'React cache revalidated. Cloudflare purge skipped for automatic requests.',
        tags: [...DEFAULT_REVALIDATE_TAGS],
        cloudflare: {
          configured: hasCloudflareConfig,
          skipped: true,
          reason: 'manual_only',
        },
        timestamp: new Date().toISOString(),
      });
    }

    if (!hasCloudflareConfig) {
      return NextResponse.json({
        success: true,
        status: 'success',
        message: 'React cache revalidated. Cloudflare purge is not fully configured.',
        tags: [...DEFAULT_REVALIDATE_TAGS],
        cloudflare: {
          configured: false,
          skipped: true,
        },
        timestamp: new Date().toISOString(),
      });
    }

    let cloudflareResult: CloudflarePurgeResult;

    try {
      cloudflareResult = await purgeCloudflareCache({
        apiToken: cloudflareApiToken!,
        purgeUrl: cloudflarePurgeUrl!,
        mode: cloudflarePurgeMode!,
        targets: cloudflareTargets,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown Cloudflare purge error';

      console.error('Cloudflare purge failed before request execution:', {
        action: requestBody?.action ?? null,
        requestMode,
        purgeMode: cloudflarePurgeMode,
        error: errorMessage,
      });

      return NextResponse.json({
        success: false,
        status: 'partial',
        message: `React cache revalidated, but Cloudflare purge failed: ${errorMessage}`,
        tags: [...DEFAULT_REVALIDATE_TAGS],
        cloudflare: {
          configured: true,
          ok: false,
          mode: cloudflarePurgeMode,
          error: errorMessage,
        },
        timestamp: new Date().toISOString(),
      });
    }

    if (!cloudflareResult.ok) {
      console.error('Cloudflare purge request failed:', {
        action: requestBody?.action ?? null,
        requestMode,
        purgeMode: cloudflareResult.mode,
        statusCode: cloudflareResult.statusCode,
        responseBody: cloudflareResult.responseBody,
      });

      return NextResponse.json({
        success: false,
        status: 'partial',
        message: 'React cache revalidated, but Cloudflare purge failed.',
        tags: [...DEFAULT_REVALIDATE_TAGS],
        cloudflare: {
          configured: true,
          ok: false,
          mode: cloudflareResult.mode,
          statusCode: cloudflareResult.statusCode,
          targets: cloudflareResult.targets,
          responseBody: cloudflareResult.responseBody,
        },
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      status: 'success',
      message: 'React cache revalidated and Cloudflare cache purged.',
      tags: [...DEFAULT_REVALIDATE_TAGS],
      cloudflare: {
        configured: true,
        ok: true,
        mode: cloudflareResult.mode,
        statusCode: cloudflareResult.statusCode,
        targets: cloudflareResult.targets,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error revalidating React cache:', error);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
};

export const GET = () => {
  return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 });
};
