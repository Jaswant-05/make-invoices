import {
    Document as PdfDoc,
    Page as PdfPage,
    Text,
    View,
    StyleSheet,
    pdf as pdfRenderer,
  } from "@react-pdf/renderer";
  import z from "zod";
  import { invoiceFormSchema } from "@/app/types/invoice";
  
  type Invoice = z.infer<typeof invoiceFormSchema>;
  
  const styles = StyleSheet.create({
    page: {
      padding: 36,
      backgroundColor: "#ffffff",
      fontFamily: "Helvetica",
      fontSize: 10,
      lineHeight: 1.35,
    },
    companyInfo : {
      marginTop : 18,
      fontSize :10
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 18,
      paddingBottom: 12,
      borderBottomWidth: 2,
      borderBottomColor: "#2563eb",
    },
    heading: { fontSize: 20, fontWeight: 700, color: "#111827" },
    label: { color: "#6b7280" },
    value: { color: "#111827" },
    section: { marginTop: 12 },
    row: { flexDirection: "row", gap: 16 },
    col: { flexGrow: 1 },
    table: {
      marginTop: 8,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderRadius: 4,
      overflow: "hidden",
    },
    thRow: {
      flexDirection: "row",
      backgroundColor: "#f9fafb",
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
      paddingVertical: 8,
      paddingHorizontal: 8,
    },
    tr: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#f3f4f6",
      paddingVertical: 8,
      paddingHorizontal: 8,
    },
    th: { flex: 1, fontWeight: 700, color: "#374151" },
    td: { flex: 1, color: "#111827" },
    tdRight: { flex: 1, textAlign: "right" },
    totals: {
      marginTop: 8,
      marginLeft: "auto",
      width: "50%",
      padding: 8,
    },
    totalsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
    notes: { marginTop: 12, color: "#374151" },
  });
  
  function currencyFmt(code: string, n: number) {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: code }).format(n);
    } catch {
      return `${code} ${n.toFixed(2)}`;
    }
  }
  
  const qty = (q?: number | null) => (typeof q === "number" && q > 0 ? q : 1);
  
  function InvoicePDF({ invoice }: { invoice: Invoice }) {
    const items = invoice.invoiceItems ?? [];
    const subtotal = items.reduce((acc, it) => acc + it.amount * qty(it.quantity), 0);
    const taxPct = parseInt(invoice.tax as any) || 0;
    const taxAmount = subtotal * (taxPct / 100);
    const total = subtotal + taxAmount;
  
    return (
      <PdfDoc>
        <PdfPage size="LETTER" style={styles.page}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.heading}>INVOICE</Text>
              <View style={styles.companyInfo}>
                <Text style={styles.value}>{invoice.companyName}</Text>
                {invoice.companyEmail && <Text style={styles.label}>{invoice.companyEmail}</Text>}
                {invoice.companyNumber && <Text style={styles.label}>{invoice.companyNumber}</Text>}
                {invoice.companyAddress && <Text style={styles.label}>{invoice.companyAddress}</Text>}
              </View>
            </View>
            <View>
              <Text style={styles.label}>Invoice #</Text>
              <Text style={styles.value}>
                {invoice.invoicePrefix}
                {invoice.invoiceSerialNumber}
              </Text>
              <Text style={[styles.label, { marginTop: 6 }]}>Date</Text>
              <Text style={styles.value}>
                {invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : ""}
              </Text>
              {invoice.paymentTerms && (
                <>
                  <Text style={[styles.label, { marginTop: 6 }]}>Terms</Text>
                  <Text style={styles.value}>{invoice.paymentTerms}</Text>
                </>
              )}
            </View>
          </View>

          <View style={[styles.section, styles.row]}>
            <View style={styles.col}>
              <Text style={styles.label}>Bill To</Text>
              <Text style={styles.value}>{invoice.toCompany}</Text>
              {invoice.toEmail && <Text style={styles.label}>{invoice.toEmail}</Text>}
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Currency</Text>
              <Text style={styles.value}>{invoice.currency}</Text>
            </View>
          </View>

          <View style={[styles.section, styles.table]}>
            <View style={styles.thRow}>
              <Text style={[styles.th, { flex: 2 }]}>Item</Text>
              <Text style={[styles.th, { textAlign: "right" }]}>Qty</Text>
              <Text style={[styles.th, { textAlign: "right" }]}>Amount</Text>
              <Text style={[styles.th, { textAlign: "right" }]}>Line Total</Text>
            </View>
            {items.length === 0 ? (
              <View style={styles.tr}>
                <Text style={styles.td}>No items</Text>
              </View>
            ) : (
              items.map((it, i) => {
                const q = qty(it.quantity);
                const line = it.amount * q;
                return (
                  <View key={i} style={styles.tr}>
                    <Text style={[styles.td, { flex: 2 }]}>{it.name}</Text>
                    <Text style={styles.tdRight}>{q}</Text>
                    <Text style={styles.tdRight}>{currencyFmt(invoice.currency, it.amount)}</Text>
                    <Text style={styles.tdRight}>{currencyFmt(invoice.currency, line)}</Text>
                  </View>
                );
              })
            )}
          </View>

          <View style={styles.totals}>
            <View style={styles.totalsRow}>
              <Text style={styles.label}>Total without tax</Text>
              <Text style={styles.value}>{currencyFmt(invoice.currency, subtotal)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.label}>Tax ({taxPct.toFixed(2)}%)</Text>
              <Text style={styles.value}>{currencyFmt(invoice.currency, taxAmount)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.label}>Total</Text>
              <Text style={styles.value}>{currencyFmt(invoice.currency, total)}</Text>
            </View>
          </View>

          {invoice.additionalNotes && (
            <View style={styles.notes}>
              <Text style={styles.label}>Notes</Text>
              <Text style={styles.value}>{invoice.additionalNotes}</Text>
            </View>
          )}
        </PdfPage>
      </PdfDoc>
    );
  }
  
  export async function createPdfBlob({ invoice }: { invoice: Invoice }) {
    const blob = await pdfRenderer(<InvoicePDF invoice={invoice} />).toBlob();
    return blob;
  }
  