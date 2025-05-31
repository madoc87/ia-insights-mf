'use client'

import { useReactToPrint } from 'react-to-print'
import { FaFilePdf } from 'react-icons/fa'

export const PrintButton = ({ contentRef }: { contentRef: React.RefObject<HTMLDivElement> }) => {
  const handlePrint = useReactToPrint({
    contentRef, // Mudança aqui: use contentRef em vez de content
    documentTitle: `Relatório-Mundo-dos-Filtros-${new Date().toISOString()}`,
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 15mm;
      }
      .print-table {
        font-size: 12px !important;
      }
      .no-print {
        display: none !important;
      }
    `
  });

  return (
    <button
      onClick={handlePrint}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
    >
      <FaFilePdf className="h-4 w-4" />
      Exportar PDF
    </button>
  );
};
