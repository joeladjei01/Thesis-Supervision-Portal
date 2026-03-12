import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

function Portal({ children }: { children: ReactNode }) {
  const elRef = useRef<HTMLDivElement | null>(null);
  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }
  useEffect(() => {
    const modalRoot = document.getElementById("modal-root");
    if (modalRoot && elRef.current) {
      modalRoot.appendChild(elRef.current);
    }
    return () => {
      if (modalRoot && elRef.current) {
        modalRoot?.removeChild(elRef.current);
      }
    };
  });
  return createPortal(<div>{children}</div>, elRef.current);
}

export default Portal;
