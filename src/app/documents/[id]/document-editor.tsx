"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import "reflect-metadata";
import randInt from "../../../utils/randint";
import Loading from "../../components/common/loading";
import useDebounce from "../../hooks/common/use-debounce";
import handleUpdateMd from "./handle-update-md";

export default function DocumentEditor({
  className,
  mdCode,
  pdfFilePath,
  documentId
}: {
  className?: string;
  mdCode: string;
  pdfFilePath: string;
  documentId: string;
}) {
  const [md, setMd] = useState<string>(mdCode);
  const [pdfSource, setPdfSource] = useState(pdfFilePath);
  const [loading, setLoading] = useState(false);
  const debauncedMd = useDebounce(md, 500);

  useEffect(() => {
    if (debauncedMd === "") return;
    setLoading(true);
    handleUpdateMd(documentId, debauncedMd).then(() => {
      setPdfSource(`${pdfFilePath}?random=${randInt(0, 1000000)}`);
      setLoading(false);
    });
  }, [debauncedMd]);

  return (
    <div className={`container flex h-[700px] mb-10 ${className}`}>
      <div className="p-5 basis-1/2">
        <div className="text-2xl">Markdown</div>
        <MDEditor
          className="max-h-full mt-4"
          preview="edit"
          height={"100%"}
          value={md}
          onChange={(newValue) => setMd(newValue ?? "")}
        />
      </div>
      <div className="p-5 basis-1/2">
        <div className="text-2xl">PDF result</div>
        <div className="mt-4 h-full max-h-full overflow-y-scroll p-2 border-2 relative">
          {loading && <Loading />}
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfSource} />
          </Worker>
        </div>
      </div>
    </div>
  );
}
