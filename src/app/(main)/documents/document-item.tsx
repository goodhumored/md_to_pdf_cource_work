import { Doc } from "./documents-list";
import Image from "next/image"

export default function DocumentItem({ className, document: doc, }: { className?: string; document?: Doc }) {
  return (
    <div
      className={`relative w-40 aspect-[1/1.414] justify-between flex flex-col group overflow-hidden ${className}`}
    >
      <div className=" px-4 w-full flex items-center justify-center bg-slate-200">
        {doc && (<Image src={doc.thumbnail} fill alt={doc.name} />)}
      </div>
      {doc &&
        <div className="
          absolute bottom-0 w-full text-black text-xs bg-black/30
          px-2 py-0.5
          translate-y-[calc(100%-2em)] opacity-60
          group-hover:translate-y-0 group-hover:opacity-90

          ">
          <div className="text-center text-black font-medium text-sm">{doc.name}</div>
          <div className="">Создан: {new Date(doc.createdAt).toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })}</div>
          <div className="">Изменён: {new Date(doc.updatedAt).toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })}</div>
        </div>
      }
    </div>
  );
}
