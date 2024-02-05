import Link from "next/link";
import UserDocument from "../../domain/user-document/user-document";

export default function DocumentItem({ className, document }: { className?: string; document: UserDocument }) {
  return (
    <Link
      href={`/documents/${document.getId()}`}
      className={`w-full justify-between hover:bg-soft-brown-semitransparent flex py-1 px-2 ${className}`}
    >
      <div className="grow-1 max-w-auto shrink-0">
        <div className="w-full">{document.getName()}</div>
      </div>
      <div className="grow-0 shrink text-dark-gray flex">
        <div className="">{document.getUpdatedAt().toUTCString()}</div>
        <div className="">{document.getCreatedAt().toUTCString()}</div>
      </div>
    </Link>
  );
}
