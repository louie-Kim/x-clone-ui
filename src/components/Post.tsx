import { imagekit } from "@/utils";
import ImageKit from "imagekit";
import Image from "./Image";
import PostInfo from "./PostInfo";
import PostInteraction from "./PostInteraction";
import Video from "./Video";
import Link from "next/link";
// post 테이블
import { Post as PostType } from "@prisma/client";
import { format } from "timeago.js";


type PostWithDetails = PostType & {
  user: {
    displayName: string | null ;
    username: string;
    img: string | null;
  };
};

// 남들이 올린 포스팅??
// 서버사이드 컴포넌트
const Post = ({
  type,
  post,
}: {
  type?: "status" | "comments";
  post: PostWithDetails;
}) => {
 

  console.log("포스팅 정보", post); // 여기서 post.desc로 포스팅 내용 가져옴

  return (
    <div className="p-4 border-y-[1px] border-borderGray">
      {/* Post type */}
      {post.rePostId && (
        <div className="flex items-center gap-2 text-sm text-textGray mb-2 from-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path
              fill="#71767b"
              d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"
            />
          </svg>
          <span>{post.user.displayName} reposted</span>
        </div>
      )}

      {/* Post content */}
      {/* <div className="flex gap-4"> */}
      <div className={`flex gap-4 ${type === "status" && "flex-col"}`}>
        {/* Avatar */}

        <div
          className={`${
            type === "status" && "hidden"
          } relative w-10 h-10 rounded-full overflow-hidden`}
        >
          <Image
            path={post.user.img || "New%20Folder/noAvatar.png"}
            alt=""
            w={100}
            h={100}
            tr={true}
          />
        </div>

        {/* content */}
        {/* flex-1 : 공간 전부 차지*/}
        <div className="flex-1 flex flex-col gap-2">
          {/* top */}
          <div className="w-full flex justify-between">
            <Link href={`/lamadev`} className="flex gap-4">
              <div
                className={`${
                  type !== "status" && "hidden"
                } relative w-10 h-10 rounded-full overflow-hidden`}
              >
                <Image
                  path={post.user.img || "New%20Folder/noAvatar.png"}
                  alt=""
                  w={100}
                  h={100}
                  tr={true}
                />
              </div>

              <div
                // !items-start : X축 방향(가로 방향) 으로 '! 강제 ' 정렬
                className={`flex items-center gap-2 flex-wrap ${
                  type === "status" && "flex-col gap-0 !items-start"
                }`}
              >
                <h1 className="text-md font-bold">{post.user.displayName}</h1>
                {/* <span>은 기본적으로 display: inline; 속성을 가지므로, 브라우저가 자동으로 한 줄에 배치 */}
                <span
                  className={`text-textGray ${type === "status" && "text-sm"}`}
                >
                  @{post.user.username}
                </span>
                {type !== "status" && (
                  <span className="text-textGray">
                    {format(post.createdAt)}
                  </span>
                )}
              </div>
            </Link>
            {/* infoMore.svg : ... 이미지*/}
            <PostInfo />
          </div>

          {/* text & media */}
          <Link href={`/xxxDev/status/123`}>
            <p className={`${type === "status" && "text-lg"}`}>{post.desc}</p>
          </Link>
          {post.img && <Image path={post.img} alt="" w={600} h={600} />}

          {/* { fileDetails && fileDetails.fileType === "image" ?
                (
                  <Image
                  path={fileDetails.filePath}
                  alt=""
                  w={fileDetails.width}
                  h={fileDetails.height}
                  className={fileDetails.customMetadata?.sensitive ? "blur-lg" : ""}
                  />
                  ) : (
                    
                  <Video 
                  path={fileDetails.filePath} 
                  className={fileDetails.customMetadata?.sensitive ? "blur-lg" : ""} 
                  />
                  )} */}

          {type === "status" && (
            <span className="text-textGray">8:41 PM Dec 5, 2025</span>
          )}
          <PostInteraction />
        </div>
      </div>
    </div>
  );
};

export default Post;
