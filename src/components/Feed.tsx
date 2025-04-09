// "use client"; 가 없으면 기본적으로 서버 컴포넌트로 인식됨
// 서버컴포넌트 도 렌더링 가능 : 서버에서 html를 만들어줌
// 클라이언트 컴포넌트 : 브라우저에서 html을 만들어줌

import { prisma } from "@/prisma";
import Post from "./Post";
import { auth } from "@clerk/nextjs/server";
import InfiniteFeed from "./InfiniteFeed";
// 사용자의 피드(게시물 목록) 을 보여줌
// user profile ( http://localhost:3000/[username] ) : 아래 내 게시물들

const Feed = async ({ userProfileId }: { userProfileId?: string }) => {
  // console.log("userProfileId???", userProfileId);

  // 현재 로그인한 유저의 정보를 가져오기
  const { userId } = await auth();

  // user_2vASAZAR6tamMfFS997GSE6gOcw
  // console.log("userId", userId);

  if (!userId) return;

  //"user_2vASAZ...997G"라는 사용자가 팔로우하고 있는 사람들의 followingId만 가져와줘.
  // "내가 팔로우한 사람들의 ID만 뽑기"
  // const followings = await prisma.follow.findMany({
  //   where: { followerId: userId },
  //   // followingId 필드만 결과에 포함시켜줘!
  //   select: { followingId: true },
  // });

  // // followings [ { followingId: 'user2' }, { followingId: 'user3' } ]
  // console.log("followings", followings);

  // const ids = followings.map((f) => f.followingId);
  // // [ 'user2', 'user3' ]
  // console.log(ids);

  const whereCondition = userProfileId
    ? { parentPostId: null, userId: userProfileId }
    : {
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

  /**
   *{
   *  parentPostId: null,
      userId: { in: [ 'user_2vASAZAR6tamMfFS997GSE6gOcw', 'user2', 'user3' ] }
    }
   *  */
  // console.log("whereCondition-------------------", whereCondition);
  
  // 최신순 3개의 게시물을 먼저 가져옴
  const posts = await prisma.post.findMany({
    where: whereCondition,
    include:{user:{ select:{ displayName:true, username:true, img:true }}},
    take: 3,
    skip: 0,
    orderBy: { createdAt: "desc" }, // 최신순으로 정렬
  });

  // console.log("posts", posts);

  // Fectch posts from the current user and followings

  return (
    <div className="">
      {posts.map((post) => (
        <div key={post.id}>
          <Post post={post}/>
          From server : first 3 posts
        </div>
      ))}
      <InfiniteFeed />
    </div>
  );
};

export default Feed;
