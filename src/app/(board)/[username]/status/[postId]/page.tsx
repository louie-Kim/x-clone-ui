import Comments from "@/components/Comments";
import Image from "@/components/Image";
import Post from "@/components/Post";
import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";

// http://localhost:3000/[username]/status/[postId]이경로에서 열림
// Next.js의 라우트 핸들러에서 params는 항상 동기 객체?
// Next.js에서 URL 경로로부터 자동으로 동기적으로 주입되는 값
// 동기 vs 비동기의 차이는 결국 값을 바로 사용할 수 있느냐,
// 아니면 await해서 값을 꺼내야 하느냐의 차이

// single post page
const StatusPage = async ({
  params,
}: {
  params: Promise<{ username: string; postId: string }>; // 비동기
  // params: { username: string; postId: string }; // 동기
}) => {
  // params.username : 사용안하고 있음

  // console.log("single post params",params); // Promise{...}

  const { userId } = await auth();

  // username: 'user3',
  // postId: '14',
  // rePosts: [ { id: 64 } ] -> userId : user_2vASAZAR6tamMfFS997GSE6gOcw
  const postId = (await params).postId;
  console.log("postId", postId); //

  if (!userId) return;
  // originalPost
  const post = await prisma.post.findFirst({
    where: { id: Number(postId) },
    include: {
      //  리포스트한 사람
      user: { select: { displayName: true, username: true, img: true } },
      //  Post 모델 안에서 배열([])로 정의된 필드들의 항목 수
      _count: {
        select: { likes: true, rePosts: true, comments: true },
      },
      // userId 가 누른 것들
      likes: { where: { userId: userId }, select: { id: true } },
      rePosts: { where: { userId: userId }, select: { id: true } },
      saves: { where: { userId: userId }, select: { id: true } },
      // 자식 Comment로 넘겨주는 부분
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { displayName: true, username: true, img: true } },
          _count: {
            select: { likes: true, rePosts: true, comments: true },
          },
          likes: { where: { userId: userId }, select: { id: true } },
          rePosts: { where: { userId: userId }, select: { id: true } },
          saves: { where: { userId: userId }, select: { id: true } },
        },
      },
    },
  });

  if (!post) return notFound();

  console.log("single post's post", post);

  return (
    <div className="">
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <Image path="New%20Folder/back.svg" alt="back" w={24} h={24} />
        </Link>
        <h1 className="font-bold text-lg">Post</h1>
      </div>

      <Post type="status" post={post} />
      <Comments
        comments={post.comments}
        postId={post.id}
        username={post.user.username}
      />
    </div>
  );
};

export default StatusPage;
