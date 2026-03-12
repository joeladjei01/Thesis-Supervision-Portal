import { useMemo, useRef } from "react";
import { useSearchParams } from "react-router";
import DocumentEditor, {
  type DocumentEditorRef,
} from "../../components/shared/DocumentEditor";
import { PdfViewer, type PdfViewerRef } from "../../components/shared/PdfViewer";
import { getFileNameFromURL } from "../../utils/helpers";

const getFileExtension = (fileName: string): string => {
  return fileName.split(".").pop()?.toLowerCase() || "";
};

const DocumentViewer = () => {
  const [searchParams] = useSearchParams();
  const fileUrl = searchParams.get("file") || "";
  const requestedName = searchParams.get("name") || "";

  const documentEditorRef = useRef<DocumentEditorRef>(null);
  const pdfViewerRef = useRef<PdfViewerRef>(null);

  const fileName = useMemo(() => {
    if (requestedName) {
      return decodeURIComponent(requestedName);
    }

    if (!fileUrl) {
      return "Document";
    }

    return decodeURIComponent(getFileNameFromURL(fileUrl.split("?")[0]));
  }, [fileUrl, requestedName]);

  const fileType = getFileExtension(fileName);
  const isPdf = fileType === "pdf";
  const isWord = fileType === "doc" || fileType === "docx";

  const handleSave = () => {
    if (isPdf) {
      pdfViewerRef.current?.save();
    } else if (isWord) {
      documentEditorRef.current?.save();
    }
  };

  console.log("DocumentViewer - fileUrl:", fileUrl);
  if (!fileUrl) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-600 text-sm">No document provided to view.</p>
      </div>
    );
  }

  if (!isPdf && !isWord) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            {fileName}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            This file type is not supported in the built-in viewer.
          </p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ug-blue hover:underline text-sm font-medium"
          >
            Open file in browser
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex justify-between items-center">
          <p className="text-sm font-medium text-gray-700">{fileName}</p>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Save Document
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3">
          {isPdf ? (
            <PdfViewer ref={pdfViewerRef} documentPath={fileUrl} />
          ) : (
            <DocumentEditor
              ref={documentEditorRef}
              documentPath={fileUrl}
              height="78vh"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
