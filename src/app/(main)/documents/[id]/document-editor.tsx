"use client";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import "reflect-metadata";
import handleChangeTemplate from "./handle-change-template";
import handleChangeTitle from "./handle-change-title";
import handleUpdateMd from "./handle-update-md";
import Picker from "./picker";
import Link from "next/link";
import useDebounce from "../../../hooks/common/use-debounce";
import randInt from "../../../../utils/randint";
import Loading from "../../../components/common/loading";
import PdfViewer from './pdf-viewer';

type DocumentEditorProps = {
  className?: string;
  mdCode: string;
  pdfFilePath: string;
  documentId: string;
  templates: { name: string; id: string }[];
  pickedTemplate: string | undefined;
  pickedTitle: string | undefined;
  titles: { name: string; id: string }[];
}

export default function DocumentEditor(props: DocumentEditorProps) {
  const {
    className,
    mdCode,
    pdfFilePath,
    documentId,
    templates,
    titles,
    pickedTemplate,
    pickedTitle
  } = props;

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
      <div className={`flex mb-10 ${className}`}>
        <div className="p-5 flex-1">
          <div className="text-2xl">Markdown</div>
          <div className="mt-4 aspect-[1/1.414] relative">
            <MDEditor
              className="absolute inset-0"
              preview="edit"
              height={"100%"}
              value={md}
              onChange={(newValue) => setMd(newValue ?? "")}
            />
          </div>
        </div>
        <div className="p-5 flex-1">
          <div className="flex justify-between text-2xl">
            <div className="">PDF result</div>{" "}
            <div className="">
              <Link href={pdfSource} target="_blank">
                <FontAwesomeIcon icon={faDownload} />
              </Link>
            </div>
          </div>
          <PdfViewer className="" link={pdfSource} />
        </div>
      </div>
    </div>
  );
}
