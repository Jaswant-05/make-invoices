"use client";

import "../app/utils/setupWorker";
import { createPdfBlob } from "@/app/utils/create-pdf-blob";
import { parseCatchError } from "@/app/utils/parseCatchError";
import { useMounted, useResizeObserver } from "@mantine/hooks";
import PDFLoading from "./PDFLoading";
import PDFError from "./PDFError";

import React, { useEffect, useRef, useState } from "react";
import { cloneDeep, debounce, isEqual } from "lodash";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { invoiceFormSchema } from "@/app/types/invoice";
import { Document, Page } from "react-pdf";

type InvoiceValues = z.infer<typeof invoiceFormSchema>;

const PDF_VIEWER_PADDING = 18;

/** Blob URL helper for iframe mode */
function useBlobUrl(blob: Blob | null) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!blob) { setUrl(null); return; }
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);
  return url;
}

/** Make partial/invalid values safe for the PDF template */
function makeSafeInvoice(v: Partial<InvoiceValues>): InvoiceValues {
  return {
    logo: v.logo ?? undefined,
    companyName: v.companyName ?? "",
    companyAddress: v.companyAddress ?? "",
    companyEmail: v.companyEmail ?? "",
    companyNumber: v.companyNumber ?? "",
    toCompany: v.toCompany ?? "",
    toEmail: v.toEmail ?? "",
    currency: v.currency ?? "USD",
    invoicePrefix: v.invoicePrefix ?? "INV-",
    invoiceSerialNumber: v.invoiceSerialNumber ?? "001",
    invoiceDate: v.invoiceDate ? new Date(v.invoiceDate) : new Date(),
    paymentTerms: v.paymentTerms ?? "",
    additionalNotes: v.additionalNotes ?? "",
    invoiceItems: Array.isArray(v.invoiceItems)
      ? v.invoiceItems.map((it) => ({
          name: it?.name ?? "",
          amount: Number.isFinite(it?.amount as any) ? (it!.amount as number) : 0,
          quantity: typeof it?.quantity === "number" && it!.quantity! > 0 ? it!.quantity : 1,
        }))
      : [],
  };
}

/** One viewer that can render via react-pdf or iframe */
function PdfLayer({
  blob,
  width,
  hidden,
  useIframe,
  onReady,
  onErrorFallbackToIframe,
}: {
  blob: Blob | null;
  width: number;
  hidden?: boolean;                 // render off-screen for preloading
  useIframe: boolean;               // global “prefer iframe” flag
  onReady: () => void;              // fire when layer fully rendered
  onErrorFallbackToIframe: () => void; // switch global mode if react-pdf errors
}) {
  const [err, setErr] = useState<Error | null>(null);
  const iframeUrl = useBlobUrl(blob);
  const w = width === 0 ? 600 : width;
  const pageWidth = Math.max(120, (w > 600 ? 600 : w) - PDF_VIEWER_PADDING);

  // Style to keep layer in the stack; hidden layers don't affect layout/visibility
  const layerClass =
    "absolute inset-0 flex items-center justify-center transition-opacity duration-100";
  const visibility = hidden ? "opacity-0 pointer-events-none" : "opacity-100";

  if (!blob) {
    return (
      <div className={`${layerClass} ${visibility}`}>
        <PDFLoading />
      </div>
    );
  }

  // If iframe mode or react-pdf failed, render iframe
  if (useIframe || err) {
    return (
      <div className={`${layerClass} ${visibility}`}>
        {iframeUrl ? (
          <iframe
            key={iframeUrl}
            src={iframeUrl}
            className="h-full w-full border-0"
            onLoad={onReady}
          />
        ) : (
          <PDFError message="Unable to display PDF." />
        )}
      </div>
    );
  }

  return (
    <div className={`${layerClass} ${visibility}`}>
      <Document
        key={`${(blob as any)?.size}-${(blob as any)?.type}`}
        file={blob}
        loading={null}
        onLoadSuccess={() => {
          onReady();
        }}
        onLoadError={(error) => {
          console.error("[react-pdf] load error:", error);
          setErr(error);
          onErrorFallbackToIframe();
        }}
        className="scroll-bar-hidden dark:bg-background flex h-full max-h-full w-full items-center justify-center overflow-y-scroll py-[18px] sm:items-start"
      >
        <Page
          pageNumber={1}
          width={pageWidth}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}

export default function InvoicePreview({
  form,
}: {
  form: UseFormReturn<InvoiceValues>;
}) {
  const isClient = useMounted();
  const [resizeRef, container] = useResizeObserver();

  const [previewData, setPreviewData] = useState<InvoiceValues>(
    makeSafeInvoice(form.getValues())
  );
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Double buffer blobs
  const [activeBlob, setActiveBlob] = useState<Blob | null>(null);  
  const [stagingBlob, setStagingBlob] = useState<Blob | null>(null); 

  // Global rendering mode (once we detect DOMMatrix/worker issues, stick to iframe)
  const [preferIframe, setPreferIframe] = useState(false);

  const lastProcessed = useRef<InvoiceValues>(form.getValues());

  useEffect(() => {
    const process = (value: InvoiceValues) => {
      if (isEqual(value, lastProcessed.current)) return;
      lastProcessed.current = cloneDeep(value);
      setPreviewData(makeSafeInvoice(value));
    };

    const debounced = debounce(process, 300);
    const sub = form.watch((val) => debounced(val as InvoiceValues));

    return () => {
      sub.unsubscribe();
      debounced.cancel();
    };
  }, [form]);

  useEffect(() => {
    let cancelled = false;
    setPdfError(null);

    (async () => {
      try {
        const blob = await createPdfBlob({ invoice: previewData });
        if (cancelled) return;
        setStagingBlob(blob); // triggers hidden layer render
      } catch (err) {
        const friendly = parseCatchError(err, "Failed to generate PDF");
        setPdfError(friendly);
        setStagingBlob(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [previewData]);

  useEffect(() => {
    if (!activeBlob && stagingBlob) {
      setActiveBlob(stagingBlob);
      setStagingBlob(null);
    }
  }, [activeBlob, stagingBlob]);

  return (
    <div
      ref={resizeRef}
      className="flex-1 min-w-0 relative h-full overflow-hidden bg-sidebar"
    >
      {!isClient ? (
        <PDFLoading />
      ) : pdfError ? (
        <PDFError message={pdfError} />
      ) : !activeBlob && !stagingBlob ? (
        <PDFLoading />
      ) : (
        <>
          {/* Active layer (visible) */}
          <PdfLayer
            blob={activeBlob}
            width={container.width}
            hidden={false}
            useIframe={preferIframe}
            onReady={() => {
              /* already visible */
            }}
            onErrorFallbackToIframe={() => setPreferIframe(true)}
          />

          {/* Staging layer (hidden). When ready, promote to active WITHOUT unmounting active first */}
          <PdfLayer
            blob={stagingBlob}
            width={container.width}
            hidden={true}
            useIframe={preferIframe}
            onReady={() => {
              // swap instantly—no flash because active stays until staging is fully rendered
              setActiveBlob(stagingBlob);
              setStagingBlob(null);
            }}
            onErrorFallbackToIframe={() => setPreferIframe(true)}
          />
        </>
      )}
    </div>
  );
}
