"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import { RenderPdfApiResponse } from "./api/pdf/route";
import useDebounce from "./hooks/common/use-debounce";
import randInt from "../utils/randint";
import Loading from "../components/common/loading";

export default function Home() {
  const [md, setMd] = useState<string>("");
  const [pdfSource, setPdfSource] = useState("/Nekrasov4142.pdf");
  const [loading, setLoading] = useState(false);
  const debauncedMd = useDebounce(md, 500);

  useEffect(() => {
    setLoading(true);
    fetch("/api/pdf", { method: "POST", body: debauncedMd }).then((resp) =>
      resp.json().then((json: RenderPdfApiResponse) => {
        setPdfSource(`${json.fileName}?random=${randInt(0, 1000000)}`);
        setLoading(false);
      })
    );
  }, [debauncedMd]);

  return (
    <div className="container flex h-[700px] mb-10">
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
        <div className="mt-4 max-h-full overflow-y-scroll p-2 border-2 relative">
          {loading && <Loading />}
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfSource} />
          </Worker>
        </div>
      </div>
    </div>
  );
}
