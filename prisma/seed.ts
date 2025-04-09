
// prisma Seeding : db에 test 데이터를 넣어주는 작업
// package.json에 prisma seed script 추가
// "prisma": {
//     "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
//   }
// npm i ts-node -> prisma/seed.ts 파일 생성

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create 5 users with unique details
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      // db 저장되는 부분
      data: {
        id: `user${i}`,
        email: `user${i}@example.com`,
        username: `user${i}`,
        displayName: `User ${i}`,
        bio: `Hi I'm user${i}. Welcome to my profile!`,
        location: `USA`,
        job: `Developer`,
        website: `google.com`,
      },
    });
    users.push(user);
  }
  console.log(`${users.length} users created.`);

  // Create 5 posts for each user
  // 전체 게시물 수는 사용자 5 × 게시물 5 = 25
  const posts = [];
  for (let i = 0; i < users.length; i++) {
    for (let j = 1; j <= 5; j++) { // j 게시물 수
      const post = await prisma.post.create({
        data: {
          desc: `Post ${j} by ${users[i].username}`, //Post 1 by user1
          userId: users[i].id,
        },
      });
      posts.push(post);
    }
  }
  console.log('Posts created.');

  // Create some follows
  await prisma.follow.createMany({
    data: [
      { followerId: users[0].id, followingId: users[1].id },
      { followerId: users[0].id, followingId: users[2].id },
      { followerId: users[1].id, followingId: users[3].id },
      { followerId: users[2].id, followingId: users[4].id },
      { followerId: users[3].id, followingId: users[0].id },
    ],
  });
  console.log('Follows created.');

  // Create some likes
  await prisma.like.createMany({
    data: [
      { userId: users[0].id, postId: posts[0].id },
      { userId: users[1].id, postId: posts[1].id },
      { userId: users[2].id, postId: posts[2].id },
      { userId: users[3].id, postId: posts[3].id },
      { userId: users[4].id, postId: posts[4].id },
    ],
  });
  console.log('Likes created.');

  // Create some comments (each comment is a post linked to a parent post)
  const comments = [];
  for (let i = 0; i < posts.length; i++) {
    const comment = await prisma.post.create({  // i 게시물 인덱스 0~24
      data: {
        // Comment on Post 1 by user2
        desc: `Comment on Post ${posts[i].id} by ${users[(i + 1) % 5].username}`, 
        /**
         * 어떠한 수 % 5를 해도 0~4 사이의 나머지값이 나옴
         * i 게시물 인덱스 0~24 + 1 % 5 (나머지) => user 1~5
         */
        userId: users[(i + 1) % 5].id,
        parentPostId: posts[i].id, // Linking the comment to the post
      },
    });
    comments.push(comment);
  }
  console.log('Comments created.');

  // Create reposts using the Post model's rePostId
  const reposts = [];
  
  for (let i = 0; i < posts.length; i++) {
    const repost = await prisma.post.create({
      data: {
        // Repost of Post 11 by user3
        desc: `Repost of Post ${posts[i].id} by ${users[(i + 2) % 5].username}`,
        userId: users[(i + 2) % 5].id, // The user who is reposting
        rePostId: posts[i].id, // Linking to the original post being reposted
      },
    });
    reposts.push(repost);
  }
  console.log('Reposts created.');

  // Create saved posts (users save posts they like)
  await prisma.savedPosts.createMany({
    data: [
      { userId: users[0].id, postId: posts[1].id },
      { userId: users[1].id, postId: posts[2].id },
      { userId: users[2].id, postId: posts[3].id },
      { userId: users[3].id, postId: posts[4].id },
      { userId: users[4].id, postId: posts[0].id },
    ],
  });
  console.log('Saved posts created.');
}

main()
  .then(async () => {
    // success
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // error
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

  // npx prisma db seed : 데이터베이스에 데이터를 넣어줌