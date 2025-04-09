// clerk 인증을 관리하기 위한 미들웨어 설정

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";


// 미들웨어 에서 req를 인터셉트 해서 로그인, 로그 아웃인지를 확인
// 로그인이 되지 않고 protected 경로("/")로 접근하면 auth.protect(); 실행되고  
// /sign-in으로 리다이렉트됨
const isProtectedRoute = createRouteMatcher("/");


// clerkMiddleware -> isProtectedRoute 를  보호된 라우트로 설정
export default clerkMiddleware(
  // auth: Clerk 인증 객체 , req: HTTP 요청에 대한 정보
  async (auth, req) => {
    
    // 요청 URL 및 인증 정보 로깅하기
    // console.log("📌 요청 URL:", req.url); // 로그인 창 
    // console.log("📌 요청 메서드:", req.method);
    // console.log("📌 요청 헤더:", req.headers);
    
    // 인증 객체 로그 확인
    // console.log("📌 인증 정보 (auth):", auth);
   
    // 유저의 요청이 "/"로 시작하는 경우 인증을 확인"
    if (isProtectedRoute(req)) await auth.protect(); 
  },
  {
    signInUrl: "/sign-in",
    signUpUrl: "/sign-up",
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    // 모든 API 라우트 및 trpc 경로를 보호 대상으로 포함
    '/(api|trpc)(.*)',
  ],
};