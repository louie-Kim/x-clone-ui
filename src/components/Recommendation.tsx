import Link from "next/link";
import Image from "./Image";

const Recommendation = () => {
  return (
    <div className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4">
      {/* user card 1*/}
      <div className="flex items-center justify-between">
        {/* image and user info */}
        <div className="flex items-center gap-2">
          <div className="relative rounded-full overflow-hidden w-10 h-10">
            <Image path="New%20Folder/avatar.png" alt="John Doe" w={100} h={100} tr={true}/>
          </div>

          <div className="">
            <h1 className="text-md font-bold">John Doe</h1>
            <span className="text-textGray text-sm">@johndoe</span>
          </div>
        </div>

        <button className="py-1 px-4 font-semibold bg-white text-black rounded-full">Follow</button>

      </div>
      {/* user card 2*/}
      <div className="flex items-center justify-between">
        {/* image and user info */}
        <div className="flex items-center gap-2">
          <div className="relative rounded-full overflow-hidden w-10 h-10">
            <Image path="New%20Folder/avatar.png" alt="John Doe" w={100} h={100} tr={true}/>
          </div>

          <div className="">
            <h1 className="text-md font-bold">John Doe</h1>
            <span className="text-textGray text-sm">@johndoe</span>
          </div>
        </div>

        <button className="py-1 px-4 font-semibold bg-white text-black rounded-full">Follow</button>

      </div>
       {/* user card 3*/}
      <div className="flex items-center justify-between">
        {/* image and user info */}
        <div className="flex items-center gap-2">
          <div className="relative rounded-full overflow-hidden w-10 h-10">
            <Image path="New%20Folder/avatar.png" alt="John Doe" w={100} h={100} tr={true}/>
          </div>

          <div className="">
            <h1 className="text-md font-bold">John Doe</h1>
            <span className="text-textGray text-sm">@johndoe</span>
          </div>
        </div>

        <button className="py-1 px-4 font-semibold bg-white text-black rounded-full">Follow</button>

      </div>

      <Link href="/" className="text-iconBlue">
        show more
      </Link>

    </div>
  );
};

export default Recommendation;
