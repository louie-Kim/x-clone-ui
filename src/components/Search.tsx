import Image from "./Image";

const Search = () => {
  return (
    <div className="bg-inputGray py-2 px-2 flex items-cneter gap-4 rounded-full">
      {/* 돋보기 이미지 */}
      <Image path="New%20Folder/explore.svg" alt="search" w={16} h={16} />
      <input
        type="text"
        placeholder="Search"
        className="bg-transparent outline-none placeholder:text-textGray"
      />
    </div>
  );
};

export default Search;
