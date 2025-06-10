// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('cmsAuthToken');
  const isCmsPath = req.nextUrl.pathname.startsWith('/dashboard/cms');

  if (isCmsPath && !token) {
    return NextResponse.redirect(new URL('/dashboard/cms/login', req.url));
  }

  return NextResponse.next();
}
