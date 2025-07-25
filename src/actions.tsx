"use server"

import { imagekit } from "./utils";
import ImageKit from "imagekit"

// 이미지 업로드 서버 액션
// Next.js의 Server Actions에서 기본적으로 1MB 제한이 있음. -> next.config.ts 에서 설정



/**
 * 폼이 제출되면(Post 버튼이 눌리면) formData 객체가 생성되며, 
 * Share 컴포넌트에서 name 속성이 설정된 <input> 요소들의 값이 formData로 전달됩니다.
 * 
 */
export const shareAction = async(
    formData: FormData , 
    settings:{ type: "original" | "wide" | "square",
    sensitive: boolean}) =>{

    // Sahre 컴포넌트의 input 요소에서 name="file"로 지정한 필드를 가져옴
    const file = formData.get("file") as File
    console.log("action 컴포넌트!!!!!!!!!!!", file);
    
    
    // File 객체는 Blob 객체를 상속받은 타입
    // console.log("file < File 의 타입",file instanceof Blob); // true
    // const desc = formData.get("desc") as String// Sahre 컴포넌트의 input 요소에서 name="desc"로 지정한 필드를 가져옴

    // console.log("file , desc",file);
    // console.log("file size",file.size);
    console.log("settings.type",settings.type);
    


    /**
     * Blob 이진 대용량 객체  Binary Large Object
     * file은 File 객체인데, File은 Blob을 상속받은 타입
     * (Blob 기반: 주로 이미지, 동영상, 오디오, 문서 파일처럼 용량이 큰 이진 데이터를 저장할 때 사용) 
     * 
     * file.arrayBuffer()
       File 데이터를 '메모리에서 다룰 수 있는' 
       이진 데이터 형태(binary)로 변환하는 과정.
     */
    const bytes = await file.arrayBuffer()
    // console.log("bytes",bytes);
    
    // Node.js의 Buffer 객체
    const buffer = Buffer.from(bytes)
    // ar : aspect -ratio
    const transformation = `w-600, 
    ${
        settings.type === "square"
          ? "ar-1-1"                 // w-600 h-600
          : settings.type === "wide"
          ? "ar-16-9"
          : ""                       // original
      }`;

    imagekit.upload({

        file: buffer,
        fileName: file.name,
        folder: "/posts", // 이미지를 저장할 폴더
        // ... : true일 경우 { transformation: { pre: transformation } } 객체의 내용을 개별 속성으로 펼쳐서 복사 (...)
        ...(file.type.includes("image")) && { 
            transformation: {
            pre: transformation,
            }},

        customMetadata:{
            sensitive: settings.sensitive, //  imagekit -> settings ->mediaLibrary -> Custom metadata -> 에서 설정함
        }

    },function(error, result) {
        if(error) console.log("업로드 에러!",error);
        else console.log("업로드 결과",result);
    })


}