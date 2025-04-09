"use client"
import { IKImage } from "imagekitio-next";


// :? 
type ImageType = {
    path: string; // 필수 속성
    w?: number;   // 선택 속성
    h?: number;
    alt: string;
    className?: string;
    tr?: boolean;  // 
}

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;



const Image = ({ path, w, h, alt, className, tr }:ImageType ) => {

  // console.log("tr", tr);
  // console.log(" w, h",  w, h); 
  // console.log("urlEndpoint", urlEndpoint);
  // console.log("이미지 컴포넌트 path", path);
  

  return (
    // transformation -> 이미지 컴포넌트 프롭스 fill={true} 자동 설정 (부모요소에 딱! 맞게크기 설정) -> 부모태그가 relative, absolute, fixed 중 하나여야 함
    <IKImage 
    // https://ik.imagekit.io/jykim + New%20Folder/이미지.svg
    urlEndpoint={urlEndpoint} 
    path={path} 
    // width={w} 
    // height={h}
    // transformation={[{ width: `${w}`, height: `${h}` }]}
    // 여기서 삼항 연산자(tr ? A : B)가 먼저 평가된 후, 그 결과 객체(A 또는 B)를 ...이 복사하여 적용합니다.
    {...(tr 
      ? { transformation: [{ width:  `${w}`, height: `${h}` }] }
      : { width: w, height: h }
    )}
    // Low-Quality Image Placeholder : 
    // 원본 이미지 대신 저해상도 이미지를 먼저 보여주고, 원본이 로드되면 자동으로 교체
    // 저해상도(LQIP) 이미지의 품질을 20% 수준으로 설정
    lqip={{ active:true, quality: 20 }}
    alt={alt}
    className={className}
    />

  )
}

export default Image