// route request

import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { resolve } from "path";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // GET /api/posts?cursor=페이지번호&user=유저ID
  const userProfileId = searchParams.get("user"); // 유저ID
  const page = searchParams.get("cursor"); // 페이지번호
  console.log("page---------------------------", page);

  const LIMIT = 3;

  // console.log(" api>posts userProfileId", userProfileId);

  // 현재 로그인한 유저의 정보를 가져오기
  const { userId } = await auth();

  if (!userId) return;

  const whereCondition =
    userProfileId !== "undefined"
      ? // /api/posts?user=유저ID : 해당 유저의 게시물
        { parentPostId: null, userId: userProfileId as string }
      : // /api/posts?cursor=1&user=undefined: 내 글 + 내가 팔로우한 유저들 글
        {
          parentPostId: null,
          userId: {
            in: [
              userId,
              ...(
                await prisma.follow.findMany({
                  where: { followerId: userId },
                  select: { followingId: true },
                })
              ).map((follow) => follow.followingId),
            ],
          },
        };

  const postIncludeQuery = {
    user: { select: { displayName: true, username: true, img: true } },
    //  Post 모델 안에서 배열([])로 정의된 필드들의 항목 수
    _count: {
      select: { likes: true, rePosts: true, comments: true },
    },
    // userId 가 누른 id 필드만 가져옴
    likes: { where: { userId: userId }, select: { id: true } },
    rePosts: { where: { userId: userId }, select: { id: true } },
    saves: { where: { userId: userId }, select: { id: true } },
  };

  // skip : 특정 개수의 데이터를 건너뛰고 가져오겠다는 의미 3개씩
  const posts = await prisma.post.findMany({
    where: whereCondition,
    include: {
      rePost: {
        include: postIncludeQuery,
      },
      ...postIncludeQuery,
    },
    // 한번에 3개씩 가져옴
    take: LIMIT,
    /**
     * page	계산식	        skip 결과	   설명
        2	(2 - 1) * 3 = 3	    3	        앞 3개 건너뛰고 그다음 3개
        3	(3 - 1) * 3 = 6   	6	        앞 6개 건너뛰고 그다음 3개
        4	(4 - 1) * 3 = 9   	9	        앞 9개 건너뛰고 그다음 3개  ...
     */
    skip: (Number(page) - 1) * LIMIT,
    orderBy: { createdAt: "desc" },
  });

  // console.log("posts---------------------------", posts); // 3개씩 가져옴

  // 게시물의 총 개수
  const totalPosts = await prisma.post.count({ where: whereCondition });
  // console.log("totalPosts---------------------------", totalPosts); // 30

  // boolean 값으로 hasMore를 설정
  const hasMore = Number(page) * LIMIT < totalPosts;
  // console.log("hasMore---------------------------", hasMore); // true

  // "3초 후에 완료되는 Promise"를 생성
  // new Promise: 비동기 작업을 처리하기 위한 객체
  // resolve() :  Promise를 "성공"으로 끝내주는 함수
  // 3초가 지나면 resolve()를 실행 -> Promise를 '성공(fulfilled)' 상태
  // await new Promise(resolve => setTimeout(resolve, 3000)); // 3초 대기

  return Response.json({ posts, hasMore }); // JSON -> InfiniteFeed.tsx로 전달
}
