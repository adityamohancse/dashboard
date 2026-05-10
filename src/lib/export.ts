"use client";

import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

export function exportToExcel<T>(data: T[], fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToPDF<T>(data: T[], title: string) {
  const normalized = data.map(
    (row) => JSON.parse(JSON.stringify(row)) as Record<string, unknown>,
  );
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 14);

  const rows = normalized.map((row) => Object.values(row).map((value) => String(value)));
  const head = [Object.keys(normalized[0] ?? { info: "No Data" })];

  autoTable(doc, {
    head,
    body: rows.length ? rows : [["No rows"]],
    startY: 22,
    styles: { fontSize: 8 },
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}

