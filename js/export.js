/**
 * Document Export & PDF Generation Utilities
 * Uses html2canvas + jsPDF to export crisp, undistorted A4 Insurance Certificates
 */

const DocumentExporter = {
  /**
   * High-Resolution A4 Multi-Page PDF Exporter
   */
  async downloadAsPdf(elementId, filename = 'Insurance_Certificate.pdf') {
    const container = document.getElementById(elementId);
    if (!container) {
      UI.showToast('Document container not found for PDF export', 'error');
      return false;
    }

    try {
      UI.showToast('Rendering official 2-page PDF certificate...', 'info', 3000);

      const { jsPDF } = window.jspdf || window;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;

      let pages = container.querySelectorAll('.pdf-page');
      if (!pages || pages.length === 0) {
        pages = [container];
      }

      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i];

        if (i > 0) {
          pdf.addPage('a4', 'p');
        }

        const canvas = await window.html2canvas(pageEl, {
          scale: 2, // Crisp high resolution (300 DPI)
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: 794,
          height: 1123,
          windowWidth: 794
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }

      pdf.save(filename);
      UI.showToast('✅ Official PDF Certificate downloaded successfully!', 'success');
      return true;
    } catch (err) {
      console.error('PDF export error:', err);
      UI.showToast('PDF rendering encountered an error: ' + err.message, 'error');
      return false;
    }
  },

  printDocument() {
    window.print();
  }
};

window.DocumentExporter = DocumentExporter;
