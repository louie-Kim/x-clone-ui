"use client";

import Link from "next/link";
import Image from "./Image";
import { useRouter } from "next/navigation";
import Socket from "./Socket";
import Notification from "./Notification";
import { Fragment } from "react";

const menuList = [
  {
    id: 1,
    name: "Homepage",
    link: "/",
    icon: "home.svg",
  },
  {
    id: 2,
    name: "Explore",
    link: "/",
    icon: "explore.svg",
  },
  // 알림
  // {
  //   id: 3,
  //   name: "Notification",
  //   link: "/",
  //   icon: "notification.svg",
  // },
  {
    id: 4,
    name: "Messages",
    link: "/",
    icon: "message.svg",
  },
  {
    id: 5,
    name: "Bookmarks",
    link: "/",
    icon: "bookmark.svg",
  },
  {
    id: 6,
    name: "Jobs",
    link: "/",
    icon: "job.svg",
  },
  {
    id: 7,
    name: "Communities",
    link: "/",
    icon: "community.svg",
  },
  {
    id: 8,
    name: "Premium",
    link: "/",
    icon: "logo.svg",
  },
  {
    id: 9,
    name: "Profile",
    link: "/",
    icon: "profile.svg",
  },
  {
    id: 10,
    name: "More",
    link: "/test/status/123",
    icon: "more.svg",
  },
];

const LeftBar = () => {
  const router = useRouter();

  const openPostModal = () => {
    router.push("/compose/post"); // URL을 변경하여 모달 표시
  };

  return (
    // sticky가 적용된 이 요소(LeftBar)가 뷰포트의 최상단(top: 0)에 붙어 있도록
    <div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8">
      {/* logo menu button*/}
      {/* items-center → 내부 요소들을 가로축(X축) 중앙 정렬
           items-start → 내부 요소들을 가로축(X축) 왼쪽 정렬 */}
      <div className="flex flex-col gap-4 text-lg items-center xxl:items-start">
        {/* LOGO */}
        <Link href="/" className="p-2 rounded-full hover:bg-[#181818]">
          <Image path="New%20Folder/logo.svg" alt="logo" w={24} h={24} />
        </Link>

        {/* menu list */}
        <div className="flex flex-col gap-4">
          {menuList.map((item, i) => (
            <div key={item.id || i}>
              {/* 인덱스 2  Messages 앞에 추가로 끼워넣어서 Notification 렌더링*/}
              {i === 2 && (
                <div>
                  <Notification />
                </div>
              )}
              <Link
                href={item.link}
                className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
              >
                <Image
                  path={`New%20Folder/${item.icon}`}
                  alt={item.name}
                  w={24}
                  h={24}
                />
                {/* span 은 원래 인라인 엘리먼트 */}
                <span className="hidden xxl:inline">{item.name}</span>
              </Link>
            </div>
          ))}
        </div>
        {/* 모바일 버튼 */}
        {/* /test/status/123 여기 갔다가 오면 모달창 열림 왜???*/}
        <Link
          href="/compose/post"
          // onClick={openPostModal}
          className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center xxl:hidden"
        >
          <Image path="New%20Folder/post.svg" alt="new post" w={24} h={24} />
        </Link>
        {/* 큰화면 버튼 */}
        <Link
          href="/compose/post"
          // onClick={openPostModal}
          className="hidden xxl:block bg-white text-black rounded-full font-bold py-2 px-20"
        >
          Post
        </Link>
      </div>
      <Socket />
      {/* user */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative rounded-full overflow-hidden">
            {/* fill : 부모 요소에 맞춰 자동으로 크기를 조절*/}
            <Image
              path="New%20Folder/avatar.png"
              alt="jydev"
              w={100}
              h={100}
              tr={true}
            />
          </div>
          <div className="hidden xxl:flex flex-col">
            <span className="font-bold">JY dev</span>
            <span className="text-sm text-textGray">@jydev</span>
          </div>
        </div>

        <div className="hidden xxl:block cursor-pointer font-bold">...</div>
      </div>
    </div>
  );
};

export default LeftBar;

// import Link from "next/link";
// import Image from "./Image";
// import { useRouter } from "next/navigation";

// const menuList = [
//   { id: 1, name: "Homepage", link: "/", icon: "home.svg" },
//   { id: 2, name: "Explore", link: "/", icon: "explore.svg" },
//   { id: 3, name: "Notification", link: "/", icon: "notification.svg" },
//   { id: 4, name: "Messages", link: "/", icon: "message.svg" },
//   { id: 5, name: "Bookmarks", link: "/", icon: "bookmark.svg" },
//   { id: 6, name: "Jobs", link: "/", icon: "job.svg" },
//   { id: 7, name: "Communities", link: "/", icon: "community.svg" },
//   { id: 8, name: "Premium", link: "/", icon: "logo.svg" },
//   { id: 9, name: "Profile", link: "/", icon: "profile.svg" },
//   { id: 10, name: "More", link: "/", icon: "more.svg" },
// ];

// const LeftBar = () => {
//   const router = useRouter();

//   // 모달을 여는 함수 (Next.js App Router 사용)
//   const openPostModal = () => {
//     console.log("🔍 Trying to open modal at: /compose/post");  // 로그 추가

//     router.push("/compose/post");  // 경로 수정
//     console.log("🔍 모달 오픈 성공~!!!!");  // 로그 추가
//   };

//   return (
//     <div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8">
//       <div className="flex flex-col gap-4 text-lg items-center xxl:items-start">
//         {/* LOGO */}
//         <Link href="/" className="p-2 rounded-full hover:bg-[#181818]">
//           <Image path="New%20Folder/logo.svg" alt="logo" w={24} h={24} />
//         </Link>

//         {/* Menu List */}
//         <div className="flex flex-col gap-4">
//           {menuList.map((item) => (
//             <Link
//               href={item.link}
//               className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
//               key={item.id}
//             >
//               <Image
//                 path={`New%20Folder/${item.icon}`}
//                 alt={item.name}
//                 w={24}
//                 h={24}
//               />
//               <span className="hidden xxl:inline">{item.name}</span>
//             </Link>
//           ))}
//         </div>

//         {/* Mobile Button */}
//         <button
//           onClick={openPostModal}
//           className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center xxl:hidden"
//         >
//           <Image path="New%20Folder/post.svg" alt="new post" w={24} h={24} />
//         </button>

//         {/* Large Screen Button */}
//         <button
//           onClick={openPostModal}
//           className="hidden xxl:block bg-white text-black rounded-full font-bold py-2 px-20"
//         >
//           Post
//         </button>
//       </div>

//       {/* User Section */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <div className="w-10 h-10 relative rounded-full overflow-hidden">
//             <Image
//               path="New%20Folder/avatar.png"
//               alt="jydev"
//               w={100}
//               h={100}
//               tr={true}
//             />
//           </div>
//           <div className="hidden xxl:flex flex-col">
//             <span className="font-bold">JY dev</span>
//             <span className="text-sm text-textGray">@jydev</span>
//           </div>
//         </div>
//         <div className="hidden xxl:block cursor-pointer font-bold">...</div>
//       </div>
//     </div>
//   );
// };

// export default LeftBar;
