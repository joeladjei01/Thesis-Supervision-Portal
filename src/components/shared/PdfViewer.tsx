import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";
import "@syncfusion/ej2-pdfviewer/styles/material.css";

import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  PdfViewerComponent,
  Toolbar,
  Magnification,
  Navigation,
  LinkAnnotation,
  BookmarkView,
  ThumbnailView,
  Print,
  TextSelection,
  Annotation,
  TextSearch,
  FormFields,
  FormDesigner,
  Inject,
} from "@syncfusion/ej2-react-pdfviewer";
import { registerLicense } from "@syncfusion/ej2-base";

export interface PdfViewerRef {
  save: () => void;
  saveAsBlob: () => Promise<Blob | null>;
}

export const PdfViewer = forwardRef<PdfViewerRef, { documentPath: string }>(
  ({ documentPath }, ref) => {
    const pdfViewerRef = useRef<PdfViewerComponent | null>(null);

    registerLicense(
      "Ngo9BigBOggjHTQxAR8/V1JGaF1cXmhNYVFpR2NbeU5xflRFal5TVBYiSV9jS3hTdUVgWHxdeHVXRWdfVk91XQ==",
    );

    useImperativeHandle(ref, () => ({
      save: () => {
        if (pdfViewerRef.current) {
          pdfViewerRef.current.download();
        }
      },
      saveAsBlob: async () => {
        if (!pdfViewerRef.current?.saveAsBlob) {
          return null;
        }

        return pdfViewerRef.current.saveAsBlob();
      },
    }));

    return (
      <div>
        <div className="control-section">
          <PdfViewerComponent
            id="container"
            ref={pdfViewerRef}
            documentPath={documentPath}
            resourceUrl="https://cdn.syncfusion.com/ej2/31.2.2/dist/ej2-pdfviewer-lib"
            style={{ height: "640px" }}
          >
            <Inject
              services={[
                Toolbar,
                Magnification,
                Navigation,
                Annotation,
                LinkAnnotation,
                BookmarkView,
                ThumbnailView,
                Print,
                TextSelection,
                TextSearch,
                FormFields,
                FormDesigner,
              ]}
            />
          </PdfViewerComponent>
        </div>
      </div>
    );
  },
);

PdfViewer.displayName = "PdfViewer";
