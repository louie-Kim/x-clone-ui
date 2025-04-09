import PopularTags from "./PopularTags"
import Recommendation from "./Recommendation"
import Search from "./Search"
import Link from "next/link";


const RightBar = () => {
  return (
    // top-0 -> h-max : height: max-content ( 자식요소 개수 만큼 고정 ) 
    <div className="pt-4 flex flex-col gap-4 sticky top-0 h-max">
      <Search/>
      <PopularTags/>
      <Recommendation/>

      {/* footer */}
      {/* flex (가로 정렬) -> gap-x-4  자식 요소들 사이에 x 간격(마진)을 추가 ,  gap-y-4도 테스트 해보기*/}
      {/* flex-wrap : 가로 공간을 초과하면 자동으로 줄 바꿈 */}
      <div className="text-textGray text-sm flex gap-x-4 flex-wrap">
        <Link href="/">Terms of Service</Link>
        <Link href="/">Privacy Policy</Link>
        <Link href="/">Cookie Policy</Link>
        <Link href="/">Accessibility</Link>
        <Link href="/">Ads Info</Link>
        <span>© 2025 L Corp.</span>
      </div>
      
    </div>
  )
}

export default RightBar