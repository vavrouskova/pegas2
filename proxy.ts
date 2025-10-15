import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

import { routing } from './i18n/routing';

// TODO: Uncomment when backend is ready
// interface RedirectDataProps {
//   redirect_to: string | null;
// }

// async function getRedirect(pathname: string) {
//   return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wp-json/wp/v2/redirects?source=${pathname}`, {
//     next: {
//       tags: ['api'],
//     },
//   });
// }

export async function proxy(request: NextRequest) {
  // TODO: Uncomment when backend is ready
  // const { pathname } = request.nextUrl;
  // const redirectResponse = await getRedirect(pathname);

  // if (redirectResponse.ok) {
  //   const redirectData: RedirectDataProps = await redirectResponse.json();

  //   if (redirectData?.redirect_to) {
  //     // replace domain with current domain
  //     redirectData.redirect_to = redirectData.redirect_to.replace(
  //       process.env.NEXT_PUBLIC_BACKEND_URL as string,
  //       process.env.FRONTEND_URL as string
  //     );

  //     return NextResponse.redirect(redirectData.redirect_to, 301);
  //   }
  // } else {
  //   console.error('Failed to fetch redirect data:', redirectResponse.statusText);
  // }

  // let response;
  // // if they contain dot, just return response
  // if (pathname.includes('.')) {
  //   response = NextResponse.next();
  //   const path = process.env.NEXT_PUBLIC_BACKEND_URL + request.nextUrl.pathname;
  //   response.headers.set('x-current-path', path);

  //   return response;
  // }

  // No redirect found, continue without redirecting
  const handleI18nRouting = createMiddleware(routing);

  const response = handleI18nRouting(request);

  // TODO: Uncomment when backend is ready
  // const path = process.env.NEXT_PUBLIC_BACKEND_URL + request.nextUrl.pathname;
  // response.headers.set('x-current-path', path);

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/_vercel`, or are `favicon.ico`
    '/((?!api|_next|_vercel|favicon|images|videos).*)',
  ],
};
