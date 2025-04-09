"use client";
// 페이지 네이션은 클라이언트 사이드에서 처리하기 때문에 따로 
// react-query를 사용해서 만든 레이아웃
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


// react-query를 사용하기 위한 레이아웃
export default function QueryProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


   const queryClient = new QueryClient();


  return (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
  );
}
