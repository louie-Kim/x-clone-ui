import ImageKit from "imagekit"


// console.log("🔍🔍🔍🔍PRIVATE_KEY:", process.env.PRIVATE_KEY); // 🔍 확인용 로그


export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});


