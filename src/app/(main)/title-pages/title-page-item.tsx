import { TitlePageDTO } from "../../api/title-pages/route";
import Image from "next/image"

export default function TitlePageItem({ className, titlePage: tp, }: { className?: string; titlePage: TitlePageDTO }) {
  return (
    <div
      className={`relative w-40 aspect-[1/1.414] justify-between flex flex-col group overflow-hidden ${className}`}
    >
      <div className=" px-4 w-full flex items-center justify-center bg-slate-200">
        {tp && (<Image src={tp.thumbnail} fill alt={tp.name} />)}
      </div>
      {tp &&
        <div className="
          absolute bottom-0 w-full text-black text-xs bg-black/30
          px-2 py-0.5
          translate-y-[calc(100%-2em)] opacity-60
          group-hover:translate-y-0 group-hover:opacity-90

          ">
          <div className="text-center text-black font-medium text-sm">{tp.name}</div>
        </div>
      }
    </div>
  );
}
