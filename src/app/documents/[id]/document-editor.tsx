"use client";

import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import "reflect-metadata";
import randInt from "../../../utils/randint";
import Loading from "../../components/common/loading";
import useDebounce from "../../hooks/common/use-debounce";
import handleChangeTemplate from "./handle-change-template";
import handleChangeTitle from "./handle-change-title";
import handleUpdateMd from "./handle-update-md";
import Picker from "./picker";
import Link from "next/link";

export default function DocumentEditor({
  className,
  mdCode,
  pdfFilePath,
  documentId,
  templates,
  titles,
  pickedTemplate,
  pickedTitle
}: {
  className?: string;
  mdCode: string;
  pdfFilePath: string;
  documentId: string;
  templates: { name: string; id: string }[];
  pickedTemplate: string | undefined;
  pickedTitle: string | undefined;
  titles: { name: string; id: string }[];
}) {
  const [md, setMd] = useState<string>(mdCode);
  const [pdfSource, setPdfSource] = useState(pdfFilePath);
  const [loading, setLoading] = useState(false);
  const debauncedMd = useDebounce(md, 1000);

  function refreshPdf() {
    return setPdfSource(`${pdfFilePath}?random=${randInt(0, 1000000)}`);
  }
  function loadingWhile<TPromise extends Promise<unknown>>(promise: TPromise): TPromise {
    setLoading(true);
    promise.finally(() => setLoading(false));
    return promise;
  }

  useEffect(() => {
    if (debauncedMd) loadingWhile(handleUpdateMd(documentId, debauncedMd).then(refreshPdf));
  }, [debauncedMd]);

  return (
    <div className="container">
      <div className="">
        <div className="font-bold">Титульный лист</div>
        <Picker
          onChange={(newTitle) =>
            loadingWhile(
              handleChangeTitle(documentId, newTitle === "undefined" ? undefined : newTitle).then(refreshPdf)
            )
          }
          pickedId={pickedTitle}
          items={[{ id: "undefined", name: "По умолчанию" }, ...titles]}
        />
      </div>
      <div className="">
        <div className="font-bold">LaTex шаблон</div>
        <Picker
          onChange={(newTemplate) =>
            loadingWhile(
              handleChangeTemplate(documentId, newTemplate === "undefined" ? undefined : newTemplate).then(refreshPdf)
            )
          }
          pickedId={pickedTemplate}
          items={[{ id: "undefined", name: "По умолчанию" }, ...templates]}
        />
      </div>
      <div className={`flex h-[700px] mb-10 ${className}`}>
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
          <div className="flex justify-between text-2xl">
            <div className="">PDF result</div>{" "}
            <div className="">
              <Link href={pdfSource} target="_blank">
                <FontAwesomeIcon icon={faDownload} />
              </Link>
            </div>
          </div>
          <div className="mt-4 h-full max-h-full overflow-y-scroll p-2 border-2 relative">
            {loading && <Loading />}
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer fileUrl={pdfSource} />
            </Worker>
          </div>
        </div>
      </div>
    </div>
  );
}
