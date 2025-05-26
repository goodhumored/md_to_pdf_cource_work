"use client"

import TitlePageItem from "./title-page-item";

export default function TitlePageList({ className, titles: templates }: { className?: string; titles: TitlePage[] }) {
  const { Modal, openModal, isOpen } = useTitlePageModal();
  const [documents, setDocuments] = useState<Doc[]>([]);
  useEffect(() => {
    fetch("/api/title-pages").then((r) => r.json()).then(r => { console.log(r); setDocuments(r as Doc[]) }).catch(console.error)
  }, [isOpen])
  return (
    <div className={`flex flex-col ${className}`}>
      {templates.map((doc, i) => (
        <TitlePageItem key={i} titlePage={doc} />
      ))}
    </div>
  );
}
