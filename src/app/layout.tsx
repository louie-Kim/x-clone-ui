import { Query } from "@tanstack/react-query";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/providers/QueryProvider";

// flex-1은 "남은 공간을 모두 차지하는 역할"을 하는 클래스
// (Global Layout)
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ClerkProvider 인증을 위해서 전역 레이아웃 필요함
    // QueryProvider는 react-query를 사용하기 위해서 전역 레이아웃에 필요함
    <ClerkProvider>
      <QueryProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
