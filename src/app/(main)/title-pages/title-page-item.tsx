import TitlePage from "../../domain/title-page/title-page";

export default function TitlePageItem({
  className,
  titlePage: template
}: {
  className?: string;
  titlePage: TitlePage;
}) {
  return (
    <div className={`w-full justify-between hover:bg-soft-brown-semitransparent flex py-1 px-2 ${className}`}>
      <div className="grow-1 max-w-auto shrink-0">
        <div className="w-full">{template.getName()}</div>
      </div>
    </div>
  );
}
