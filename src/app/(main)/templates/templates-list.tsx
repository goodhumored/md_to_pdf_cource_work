import LatexTemplate from "../../domain/latex-template/latex-template";
import LatexTemplateItem from "./template-item";

export default function TemplatesList({ className, templates }: { className?: string; templates: LatexTemplate[] }) {
  return (
    <div className={`flex flex-col ${className}`}>
      {templates.map((doc, i) => (
        <LatexTemplateItem key={i} template={doc} />
      ))}
    </div>
  );
}
