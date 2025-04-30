import { imagekit } from "@/utils";
import ImageKit from "imagekit";
import Image from "./Image";
import PostInfo from "./PostInfo";
import PostInteraction from "./PostInteraction";
import Video from "./Video";
import Link from "next/link";
import { Post as PostType } from "@prisma/client";
import { format } from "timeago.js";



// User 요약정보 타입
type UserSummary = {
  displayName: string | null;
  username: string;
  img: string | null;
};

// 게시물 참여정보 타입 (좋아요, 리포스트, 댓글 수 등)
type PostEngagement = {
  _count: {
    likes: number;
    rePosts: number;
    comments: number;
  };
  likes: { id: number }[];
  rePosts: { id: number }[];
  saves: { id: number }[];
};

// 리포스트된 원본 게시물 타입
type RePostDetails = PostType & PostEngagement & {
  user: UserSummary;
};

// 최종 게시물 타입 (Post + 유저정보 + 리포스트 정보)
type PostWithDetails = PostType & PostEngagement & {
  user: UserSummary;
  rePost?: RePostDetails | null;
};





// 서버사이드 컴포넌트
const Post = ({
  type,
  post,
}: {
  type?: "status" | "comment";
  post: PostWithDetails;
}) => {
  // console.log("Post component type", type); // status, comments

  const originalPost = post.rePost || post;
  // console.log("post", post);
  // console.log("post.rePost", post.rePost); // originalPost
  // console.log("post._count", originalPost._count);

  // console.log(originalPost.likes.length);

  return (
    <div className="p-4 border-y-[1px] border-borderGray">
      {/* Post type */}
      {/* post.rePostId 가 없으면 -> 리포스트한 게시물이 없다는 뜻  */}
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

      {/* section 0 */}
      <div className={`flex gap-4 ${type === "status" && "flex-col"}`}>
        {/* Section 1 */}
        <div
          className={`${
            type === "status" && "hidden"
          } relative w-10 h-10 rounded-full overflow-hidden -z-10`}
        >
          {/* 링크 없는 이미지 */}
          <Image
            path={originalPost.user.img || "New%20Folder/noAvatar.png"}
            alt=""
            w={100}
            h={100}
            tr={true}
          />
        </div>

        {/* Section 2*/}
        <div className="flex-1 flex flex-col gap-2">
          {/* Section 2-1 */}
          <div className="w-full flex justify-between">
            {/* 특정 유저의 페이지로 이동  */}
            <Link
              href={`/${originalPost.user.username}`}
              className="flex gap-4"
            >
              {/* type = comment 여기 이미지 안보임*/}
              <div
                className={`${
                  type !== "status" && "hidden"
                } relative w-10 h-10 rounded-full overflow-hidden`}
              >
                {/* 링크 이미지 */}
                <Image
                  path={originalPost.user.img || "New%20Folder/noAvatar.png"}
                  alt=""
                  w={100}
                  h={100}
                  tr={true}
                />
              </div>
              {/* DisplayName, Username, Timestamp */}
              <div
                className={`flex items-center gap-2 flex-wrap ${
                  type === "status" && "flex-col gap-0 !items-start"
                }`}
              >
                <h1 className="text-md font-bold">
                  {originalPost.user.displayName}
                </h1>
                {/* <span>은 기본적으로 display: inline; 속성을 가지므로, 브라우저가 자동으로 한 줄에 배치 */}
                <span
                  className={`text-textGray ${type === "status" && "text-sm"}`}
                >
                  @{post.user.username}
                </span>
                {type !== "status" && (
                  <span className="text-textGray">
                    {format(originalPost.createdAt)}
                  </span>
                )}
              </div>
            </Link>
            {/* infoMore.svg : ... 이미지*/}
            <PostInfo />
          </div>

          {/* text & media */}
          {/* Section 2-2 */}
          <Link
            href={`/${originalPost.user.username}/status/${originalPost.id}`}
          >
            <p className={`${type === "status" && "text-lg"}`}>
              {originalPost.desc}
            </p>
          </Link>
          {originalPost.img && (
            <Image
              path={originalPost.img}
              alt=""
              w={600}
              h={originalPost.imgHeight || 600}
            />
          )}
          {type === "status" && (
            <span className="text-textGray">8:41 PM Dec 5, 2025</span>
          )}

          <PostInteraction
            username={originalPost.user.username}
            postId={originalPost.id}
            count={originalPost._count}
            isLiked={!!originalPost.likes.length}
            isRePosted={!!originalPost.rePosts.length}
            isSaved={!!originalPost.saves.length}
          />
        </div>
      </div>
    </div>
  );
};

export default Post;
