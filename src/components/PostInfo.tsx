import Image from "./Image"

// IKImage 이미지 컴포넌트에 tr(transformation) 사용시 부모 태그가 relative, absolute, fixed 중 하나여야 함
const PostInfo = () => {
  return (
    <div className="cursor-pointer w-4 h-4 relative">
      <Image path="New%20Folder/infoMore.svg" alt="" w={16} h={16}/>
    </div>
  )
}

export default PostInfo
