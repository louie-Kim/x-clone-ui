import RightBar from "@/components/RightBar";
import LeftBar from "@/components/LeftBar";

// flex-1은 "남은 공간을 모두 차지하는 역할"을 하는 클래스
// modal : 모달창 컴포넌트 app routing!!
// (Nested Layout) : (board) 디렉토리 아래의 페이지들에만 적용
export default function BoardLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
      
        <body>
          {/* 690px이상 -> mx-auto적용 ( 공간생김 ) ->988px (공간꽉참) -> 988px 이상 -> mx-auto적용 ( 공간생김 ) ...*/}
          <div className="max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl xxl:max-w-screen-xxl  mx-auto flex justify-between">
            <div className="px-2 xsm:px-4 xxl:px-8">
              <LeftBar />
            </div>
            {/*flex-1 : LeftBar와 RightBar 사이 남은 공간 모두 차지 -> 최소 lg:min-w-[600px] 유지*/}
            {/* Homepage 컴포넌트 렌더링, src>app>(border)하위 페이지들 렌더링 (앱라우팅) */}
            <div className="flex-1 lg:min-w-[600px] border-x-[1px] border-borderGray">
              {/* Homepage 컴포 렌더링 */}
              {children}
              {/* 레프트 바 Post 클릭시 :  여기서 모달이 표시됨 */}
              {modal}
            </div>
            {/* 988에서 flex , md:ml-8 누적적용됨 , 690이하에서 ml-4 적용*/}
            <div className="hidden lg:flex ml-4 md:ml-8 flex-1">
              <RightBar />
            </div>
          </div>
        </body>
  );
}
