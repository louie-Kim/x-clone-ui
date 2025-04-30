"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { error } from "console";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import { imagekit } from "./utils";

export const followUser = async (targetUserId: string) => {
  //   console.log("likePost postId", postId); // postId 확인

  const { userId } = await auth();
  if (!userId) return;
  // 이미 좋아요 누른 상태 -> 좋아요 취소
  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId: userId,
      followingId: targetUserId,
    },
  });
  console.log("existingFollow 팔로우우 상태 확인", existingFollow); // 팔로우 상태 확인
  if (existingFollow) {
    await prisma.follow.delete({
      where: {
        id: existingFollow.id,
      },
    });
  } else {
    await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: targetUserId,
      },
    });
  }
};
export const likePost = async (postId: number) => {
  //   console.log("likePost postId", postId); // postId 확인

  const { userId } = await auth();
  if (!userId) return;
  // 이미 좋아요 누른 상태 -> 좋아요 취소
  const existingLike = await prisma.like.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  });
  // console.log("existingLike 좋아요 상태 확인", existingLike); // 좋아요 상태 확인
  if (existingLike) {
    // console.log("unliked---------------------------");
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    // console.log("liked------------------------------");
    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
  }
};

export const rePost = async (postId: number) => {
  console.log("rePost postId", postId); // postId 확인

  const { userId } = await auth();

  if (!userId) return;

  const existingRepost = await prisma.post.findFirst({
    where: {
      userId: userId,
      rePostId: postId,
    },
  });
  // console.log("existinRepost 내가 리포스트한거", existingRepost);
  if (existingRepost) {
    await prisma.post.delete({
      where: {
        id: existingRepost.id,
      },
    });
  } else {
    await prisma.post.create({
      data: {
        userId,
        rePostId: postId,
      },
    });
  }
};

export const savePost = async (postId: number) => {
  console.log("savePost postId", postId); // postId 확인

  const { userId } = await auth();

  if (!userId) return;

  const existingsavePost = await prisma.savedPosts.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  });
  // console.log("existingsavePost 상태 확인", existingsavePost);
  if (existingsavePost) {
    await prisma.savedPosts.delete({
      where: {
        id: existingsavePost.id,
      },
    });
  } else {
    await prisma.savedPosts.create({
      data: {
        userId,
        postId,
      },
    });
  }
};

export const addComment = async (
  //
  preState: {
    success: boolean;
    error: boolean;
  },
  formData: FormData
) => {
  const { userId } = await auth();

  if (!userId) return { success: false, error: true };

  // input name="postId" : formData.get("postId")
  // input name="username" : formData.get("username")
  // input name="desc" : formData.get("desc")
  const postId = formData.get("postId");
  const username = formData.get("username");
  const desc = formData.get("desc");

  console.log("addComment postId", postId); // postId 확인
  console.log("addComment username", username);
  console.log("addComment desc", desc);

  // 데이터 구조 정의
  const Comment = z.object({
    parentPostId: z.number(),
    desc: z.string().max(140),
  });

  // verify the inputs
  const validateFields = Comment.safeParse({
    parentPostId: Number(postId),
    desc,
  });

  // { success: true, data: { parentPostId: 25, desc: 'test2' } }
  console.log("validateFields", validateFields); // validateFields 확인

  if (!validateFields.success) {
    console.log("validateFields", validateFields.error.flatten().fieldErrors);

    return { success: false, error: true };
  }

  try {
    await prisma.post.create({
      data: {
        ...validateFields.data,
        userId,
      },
    });
    // 페이지를 캐시(정적 생성) -> 새 댓글을 포함한 최신 내용으로 업데이트
    revalidatePath(`/${username}/status/${postId}`);
    return { success: true, error: false };
  } catch (error) {
    console.log("error", error);
    return { success: false, error: true };
  }
};

// Share component에서 사용되는 서버 액션
export const addPost = async (
  //
  preState: {
    success: boolean;
    error: boolean;
  },
  formData: FormData
) => {
  const { userId } = await auth();

  if (!userId) return { success: false, error: true };

  // input name="desc" : formData.get("desc")
  // input name="file" : formData.get("file")
  const desc = formData.get("desc");
  const file = formData.get("file") as File;
  const isSensitive = formData.get("isSensitive") as string;
  const imgType = formData.get("imgType");
  
  // name="isSensitive" -> value "true" or "false"
  console.log("isSensitive", isSensitive); //  "true" or "false" (string)
  
  //  Promise<UploadResponse> : 리턴 타입
  //  비동기 작업이 끝나면 T 타입의 값을 반환
  const uploadfile = async (file: File): Promise<UploadResponse> => {
    
    // File 데이터를 '메모리에서 다룰 수 있는' 
    // 이진 데이터 형태(binary)로 변환
    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const transformation = `w-600,${
      imgType === "square"
        ? "ar-1-1" // w-600 h-600
        : imgType === "wide"
        ? "ar-16-9"
        : "" // original
    }`;

    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: buffer,
          fileName: file.name,
          folder: "/posts", // 이미지를 저장할 폴더
          // ... : true일 경우 { transformation: { pre: transformation } } 객체의 내용을 개별 속성으로 펼쳐서 복사 (...)
          ...(file.type.includes("image") && {
            transformation: {
              pre: transformation,
            },
          }),
        },
        function (error, result) {
          console.log("result", result); // 업로드 결과 확인
          if (error) reject(error);
          else resolve(result as UploadResponse);
        }
      );
    });
  };

  // 데이터 구조 정의
  const Post = z.object({
    desc: z.string().max(140),
    isSensitive: z.boolean().optional(),
  });

  // verify the inputs
  const validateFields = Post.safeParse({
    desc,
    // "true" → true
    // "false" → false
    // (즉, 따옴표 제거 + 타입을 boolean으로 변환)
    isSensitive: JSON.parse(isSensitive as string), 
  });

  // validateFields { success: true, data: { desc: 'test post', isSensitive: false } }
  console.log("validateFields", validateFields); // validateFields 확인

  if (!validateFields.success) {
    console.log("validateFields", validateFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }
  // 변수 초기화
  let img = "";
  let imgHeight = 0;
  let video = "";

  if (file.size) {
    // uploadfile 리턴타입 -> Promise<UploadResponse>
    const result: UploadResponse = await uploadfile(file);

    if (result.fileType === "image") {
      img = result.filePath;
      imgHeight = result.height;
    } else {
      video = result.filePath;
    }
  }
  try {
    await prisma.post.create({
      data: {
        ...validateFields.data,
        userId,
        img,
        imgHeight,
        video,
      },
    });
    // 페이지를 캐시(정적 생성) -> 새 댓글을 포함한 최신 내용으로 업데이트
    revalidatePath(`/`);
    return { success: true, error: false };
  } catch (error) {
    console.log("error", error);
    return { success: false, error: true };
  }
};
