import TitlePage from "../../domain/title-page/title-page";
import TitlePageItem from "./title-page-item";

export default function TitlePageList({ className, titles: templates }: { className?: string; titles: TitlePage[] }) {
  return (
    <div className={`flex flex-col ${className}`}>
      {templates.map((doc, i) => (
        <TitlePageItem key={i} titlePage={doc} />
      ))}
    </div>
  );
}
