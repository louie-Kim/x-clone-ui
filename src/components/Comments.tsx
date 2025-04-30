"use client";
import { getDisplayName } from "next/dist/shared/lib/utils";
import Image from "./Image";
import Post from "./Post";
import { Post as PostType } from "@prisma/client";
import { comment } from "postcss";
import { useUser } from "@clerk/nextjs";
import { useActionState, useEffect } from "react";
import { error } from "console";
import { addComment } from "@/action";
import { socket } from "@/socket";
// displayName, img : User모델에서 옵셔널
type CommentWithDetails = PostType & {
  // _count : post모델의 배열로 된 필드의 총합값
  user: { displayName: string | null; username: string; img: string | null };
  _count: { likes: number; rePosts: number; comments: number };
  likes: { id: number }[];
  rePosts: { id: number }[];
  saves: { id: number }[];
};

const Comments = ({
  comments,
  postId,
  username,
}: {
  comments: CommentWithDetails[];
  postId: number;
  username: string;
}) => {
  console.log("Comments compponent comments", comments);

  //  clerk에서 제공하는 훅 : user?.imageUrl 내 구굴 계정 이미지 나옴
  const { isLoaded, isSignedIn, user } = useUser();

  // useActionState : 서버 액션을 처리하고 상태를 관리하는 훅
  /**
   * <form action={formAction}> -> FormData로 만들어서 formAction호출
   * addComment(FormData)  서버액션 실행 후 ->  state 업데이트 -> state.error 사용
   */
  const [state, formAction, isPending] = useActionState(addComment, {
    // state
    success: false,
    error: false,
  });
  // const { user } = useUser(); // clerk에서 제공하는 훅

  useEffect(() => {
    // 코멘트 작성 -> <Notification/> 로 전송
    if (state.success) {
      socket.emit("sendNotification", {
        //  좋아요를 받는 게시물의 작성자
        receiverUserName: username,
        data: {
          senderUserName: user?.username,
          type: "comment",
          link: `${username}/status/${postId}`,
        },
      });
    }
  }, [state.success, username, user?.username, postId]);

  return (
    <div className="">
      {user && (
        <form
          action={formAction}
          className="flex items-center justify-between gap-4 p-4 "
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden -z-10">
            <Image
              src={user?.imageUrl}
              alt="Lama Dev"
              w={100}
              h={100}
              tr={true}
            />
          </div>
          <input type="number" name="postId" hidden readOnly value={postId} />
          <input
            type="string"
            name="username"
            hidden
            readOnly
            value={username}
          />
          <input
            type="text"
            name="desc"
            className="flex-1 bg-transparent outline-none p-2 text-xl"
            placeholder="Post your reply"
          />
          <button
            disabled={isPending}
            className="py-2 px-4 font-bold bg-white text-black rounded-full disabled::cursor-not-allowed disabled::bg-slate-200"
          >
            {isPending ? "Replying" : "Reply"}
          </button>
        </form>
      )}
      {state.error && (
        <span className="text-red-300 p-4">Something went wrong</span>
      )}
      {comments.map((comment) => (
        <div key={comment.id}>
          <Post post={comment} type="comment" />
        </div>
      ))}
    </div>
  );
};

export default Comments;
