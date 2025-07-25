// lama dev 강의 버전
// import { Webhook } from "svix";
// import { headers } from "next/headers";
// import { WebhookEvent } from "@clerk/nextjs/server";
// import { prisma } from "@/prisma";

// export async function POST(req: Request) {
//   const SIGNING_SECRET = process.env.SIGNING_SECRET;

//   if (!SIGNING_SECRET) {
//     throw new Error(
//       "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
//     );
//   }

//   // Create new Svix instance with secret
//   const wh = new Webhook(SIGNING_SECRET);

//   // Get headers
//   const headerPayload = await headers();
//   const svix_id = headerPayload.get("svix-id");
//   const svix_timestamp = headerPayload.get("svix-timestamp");
//   const svix_signature = headerPayload.get("svix-signature");

//   // If there are no headers, error out
//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response("Error: Missing Svix headers", {
//       status: 400,
//     });
//   }

//   // Get body
//   const payload = await req.json();
//   const body = JSON.stringify(payload);

//   let evt: WebhookEvent;

//   // Verify payload with headers
//   try {
//     evt = wh.verify(body, {
//       "svix-id": svix_id,
//       "svix-timestamp": svix_timestamp,
//       "svix-signature": svix_signature,
//     }) as WebhookEvent;
//   } catch (err) {
//     console.error("Error: Could not verify webhook:", err);
//     return new Response("Error: Verification error", {
//       status: 400,
//     });
//   }

//   // Do something with payload
//   // For this guide, log payload to console
//   const { id } = evt.data;
//   const eventType = evt.type;
//   console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
//   console.log("Webhook payload:", body);

//   if (eventType === "user.created") {
//     try {
//       await prisma.user.create({
//         data: {
//           id: evt.data.id,
//           username: JSON.parse(body).data.username,
//           email: JSON.parse(body).data.email_addresses[0].email_address,
//           img: JSON.parse(body).image_url || ""
//         },
//       });
//       return new Response("User created", { status: 200 });
//     } catch (err) {
//       console.log(err);
//       return new Response("Error: Failed to create a user!", {
//         status: 500,
//       });
//     }
//   }

//   if (eventType === "user.deleted") {
//     try {
//       await prisma.user.delete({ where: { id: evt.data.id } });
//       return new Response("User deleted", { status: 200 });
//     } catch (err) {
//       console.log(err);
//       return new Response("Error: Failed to create a user!", {
//         status: 500,
//       });
//     }
//   }

//   return new Response("Webhook received", { status: 200 });
// }

// 7.24  최신 버전
// User 생성후 Db에 저장하기
// import { prisma } from "@/prisma";
// import { verifyWebhook } from "@clerk/nextjs/webhooks";

// export async function POST(req: Request) {
//   try {
//     // console.log(req);
//     //  Clerk에서 Webhook으로 받은 이 JSON 객체 파싱
//     const evt = await verifyWebhook(req);
//     console.log("evt", evt); // data

//     // Do something with payload
//     // For this guide, log payload to console
//     const { id } = evt.data;
//     const eventType = evt.type;
//     console.log(
//       `Received webhook with ID ${id} and event type of ${eventType}`
//     );
//     // console.log("Webhook payload:", evt.data);

//     // evt.data.id 가 일치하는 한사람이 없기 때문에
//     // user.created 후 user.deleted  테스트 안됨
//     // user create
//     if (eventType === "user.created") {
//       // evt.data.username : 이 null , undefined 일때 -> ""
//       const username = evt.data.username ?? "";
//       const email = evt.data.email_addresses?.[0]?.email_address ?? "";
//       try {
//         await prisma.user.create({
//           data: {
//             id: evt.data.id, // user_29w83sxmDNGwOuEthce5gg56FcC
//             username,
//             email,
//           },
//         });
//         console.log("유저생성-------------------:", evt.data.id);

//         return new Response("User created", { status: 200 });
//       } catch (error) {
//         return new Response("Error: Failed to create a user!", { status: 500 });
//       }
//     }
//     // delete user
//     if (eventType === "user.deleted") {
//       try {
//         await prisma.user.delete({ where: { id: evt.data.id } }); // user_29wBMCtzATuFJut8jO2VNTVekS4
//         console.log("유저삭제-------------------:", evt.data.id);
//         return new Response("User deleted", { status: 200 });
//       } catch (error) {
//         return new Response("Error: Failed to create a user!", { status: 500 });
//       }
//     }

//     return new Response("Webhook received", { status: 200 });
//   } catch (err) {
//     console.error("Error verifying webhook:", err);
//     return new Response("Error verifying webhook", { status: 400 });
//   }
// }

// 7.24 최신 버전
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { prisma } from "@/prisma";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload:", evt.data);

    // user create
    if (eventType === "user.created") {
      // evt.data.username : 이 null , undefined 일때 -> ""
      const username = evt.data.username ?? "";
      const email = evt.data.email_addresses?.[0]?.email_address ?? "";
      try {
        await prisma.user.create({
          data: {
            id: evt.data.id, // user_29w83sxmDNGwOuEthce5gg56FcC
            username,
            email,
          },
        });
        console.log("유저생성-------------------:", evt.data.id);

        return new Response("User created", { status: 200 });
      } catch (error) {
        return new Response("Error: Failed to create a user!", { status: 500 });
      }
    }
    // delete user
    if (eventType === "user.deleted") {
      try {
        await prisma.user.delete({ where: { id: evt.data.id } }); // user_29wBMCtzATuFJut8jO2VNTVekS4
        console.log("유저삭제-------------------:", evt.data.id);
        return new Response("User deleted", { status: 200 });
      } catch (error) {
        return new Response("Error: Failed to create a user!", { status: 500 });
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
