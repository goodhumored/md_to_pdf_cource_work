import LatexTemplate from "../../domain/latex-template/latex-template";

export default function LatexTemplateItem({ className, template }: { className?: string; template: LatexTemplate }) {
  return (
    <div className={`w-full justify-between hover:bg-soft-brown-semitransparent flex py-1 px-2 ${className}`}>
      <div className="grow-1 max-w-auto shrink-0">
        <div className="w-full">{template.getName()}</div>
      </div>
    </div>
  );
}
