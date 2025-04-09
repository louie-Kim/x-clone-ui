"use client"


import { IKVideo } from "imagekitio-next";
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;


type VideoTypes = {
    path: string;
    className?: string;
  };

const Video = ({ path, className } : VideoTypes ) => {
  return (
    <IKVideo 
    urlEndpoint={urlEndpoint} 
    path={path} 
    className={className} 
    // 비디오 사이즈, 퀄리티 
    // 영상위에 레이어 올리기 : raw : l-text (글자 ),i-Imagekit (쓸글자자),fs-50(폰트 사이즈),l-end(레이어 마무리)
    transformation={[
        { width: "1920", height: "1080",  q:"80"},
        { raw: "l-text,i-Lamadev,fs-100, co-white ,l-end" }
    ]}
    controls
    />
  )
}

export default Video