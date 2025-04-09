"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";



// http://localhost:3000/ -> useInfiniteQuery실행 -> pageParam=2
const fetchPosts = async (pageParam:number, userProfileId?:string) => {
  const res = await fetch("http://localhost:3000/api/posts?cursor="+pageParam+"&user="+userProfileId);
  return res.json(); //  👈 { posts, hasMore } 객체가 여기로 옴!
};

const InfiniteFeed = ({ userProfileId }: { userProfileId?: string }) => {
    const {
      data,  // {posts, hasMore} 받아옴
      error,
      status,
      hasNextPage,
      fetchNextPage,
    } = useInfiniteQuery({
      // "posts":  게시글 데이터를 위한 이름표 (쿼리를 구분), userProfileId : 유저에 따라 다른 데이터를 캐싱
      queryKey: ["posts", userProfileId],
      // 첫 페이지 요청 때 2를 기본값으로 사용하겠다는 의미
      // queryFn: ({ pageParam = 2 }) => fetchPosts(pageParam, userProfileId),
      queryFn: ({ pageParam = 2 }) => {
        // console.log("🚀 queryFn 실행됨, pageParam:", pageParam);
        return fetchPosts(pageParam, userProfileId);
      },
      initialPageParam: 2,
      /**
       *  lastPage
          마지막으로 fetch한 페이지의 데이터
          즉, fetchPosts(pageParam) 함수가 반환한 객체 하나
          이 값은{ posts: Array(3), hasMore: true } 형태로 되어있음

        { posts: [...] ,  hasMore: true}

        allPages
        지금까지 fetch된 모든 페이지의 배열 (allPages 는 lastPage를  누적시킨 배열)
        즉, fetchPosts(pageParam)의 리턴값들이 차례대로 누적된 배열

        [
        { posts: [...], hasMore: true },   // allPages.length = 1
        { posts: [...], hasMore: true },   // allPages.length = 2
        { posts: [...], hasMore: true },   // allPages.length = 3
        ]


      */
      getNextPageParam: (lastPage, allPages) => {
        // 첫 로딩시에도 getNextPageParam이 실행됨
        console.log(" 🎯 getNextPageParam 실행");
        console.log("lastPage", lastPage); 
        console.log("allPages",allPages);
        console.log("allPages.length", allPages.length); 
        
        const nextPage = lastPage.hasMore ? allPages.length + 2 : undefined;
        return nextPage;
      }
    });

  if(error) return "Something went wrong!";
  if(status === "pending") return "Loading...";

  // console.log("data.pages", data.pages); // 
  // console.log("data.pages.length", data.pages.length); // 1, 2 ,3, 4 ....
  
  /**
   * data.pages : api 요청결과가 누적
   * 
   *[ 
      
     {
        posts: [
          { id: 70, rePostId: 20, userId: "user2", desc: "Repost of Post 20 by user2" },
          { id: 69, rePostId: 19, userId: "user_2vASAZAR6tamMfFS997GSE6gOcw", desc: "Repost of Post 19 by user1" },
          { id: 66, rePostId: 16, userId: "user3", desc: "Repost of Post 16 by user3" }
        ],
        hasMore: true
      },
      {
        posts: [
          { id: 65, rePostId: 20, userId: "user2", desc: "Repost of Post 20 by user2" },
          { id: 64, rePostId: 19, userId: "user_2vASAZAR6tamMfFS997GSE6gOcw", desc: "Repost of Post 19 by user1" },
          { id: 61, rePostId: 16, userId: "user3", desc: "Repost of Post 16 by user3" }
        ],
        hasMore: true
      },

   ]

   ata?.pages?.flatMap

    [
      { id: 70, rePostId: 20, userId: "user2", desc: "Repost of Post 20 by user2" },
      { id: 69, rePostId: 19, userId: "user_2vASAZAR6tamMfFS997GSE6gOcw", desc: "Repost of Post 19 by user1" },
      { id: 66, rePostId: 16, userId: "user3", desc: "Repost of Post 16 by user3" },
      { id: 65, rePostId: 20, userId: "user2", desc: "Repost of Post 20 by user2" },
      { id: 64, rePostId: 19, userId: "user_2vASAZAR6tamMfFS997GSE6gOcw", desc: "Repost of Post 19 by user1" },
      { id: 61, rePostId: 16, userId: "user3", desc: "Repost of Post 16 by user3" }
    ];

   */
  
  // flatMap : '배열' 안의 객체에서 '배열'을 꺼낼 때, 하나의 평면 배열로 만들어줌
  const allPosts  = data?.pages?.flatMap(page=>page.posts) || []; 

  // console.log("allPosts", allPosts); 
  // console.log("allPosts.length", allPosts.length); // 3, 6, 9, 12 .... 누적
  // console.log("hasNextPage", hasNextPage); // true, false
  

   /**
   * 🔍 예시
    fetchNextPage() 실행 → getNextPageParam 에서 페이지 계산 → 
    그 값( pageParam )으로 queryFn 다시 실행 → fetchPosts(pageParam) 요청
   */


  return (
    /**
     * 스크롤 바닥 도달 (조건 1)
        ↓
      hasMore === true (조건 2)
        ↓
      fetchNextPage() 실행됨
        ↓
      데이터 새로 받아옴
        ↓
      dataLength 증가
        ↓
      다음 요청 가능 상태로 유지됨

     */
    <InfiniteScroll
      //  dataLength 값이 바뀌면 다음 스크롤 이벤트를 기다림
      dataLength={allPosts.length} 
      // next={fetchNextPage}
      next={() => {
        console.log(" 🚀  fetchNextPage 호출");
        fetchNextPage();
      }}
      hasMore={!!hasNextPage}  //  Boolean값으로 확실하게 바꿔주는 역할
      loader={<h1>Posts are loading...</h1>}
      endMessage={<h1>All posts loaded!</h1>}
    >
        {allPosts.map((post) => (
        <Post key={post.id} post={post}/>
      ))}
    </InfiniteScroll>
  );
}
export default InfiniteFeed;




 
