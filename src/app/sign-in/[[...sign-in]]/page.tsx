"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Link from "next/link";

// clerk 사용을 위한 Sign-in 페이지
// http://localhost:3000/sign-in 에서 열림
/**
   Strategy 👉 실제로 그 로그인 방식에 필요한 UI를 구현함
 * SupportedStrategy 👉 사용자에게 "이런 방식도 가능해요"라고 제안함
 * 
 */
const SignInpage = () => {
  return (
    <div className="h-screen flex items-center justify-between pe-8">
      {/* logo */}
      <div className="hidden lg:flex w-1/2 items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="320"
          height="320"
          viewBox="0 0 24 24"
        >
          <path
            fill="white"
            d="M 26.609375 29.023438 L 3.425781 29.023438 L 3.425781 26.707031 L 24.3125 26.707031 L 24.3125 23.242188 L 3.390625 23.242188 L 3.441406 0.015625 L 11.46875 0.015625 L 11.46875 17.117188 L 9.167969 17.117188 L 9.167969 2.335938 L 5.738281 2.335938 L 5.695312 20.925781 L 26.609375 20.925781 L 26.609375 29.023438"
          />
        </svg>
      </div>

      {/* form */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <h1 className="text-2xl xsm:text-4xl md:text-6xl font-bold">
          Happening now
        </h1>
        <h1 className="text-2xl">Join today</h1>
        {/* social login */}
        {/* SignIn.Root :  로그인 관련 UI(예: 소셜 로그인 버튼들 등)를 감싸주는 컨테이너 컴포넌트 */}
        <SignIn.Root>
          {/* Google"로 로그인 연결을 생성하는 Clerk 전용 컴포넌트 */}
          {/* 구글 이미지 클릭 -> 구글 로그인 열어줌 */}
          <Clerk.Connection
            name="google"
            className="bg-white rounded-full p-2 text-black w-72 flex items-center justify-center gap-2 font-bold"
          >
            <svg viewBox="0 0 24 24" width={24} height={24}>
              <path
                d="M18.977 4.322L16 7.3c-1.023-.838-2.326-1.35-3.768-1.35-2.69 0-4.95 1.73-5.74 4.152l-3.44-2.635c1.656-3.387 5.134-5.705 9.18-5.705 2.605 0 4.93.977 6.745 2.56z"
                fill="#EA4335"
              ></path>
              <path
                d="M6.186 12c0 .66.102 1.293.307 1.89L3.05 16.533C2.38 15.17 2 13.63 2 12s.38-3.173 1.05-4.533l3.443 2.635c-.204.595-.307 1.238-.307 1.898z"
                fill="#FBBC05"
              ></path>
              <path
                d="M18.893 19.688c-1.786 1.667-4.168 2.55-6.66 2.55-4.048 0-7.526-2.317-9.18-5.705l3.44-2.635c.79 2.42 3.05 4.152 5.74 4.152 1.32 0 2.474-.308 3.395-.895l3.265 2.533z"
                fill="#34A853"
              ></path>
              <path
                d="M22 12c0 3.34-1.22 5.948-3.107 7.688l-3.265-2.53c1.07-.67 1.814-1.713 2.093-3.063h-5.488V10.14h9.535c.14.603.233 1.255.233 1.86z"
                fill="#4285F4"
              ></path>
            </svg>
            Sign in with Google
          </Clerk.Connection>
          <Clerk.Connection
            name="apple"
            className="bg-white rounded-full p-2 text-black w-72 flex items-center justify-center gap-2 font-bold"
          >
            <svg viewBox="0 0 24 24" width={24} height={24}>
              <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"></path>
            </svg>
            Sign in with Apple
          </Clerk.Connection>

          {/* 1. Step 1: 이메일 or 전화번호 입력 ---------------------------------------------*/}
          <SignIn.Step name="start">
            <Clerk.Field name="identifier" className="flex flex-col gap-2">
              {/* 유저 정보 (이메일 또는 전화번호) 입력란 */}
              <Clerk.Input
                placeholder="john@gmail.com"
                className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
              />
              {/* 에러 메세지 : you have to use email address*/}
              <Clerk.FieldError className="text-red-300 text-sm" />
            </Clerk.Field>
            {/* 계정이 존재하는지 서버와 통신해서 확인 -> verifications 스텝으로 이동*/}
            <SignIn.Action
              submit
              className="mt-2 text-sm underline w-72 text-center text-iconBlue"
            >
              Continue
            </SignIn.Action>
          </SignIn.Step>

          {/* 2.  비밀번호 인증 로그인 or Forgot Password flow -------------------------------- */}
          <SignIn.Step name="verifications">

            {/* 2-1 : 기존 비밀번호 입력 ----------------------*/}
            <SignIn.Strategy name="password">
              <Clerk.Field name="password" className="flex flex-col gap-2">
                <Clerk.Input
                  placeholder="password"
                  className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm"
                />
                <Clerk.FieldError className="text-red-300 text-sm" />
              </Clerk.Field>
              <div className="flex flex-col gap-2">
                {/* 테스트 계정 lama@test.com(이메일,비번)*/}
                {/* Clerk가 이 이메일 + 비밀번호 조합을 서버에 전달해서 비밀번호 검사-> 로그인*/}
                <SignIn.Action
                  submit
                  className="mt-2 text-sm underline w-72 text-center text-iconBlue"
                >
                  Continue
                </SignIn.Action>
                {/* 스텝 3으로 이동 */}
                <SignIn.Action
                  navigate="forgot-password"
                  className="mt-2 text-sm underline w-72 text-center"
                >
                  Forgot Password?
                </SignIn.Action>
              </div>
            </SignIn.Strategy>

              
            {/* 2-2 : 이메일로 인증코드 발송 --------------------------------------------------*/}
            <SignIn.Strategy name="reset_password_email_code">
              <p className="text-sm mb-2">
                We sent a code to <SignIn.SafeIdentifier />.
              </p>
              {/* 인증코드 입력 필드 */}
              <Clerk.Field name="code" className="flex flex-col gap-2">
                <Clerk.Input className="py-2 px-6 rounded-full text-black w-72 placeholder:text-sm" placeholder="Verification Code"/>
                <Clerk.FieldError className="text-red-300 text-sm"/>
              </Clerk.Field>
              {/* 여기선 인증 코드 code 을 Clerk 서버에 제출 -> 4로 이동*/}
              {/* reset_password_email_code 전략을 Clerk에 제출 검증 -> reset-password 로 이동*/}
              <SignIn.Action submit className="mt-2 text-sm underline w-72 text-center text-iconBlue">Continue</SignIn.Action>

            </SignIn.Strategy>

          </SignIn.Step>

          {/*  3. 비밀번호 재설정 (Forgot Password Flow) ------------------------------------- */}
          <SignIn.Step
            name="forgot-password"
            className="flex justify-between w-72 text-sm">

              {/* 이메일로 인증 코드 발송 2-2 로 이동 */}
              <SignIn.SupportedStrategy name="reset_password_email_code">
                <span className="underline text-iconBlue">Reset password</span>
              </SignIn.SupportedStrategy>
              {/* 뒤로 돌아가기 */}
              <SignIn.Action navigate="previous" className="underline">
                Go back
              </SignIn.Action>

          </SignIn.Step>


          {/* 4. 비밀번호 재설정 (Reset Password Flow) -----------------------------------------*/}
          {/* 비밀번호 재설정 이메일로 인증코드 발송 후 -> 비밀번호 재설정 페이지로 이동 */}
          <SignIn.Step name="reset-password">
                <h1>Reset your password</h1>

                <Clerk.Field name="password">
                  <Clerk.Label>New password</Clerk.Label>
                  <Clerk.Input />
                  <Clerk.FieldError />
                </Clerk.Field>

                <Clerk.Field name="confirmPassword">
                  <Clerk.Label>Confirm password</Clerk.Label>
                  <Clerk.Input />
                  <Clerk.FieldError />
                </Clerk.Field>

                <SignIn.Action submit>Reset password</SignIn.Action>
          </SignIn.Step>

           {/* OR SIGN UP */}
           {/* flex-grow : 부모(.flex)가 가진 남는 공간을 자식들이 차지하게 만드는 속성 */}
           <div className="w-72 flex items-center gap-4">
            <div className="h-px bg-borderGray flex-grow"></div>
            <span className="text-textGrayLight">or</span>
            <div className="h-px bg-borderGray flex-grow"></div>
           </div>
           <Link href="/sign-up" className="bg-iconBlue rounded-full p-2 text-white font-bold w-72 text-center">Create Account</Link>
           <p className="w-72 text-xs">
            By signing up, you agree to the <span className="text-iconBlue">Terms of Service</span> and <span className="text-iconBlue">Privacy Policy</span>,
            including <span className="text-iconBlue">Cookie Use</span>.
          </p>

        </SignIn.Root>
      </div>
    </div>
  );
};

export default SignInpage;
