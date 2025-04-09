import Feed from "@/components/Feed";
import Image from "@/components/Image";
import { prisma } from "@/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * (board) : Group Segment
 * 소괄호로 감싸진 폴더 이름은 실제 URL 경로에 포함되지 않아요
 * http://localhost:3000/sonny  -> (board)표시 안됨
 */

// src > app > [username 매개변수 경로] > page.tsx 

// http://localhost:3000/[username] = params 이경로에서 열림 : db의 sonny
// user profile 페이지 : 내 페이지
const UserPage = async({params}:{params:{username:string}}) => {

  // console.log("params------------------------",params);

  /**
   * params는 dynamic route ([username], [slug] 등)에서 사용
   * params : Next.js App Router의 구조상 "비동기일 수 있음" -> await로 기다려야 한다는뜻
   * params는 Promise로 반환되므로 await를 사용하여 값을 안전하게 가져와야 합니다.
   */
  const { username } = await params; // sonny

  // fetching single user
  // findUnique -> User모델 username String @unique 검색
  const user = await prisma.user.findUnique({
    // where: {username: params.username}
    where: {username}
  })

  if(!user) return notFound() // 404페이지 열어줌

  return (
    <div className="">
      {/* PROFILE TITLE */}
      {/* backdrop-blur-md : 약간의 블러 효과 */}
      {/* h-40으로 충분한 공간을 주면  items-end ,items-start 먹힘 */}
      {/* bg-[#00000084] : 52% 투명도가 적용된 검정색 */}
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <Image path="New%20Folder/back.svg" alt="back" w={24} h={24} />
        </Link>
        <h1 className="font-bold text-lg">Lama Dev</h1>
      </div>

      {/* INFO */}
      <div className="">
        {/* COVER & AVATAR CONTAINER */}
        <div className="relative w-full">
          {/* COVER */}
          {/* aspect-ratio, aspect-[w/h] , 너비 : 높이 = 3 : 1 , 높이를 기준으로 할 때 너비가 3배
          ex w 1200 : h x = 3 : 1 -> x=400*/}
          <div className="w-full aspect-[3/1] relative">
            <Image
              path="New%20Folder/cover.jpg"
              alt="cover"
              w={600}
              h={200}
              tr={true}
            />
          </div>
          {/* AVATAR */}
          {/* ex) 부모 요소의 가로 600px : w-1/6 = 100 aspect-square = 너비100 X 높이100 -> -translate-y-1/2 -> 50만큼 위로 이동*/}
          {/* aspect-square -> rounded-full -> overflow-hidden 동그라미 완성*/}
          <div className="w-1/6 aspect-square rounded-full overflow-hidden border-4 border-black bg-gray-900 absolute left-4 -translate-y-1/2">
            <Image
              path="New%20Folder/avatar.png"
              alt=""
              w={100}
              h={100}
              tr={true}
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex w-full items-center justify-end gap-2 p-2">
            <div className=" w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
              <Image path="New%20Folder/more.svg" alt="more" w={20} h={20} />
            </div>
            <div className=" w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
              <Image path="New%20Folder/explore.svg" alt="more" w={20} h={20} />
            </div>
            <div className=" w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
              <Image path="New%20Folder/message.svg" alt="more" w={20} h={20} />
            </div>
            <button className="py-2 px-4 bg-white text-black font-bold rounded-full">
              Follow
            </button>
          </div>
          
        </div>

        {/* USER DETAILS */}
        <div className="p-4 flex flex-col gap-2">
          {/* USERNAME & HANDLE */}
          <div className="">
            <h1 className="text-2xl font-bold">Lama Dev</h1>
            <span className="text-textGray text-sm">@lamaWebDev</span>
          </div>
          <p>Lama Dev Youtube Channel</p>

          {/* JOB & LOCATION & DATE */}
          <div className="flex gap-4 text-textGray text-[15px]">
            <div className="flex items-center gap-2">
              <Image
                path="New%20Folder/userLocation.svg"
                alt="location"
                w={20}
                h={20}
              />
              <span>USA</span>
            </div>
            <div className="flex items-center gap-2">
              <Image path="New%20Folder/date.svg" alt="date" w={20} h={20} />
              <span>Joined May 2025</span>
            </div>
          </div>
          {/* FOLLOWINGS & FOLLOWERS */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">100</span>
              <span className="text-textGray text-[15px]">Follower</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">100</span>
              <span className="text-textGray text-[15px]">Followings</span>
            </div>
          </div>
        </div>
      </div>
      {/* FEED */}
      <Feed userProfileId={user.id}/>
    </div>
  );
};

export default UserPage;
