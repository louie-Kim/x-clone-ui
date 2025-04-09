"use client";
// useState 를 사용하는 컴포넌트(클라이언트)는 use client 를 명시해야함 

import { useState } from "react";
import Image from "./Image";
import NextImage from "next/image";
import { shareAction } from "@/actions";
import ImageEditor from "./ImageEditor";

const Share = () => {
  // transformation -> 이미지 컴포넌트 프롭스fill={true} 자동 설정 -> 부모태그가 relative, absolute, fixed 중 하나여야 함
  // Image ( 기본 정사각형 ) -> rounded-full 안먹힘 -> overflow-hidden 정사각형 이미지를 원형으로 보이게 함 (구겨넣음)

  const [media, setMedia] = useState<File | null>(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  // React.Dispatch<React.SetStateAction<boolean>>

  const [settings, setSettings] = useState<{
    //settings의 타입을 정의
    type: "original" | "wide" | "square";
    sensitive: boolean;
  }>({
    //settings의 초기값 설정
    type: "original",
    sensitive: false,
  });

  // console.log("미디어 타입은?", media); // media type은 image or video ( 콘솔에 출력 )

  /**
   * 
   *  만약 onChange 이벤트가 <textarea>에서 발생했다면?
      👉 React.ChangeEvent<HTMLTextAreaElement>
      <select> 요소에서 발생했다면?
      👉 React.ChangeEvent<HTMLSelectElement>
   */
  // React.ChangeEvent  → React에서 onChange 이벤트를 다룰 때 사용하는 타입
  // <HTMLInputElement> → 이벤트가 발생한 요소가 <input> 태그(파일 업로드 필드)라는 것을 명시
  //
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("e.target.files", e.target.files); // FileList {0: File, length: 1}

    if (e.target.files && e.target.files[0]) {
      setMedia(e.target.files[0]); // image , video 둘다 가능
    }
  };

  // 이미지나, 영상을 선택하면 previewUrl을 생성
  const previewUrl = media ? URL.createObjectURL(media) : null;
  // console.log("previewUrl of image video", previewUrl); //<input type="file" />에서 선택한 파일(media)의 임시 URL(blob URL) blob:http://localhost:3000/...

  return (
    <form
      className="p-4 flex gap-4"
      action={(formData) => shareAction(formData, settings)}
    >
      {/* avatar */}
      <div className="relative h-10 w-10 rounded-full overflow-hidden">
        <Image
          path="New%20Folder/avatar.png"
          alt=""
          w={100}
          h={100}
          tr={true}
        />
      </div>

      {/*  */}

      {/* others */}
      {/* 부모 기본 세로정렬을 시켜도 flex flex-col 자식내부에서는 따로 flex~ 헤서 가로, 세로 정렬 가능!!  <div className="flex items-center gap-4 flex-wrap">
          여기 값을 items-start items-end 로 테스트 해보면 됨*/}
      <div className="flex-1 flex flex-col gap-4">
        <input
          type="text"
          name="desc"
          placeholder="What is happening?"
          className="bg-transparent outline-none placeholder:text-textGray text-xl"
        />

        {/* preview Image */}
        {media?.type.includes("image") && previewUrl && (
          <div className="relative rounded-xl overflow-hidden">
            <NextImage
              src={previewUrl}
              alt=""
              width={600}
              height={600}
              className={`w-full ${
                settings.type === "original"
                  ? "h-full object-contain"
                  : settings.type === "square"
                  ? "aspect-square object-cover"
                  : "aspect-video object-cover" // wide
              }`}
            />
            <div
              className="absolute top-2 left-2 bg-black bg-opacity-50 text-white py-1 px-4 rounded-full font-bold text-sm cursor-pointer"
              onClick={() => setIsEditorOpen(true)}
            >
              Edit
            </div>
            <div
              className="absolute top-2 right-2 bg-black bg-opacity-75 text-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer font-bold text-sm"
              onClick={() => setMedia(null)}
            >
              X
            </div>
          </div>
        )}
        {/* preview video */}
        {media?.type.includes("video") && previewUrl && (
          // controls ->  볼륨 조절, 재생 위치 조정, 전체 화면 모드 가능
          <div className="relative">
            <video src={previewUrl} controls></video>
            <div
              className="absolute top-2 right-2 bg-black bg-opacity-75 text-white h-8 w-8 flex items-center justify-center rounded-full cursor-pointer font-bold text-sm"
              onClick={() => setMedia(null)}
            >
              X
            </div>
          </div>
        )}

        {/* image editor modal open*/}
        {isEditorOpen && previewUrl && (
          <ImageEditor
            onClose={() => setIsEditorOpen(false)} // 편집기 닫기
            previewUrl={previewUrl}
            settings={settings}
            setSettings={setSettings}
          />
        )}

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-4 flex-wrap">
            {/* id="file": <label> 요소에서 htmlFor="file"과 연결해 '클릭 이벤트를 위임'할 때 사용, 기본적인 파일 업로드 UI를 숨김 */}
            <input
              type="file"
              name="file"
              onChange={handleMediaChange}
              className="hidden"
              id="file"
              accept="image/*,video/*"
            />
            <label htmlFor="file">
              <Image
                path="New%20Folder/image.svg"
                alt=""
                w={20}
                h={20}
                className="cursor-pointer"
              />
            </label>
            <Image
              path="New%20Folder/gif.svg"
              alt=""
              w={20}
              h={20}
              className="cursor-pointer"
            />
            <Image
              path="New%20Folder/poll.svg"
              alt=""
              w={20}
              h={20}
              className="cursor-pointer"
            />
            <Image
              path="New%20Folder/emoji.svg"
              alt=""
              w={20}
              h={20}
              className="cursor-pointer"
            />
            <Image
              path="New%20Folder/schedule.svg"
              alt=""
              w={20}
              h={20}
              className="cursor-pointer"
            />
            <Image
              path="New%20Folder/location.svg"
              alt=""
              w={20}
              h={20}
              className="cursor-pointer"
            />
          </div>
          {/* 이 버튼이 클릭되면 <form> 요소의 action으로 지정된 함수 shareAction이 실행 */}
          <button className="bg-white text-black font-bold rounded-full py-2 px-4">
            Post
          </button>
        </div>
      </div>
    </form>
  );
};

export default Share;
