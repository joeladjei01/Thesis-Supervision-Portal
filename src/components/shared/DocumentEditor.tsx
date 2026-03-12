import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-lists/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-documenteditor/styles/material.css";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

import {
  DocumentEditorContainerComponent,
  Toolbar,
} from "@syncfusion/ej2-react-documenteditor";
import { registerLicense } from "@syncfusion/ej2-base";

DocumentEditorContainerComponent.Inject(Toolbar);

interface DocumentEditorProps {
  documentPath?: string;
  height?: string;
}

export interface DocumentEditorRef {
  save: () => void;
  saveAsBlob: (
    formatType?: "Docx" | "Dotx" | "Txt" | "Sfdt",
  ) => Promise<Blob | null>;
}

const DocumentEditor = forwardRef<DocumentEditorRef, DocumentEditorProps>(
  ({ documentPath, height = "590px" }, ref) => {
    const documentEditorRef = useRef<DocumentEditorContainerComponent | null>(
      null,
    );

    registerLicense(
      "Ngo9BigBOggjHTQxAR8/V1JGaF1cXmhNYVFpR2NbeU5xflRFal5TVBYiSV9jS3hTdUVgWHxdeHVXRWdfVk91XQ==",
    );

    useImperativeHandle(ref, () => ({
      save: () => {
        if (documentEditorRef.current?.documentEditor) {
          documentEditorRef.current.documentEditor.save(
            documentEditorRef.current.documentEditor.documentName,
            "Docx",
          );
        }
      },
      saveAsBlob: async (formatType = "Docx") => {
        const documentEditor = documentEditorRef.current?.documentEditor;
        if (!documentEditor) {
          return null;
        }

        const editorWithBlobSave = documentEditor as unknown as {
          saveAsBlob: (
            format: "Docx" | "Dotx" | "Txt" | "Sfdt",
          ) => Promise<Blob>;
        };

        return editorWithBlobSave.saveAsBlob(formatType);
      },
    }));

    useEffect(() => {
      if (!documentPath || !documentEditorRef.current?.documentEditor) {
        return;
      }

      let isCancelled = false;

      const loadDocument = async () => {
        try {
          const response = await fetch(documentPath);
          if (!response.ok) {
            throw new Error("Unable to fetch document");
          }

          const documentBlob = await response.blob();
          const fileName = decodeURIComponent(
            documentPath.split("/").pop()?.split("?")[0] || "Document",
          );

          if (!isCancelled && documentEditorRef.current?.documentEditor) {
            documentEditorRef.current.documentEditor.documentName = fileName;
            await documentEditorRef.current.documentEditor.openAsync(
              documentBlob,
            );
          }
        } catch (err) {
          console.log("Failed to open document file", err);
        }
      };

      loadDocument();

      return () => {
        isCancelled = true;
      };
    }, [documentPath]);

    return (
      <DocumentEditorContainerComponent
        id="document-editor-container"
        ref={documentEditorRef}
        height={height}
        serviceUrl="https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/"
        enableToolbar={true}
      />
    );
  },
);

DocumentEditor.displayName = "DocumentEditor";

export default DocumentEditor;
