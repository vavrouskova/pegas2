import assert from 'node:assert/strict';
import test from 'node:test';

import * as routeModule from '@/app/api/v1/revalidate-api/route';

const getRouteFunction = (name: string) => {
  const candidate = (routeModule as Record<string, unknown>)[name];

  assert.equal(typeof candidate, 'function', `${name} should be exported`);

  return candidate as Function;
};

const callRouteFunction = (name: string, ...values: unknown[]) => {
  return Reflect.apply(getRouteFunction(name), undefined, values);
};

const { isRevalidationAuthorized } = routeModule;

test('returns true for a matching bearer token', () => {
  assert.equal(isRevalidationAuthorized('Bearer secret-key', 'secret-key'), true);
});

test('returns false when the authorization header is missing', () => {
  assert.equal(isRevalidationAuthorized(null, 'secret-key'), false);
});

test('returns false when the expected key is missing', () => {
  assert.equal(isRevalidationAuthorized('Bearer secret-key'), false);
});

test('returns false for a non-matching bearer token', () => {
  assert.equal(isRevalidationAuthorized('Bearer wrong-key', 'secret-key'), false);
});

test('parses Cloudflare target lists from JSON and csv env values', () => {
  assert.deepEqual(callRouteFunction('parseListEnvironmentValue', '["/","/blog"]'), ['/', '/blog']);
  assert.deepEqual(callRouteFunction('parseListEnvironmentValue', ' www.example.com , staging.example.com '), [
    'www.example.com',
    'staging.example.com',
  ]);
  assert.deepEqual(callRouteFunction('parseListEnvironmentValue', ''), []);
});

test('builds simple prefix purge requests from direct targets', () => {
  assert.deepEqual(
    callRouteFunction('buildCloudflarePurgeRequest', {
      mode: 'prefixes',
      targets: ['https://www.example.com/blog?preview=true', 'staging.example.com/sluzby#section'],
    }),
    {
      prefixes: ['www.example.com/blog', 'staging.example.com/sluzby'],
    }
  );
});

test('builds Cloudflare purge everything requests', () => {
  assert.deepEqual(callRouteFunction('buildCloudflarePurgeRequest', { mode: 'everything', targets: [] }), {
    purge_everything: true,
  });
});

test('posts Cloudflare purge requests to the configured URL', async () => {
  let receivedUrl = '';
  let receivedInit: Record<string, unknown> | undefined;

  const response = await Reflect.apply(getRouteFunction('purgeCloudflareCache'), undefined, [
    {
      apiToken: 'cloudflare-token',
      purgeUrl: 'https://api.cloudflare.com/client/v4/zones/zone-id/purge_cache',
      mode: 'hosts',
      targets: ['www.example.com', 'staging.example.com'],
    },
    async (url: string | URL, init?: Record<string, unknown>) => {
      receivedUrl = typeof url === 'string' ? url : url.toString();
      receivedInit = (init ?? {}) as Record<string, unknown>;

      return Response.json({ success: true, result: { id: 'purge-id' } }, { status: 200 });
    },
  ]);

  assert.equal(receivedUrl, 'https://api.cloudflare.com/client/v4/zones/zone-id/purge_cache');
  assert.equal((receivedInit?.headers as Record<string, string>).Authorization, 'Bearer cloudflare-token');
  assert.equal(receivedInit?.method, 'POST');
  assert.deepEqual(JSON.parse(receivedInit?.body as string), {
    hosts: ['www.example.com', 'staging.example.com'],
  });
  assert.equal((response as { ok: boolean }).ok, true);
  assert.equal((response as { statusCode: number }).statusCode, 200);
  assert.deepEqual((response as { targets: string[] }).targets, ['www.example.com', 'staging.example.com']);
});
