import Link from "next/link";
import Image from "./Image";
import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import { log } from "console";

const Recommendation = async () => {
  const { userId } = await auth();

  if (!userId) return;

  const followingIds = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  // console.log("followingIds", followingIds); //[ { followingId: 'user2' }, { followingId: 'user3' } ]

  // 내가 팔로우 하고 있는 사람들
  const followedUserIds = followingIds.map((f) => f.followingId);

  // console.log("followedUserIds", followedUserIds); // ['user2', 'user3']

  // 내가 팔로우하고 있는 친구들이 팔로우하는 유저들 중에서,
  // 나와 아직 팔로우 관계가 없는 유저 3명을 추천
  const friendRecommendations = await prisma.user.findMany({
    where: {
      // 나 자신이 아니고, 내가 이미 팔로우한 사람도 아닌 유저만
      id: { not: userId, notIn: followedUserIds },
      //  some: -> 배열 안에 하나라도 이 조건을 만족하는 요소가 있으면 true
      //  ['user2', 'user3']이 팔로우 하는 사람중 추천
      followings: { some: { followerId: { in: followedUserIds } } },
    },
    take: 3,
    select: { id: true, displayName: true, username: true, img: true },
  });

  // console.log("friendRecommendations", friendRecommendations); // ['user4', 'user5']

  return (
    <div className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4">
      {friendRecommendations.map((person) => (
        <div className="flex items-center justify-between" key={person.id}>
          <div className="flex items-center gap-2">
            <div className="relative rounded-full overflow-hidden w-10 h-10">
              <Image
                path={person.img || "New%20Folder/noAvatar.png"}
                alt={person.username}
                w={100}
                h={100}
                tr={true}
              />
            </div>

            <div className="">
              <h1 className="text-md font-bold">
                {person.displayName || person.username}
              </h1>
              <span className="text-textGray text-sm">@{person.username}</span>
            </div>
          </div>

          <button className="py-1 px-4 font-semibold bg-white text-black rounded-full">
            Follow
          </button>
        </div>
      ))}

      <Link href="/" className="text-iconBlue">
        show more
      </Link>
    </div>
  );
};

export default Recommendation;
