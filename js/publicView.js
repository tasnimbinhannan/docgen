/**
 * Public Document Viewer Module (SRS FR-3.1 - FR-3.6)
 * Unauthenticated document rendering by public_token
 */

const PublicView = {
  currentDocument: null,

  async init() {
    this.bindEvents();
    const token = this.getUrlToken();

    if (!token) {
      this.showNotFound('No public document token was provided in the URL.');
      return;
    }

    await this.loadDocument(token);
  },

  getUrlToken() {
    const params = new URLSearchParams(window.location.search);
    return params.get('token') || window.location.hash.replace('#/', '').replace('#', '');
  },

  bindEvents() {
    const btnDownload = document.getElementById('btnPublicDownloadPdf');
    const btnDocx = document.getElementById('btnPublicDownloadDocx');
    const btnPrint = document.getElementById('btnPublicPrint');
    const btnCopyLink = document.getElementById('btnPublicCopyLink');

    if (btnDownload) {
      btnDownload.addEventListener('click', async () => {
        if (this.currentDocument) {
          await DocumentEngine.generateAndDownloadPdf(this.currentDocument.submitted_values);
        }
      });
    }

    if (btnDocx) {
      btnDocx.addEventListener('click', () => {
        if (this.currentDocument) {
          DocumentEngine.generateAndDownloadDocx(this.currentDocument.submitted_values);
        }
      });
    }

    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        DocumentExporter.printDocument();
      });
    }

    if (btnCopyLink) {
      btnCopyLink.addEventListener('click', () => {
        UI.copyToClipboard(window.location.href, 'Public share link copied!');
      });
    }
  },

  async loadDocument(token) {
    const loadingState = document.getElementById('publicLoadingState');
    const notFoundState = document.getElementById('publicNotFoundState');
    const docContainer = document.getElementById('publicDocContainer');
    const topBar = document.getElementById('publicTopBar');

    try {
      if (loadingState) loadingState.classList.remove('hidden');
      if (notFoundState) notFoundState.classList.add('hidden');
      if (docContainer) docContainer.classList.add('hidden');

      const doc = await SupabaseService.getDocumentByToken(token);

      if (!doc) {
        this.showNotFound('The requested document was not found or the link has expired.');
        return;
      }

      this.currentDocument = doc;

      // Update page title
      document.title = `${doc.title || 'Official Document'} — ${doc.doc_reference}`;

      // Render document
      if (docContainer) {
        docContainer.innerHTML = DocumentEngine.renderDocumentHtml(
          doc.doc_type,
          doc.submitted_values,
          doc.doc_reference,
          doc.public_token
        );
        docContainer.classList.remove('hidden');
        docContainer.classList.add('animate-fade-in');
      }

      if (topBar) {
        topBar.classList.remove('hidden');
        const refBadge = document.getElementById('publicDocRefBadge');
        if (refBadge) refBadge.textContent = doc.doc_reference;
      }
    } catch (err) {
      console.error('Failed to load public document:', err);
      this.showNotFound('An error occurred while loading this document.');
    } finally {
      if (loadingState) loadingState.classList.add('hidden');
    }
  },

  showNotFound(reason) {
    const notFoundState = document.getElementById('publicNotFoundState');
    const notFoundMsg = document.getElementById('publicNotFoundMsg');
    const topBar = document.getElementById('publicTopBar');
    const docContainer = document.getElementById('publicDocContainer');

    if (topBar) topBar.classList.add('hidden');
    if (docContainer) docContainer.classList.add('hidden');
    if (notFoundMsg) notFoundMsg.textContent = reason;
    if (notFoundState) notFoundState.classList.remove('hidden');
  }
};

window.PublicView = PublicView;
