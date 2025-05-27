import Image from "next/image"
import { TemplateDTO } from "../../api/templates/route";
import trash from "@/../public/icons/trash.svg";

export default function TemplateItem({ className, template: tp, onDelete = () => { } }: { className?: string; template: TemplateDTO, onDelete: () => void }) {
  return (
    <div
      className={`relative aspect-[1/1.414] justify-between flex flex-col group overflow-hidden ${className}`}
    >
      <div className=" px-4 w-full flex items-center justify-center bg-slate-200">
        <Image src={tp.thumbnail} fill alt={tp.name} />
      </div>
      <div className="
          absolute bottom-0 w-full text-black text-xs bg-black/30
          px-2 py-0.5
          translate-y-[calc(100%-2em)] opacity-60
          group-hover:translate-y-0 group-hover:opacity-90
          ">
        <div className="text-center text-black font-medium text-sm">{tp.name}</div>
      </div>
      <div className="absolute z-100 top-2 right-2 group-hover:block hidden">
        <button type="button" onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onDelete()
        }} className="p-1 hover:brightness-120 rounded-sm bg-black/30"><Image className="w-4" src={trash} alt="delete" /></button>
      </div>
    </div>
  );
}
