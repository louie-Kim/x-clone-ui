"use client";

import { followUser } from "@/action";
import { useOptimistic, useState } from "react";

const FollowButton = ({
  userId,
  isFollowed,
}: {
  userId: string;
  isFollowed: boolean;
}) => {
  console.log("FollowButton props", userId, isFollowed);
  const [state, seSate] = useState(isFollowed);

  const followAction = async () => {
    switchOptimisticFollow(""); // ui 변경
    await followUser(userId); // db에 반영
    seSate((prev) => !prev); // 로컬 state 변경
  };

  // isFollowed = true → state = true → optimisticFollow = true
  const [optimisticFollow, switchOptimisticFollow] = useOptimistic(
    state,
    (prev) => !prev
  );

  console.log("FollowButton optimisticFollow", optimisticFollow); // ture or false

  return (
    <form action={followAction} className="">
      <button className="py-2 px-4 bg-white text-black font-bold rounded-full">
        {optimisticFollow ? "unFollow" : "Follow"}
      </button>
    </form>
  );
};

export default FollowButton;
