
import Feed from "@/components/Feed"
import Share from "@/components/Share"
import Link from "next/link"


// justify-between 부모 -> 개별 자식 요소에서 justify-center를 적용해도 부모의 justify-between이 이미 공간을 분배하고 있어서 효과가 나타나지 않습니다.
const Homepage = () => {



  return (
    <div className=''>
      <div className="px-4 pt-4 flex justify-between text-textGray font-bold border-b-[1px] border-borderGray">
        <Link className="pb-3 flex items-center border-b-4 border-iconBlue" href="/">For you</Link>
        <Link className="pb-3 flex items-center" href="/">Following</Link>
        <Link className="hidden pb-3 md:flex items-center" href="/">React.js</Link>
        <Link className="hidden pb-3 md:flex items-center" href="/">Javascript</Link>
        <Link className="hidden pb-3 md:flex items-center" href="/">CSS</Link>
      </div>
      {/* 내가 포스팅하는곳 */}
      <Share/> 
      {/* 남이 올린 곳 */}
      <Feed/>
    </div>
  )
}

export default Homepage