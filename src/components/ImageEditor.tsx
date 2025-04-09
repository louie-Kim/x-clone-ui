import Image from "next/image";
import React from "react";


const ImageEditor = ({
    onClose,
    previewUrl,
    settings,
    setSettings,
  }: {
    onClose: () => void;
    previewUrl: string;
    settings: {
      type: "original" | "wide" | "square";
      sensitive: boolean;
    };
    // React.Dispatch<React.SetStateAction<T>>
    // React.Dispatch<T>: React useState에서 세터 함수(setter function)의 타입을 지정
    // React.SetStateAction<T> : 상태 변경 함수(setState)가 변경 할 수 있는 값(인자)의 타입을 정의

    /**
     * 사용 예시
     * setSettings({ type: "square", sensitive: true });  or
       setSettings((prev) => ({ ...prev, type: "wide" }));

     */
    setSettings: React.Dispatch<
      React.SetStateAction<{
        // setSettings 가 변경할 수 있는 settings의 타입을 정의
        type: "original" | "wide" | "square";
        sensitive: boolean;
      }>
    >;
  }) => {


    const handleChangeSensitive= (sensitive:boolean) => {
      console.log("sensitive 토글",sensitive);
      
      setSettings( prev => ({ ...prev, sensitive }))
    }

    /**
     *  setSettings 로 타입을 변경 -> Share 컴포넌트 프리뷰에 반영
     *   <NextImage 
          src={previewUrl} alt="" 
          width={600} 
          height={600}
          className={`w-full ${
            settings.type === "original"
            ? "h-full object-contain"
            : settings.type === "square"
            ? "aspect-square object-cover"
            : "aspect-video object-cover" // wide
          }`}/>
     *    
     */
    const handleChangeType= (type: "original" | "wide" | "square") => {
      console.log("type 변경",type);
      
      setSettings( prev => ({ ...prev, type })) // 이전 상태를 새로운 상태로 교체
    }
    
    //  화면 전체를 덮는 오버레이(모달 배경 등)
    return (
    // left-0 top-0 에서 시작 -> flex items-center justify-center로 중앙 정렬
    // 전체 화면 bg-black bg-opacity-75 로 오버레이이
    <div className="fixed w-screen h-screen left-0 top-0 bg-black bg-opacity-75 z-10 flex items-center justify-center">
        <div className="bg-black rounded-xl flex flex-col gap-4">
           
            {/* top */}
            <div className="flex items-center justify-between">
              
              <div className="flex items-center gap-8">
                <svg
                  width={32}
                  viewBox="0 0 24 24"
                  onClick={onClose} // close modal
                  className="cursor-pointer"
                >
                  <path
                    fill="#e7e9ea"
                    d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"
                  />
                </svg>
                <h1 className="font-bold text-xl">Media settings</h1>
              </div>
              {/* 실제 저장기능없고 모달 창을 닫는 기능만있음 */}
              <button className="py-2 px-4 rounded-full bg-white text-black font-bold" onClick={ onClose }>Save</button>

            </div>

            
            {/* image container */}
            <div className="w-[600px] h-[600px] flex items-center">
                <Image
                src={previewUrl}
                alt=""
                width={600}
                height={600}
                /**
                 * object-contain :이미지가 원본 비율을 유지 -> 컨테이너 안으로 축소 (빈공간생길수 있음)
                 * object-cover : 컨테이너를 꽉 채우지만, 일부 이미지가 잘릴 수 있음. 줌인(확대)
                 * aspect-square : 이미지의 가로세로 비율을 1:1(정사각형) 로 강제
                 * aspect-video → 16:9 비율로 강제 변환됨 (와이드 화면).
                 */
                className={`w-full ${
                    settings.type === "original"
                    ? "h-full object-contain"
                    : settings.type === "square"
                    ? "aspect-square object-cover"
                    : "aspect-video object-cover" // wide
                }`}
                />
            </div>

            {/* settings : 각 세팅 클릭 -> share 컴포넌트 프리뷰에 반영 */}
            <div className="flex items-center justify-between text-sm">
               
                {/* oprions */}
                <div className="flex items-center gap-8">
                   <div className="flex items-center gap-2 cursor-pointer" onClick={ ()=>handleChangeType("original") }>
                      <svg width={24} viewBox="0 0 24 24">
                          <path
                            className={
                              settings.type === "original"
                                ? "fill-iconBlue"
                                : "fill-[#e7e9ea]"
                            }
                            d="M3 7.5C3 6.119 4.119 5 5.5 5h13C19.881 5 21 6.119 21 7.5v9c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 19 3 17.881 3 16.5v-9zM5.5 7c-.276 0-.5.224-.5.5v9c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-9c0-.276-.224-.5-.5-.5h-13z"
                          />
                      </svg>
                    Original
                   </div>
                   
                   <div className="flex items-center gap-2 cursor-pointer" onClick={ ()=>handleChangeType("wide") }>
                      <svg width={24} viewBox="0 0 24 24">
                          <path
                            className={
                              settings.type === "wide"
                                ? "fill-iconBlue"
                                : "fill-[#e7e9ea]"
                            }
                            d="M3 9.5C3 8.119 4.119 7 5.5 7h13C19.881 7 21 8.119 21 9.5v5c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 17 3 15.881 3 14.5v-5zM5.5 9c-.276 0-.5.224-.5.5v5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-5c0-.276-.224-.5-.5-.5h-13z"
                            />
                      </svg>
                      Wide
                   </div>
                   
                   <div className="flex items-center gap-2 cursor-pointer" onClick={ ()=>handleChangeType("square") }>
                      <svg width={24} viewBox="0 0 24 24">
                          <path
                            className={
                              settings.type === "square"
                                ? "fill-iconBlue"
                                : "fill-[#e7e9ea]"
                            }
                            d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v13c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-13c0-.276-.224-.5-.5-.5h-13z"
                            />
                      </svg>
                      Square
                   </div>
                   
                </div>

                <div 
                  className={ `cursor-pointer py-1 px-4 rounded-full text-black 
                  ${ settings.sensitive ? "bg-red-500" : "bg-white" }` }
                  onClick={ ()=>handleChangeSensitive(!settings.sensitive) }>
                  sensitive
                </div>

            </div>
            
        </div>    
    </div>
    );
  };
  
  export default ImageEditor;
  