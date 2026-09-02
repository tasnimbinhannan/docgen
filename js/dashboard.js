/**
 * Admin Dashboard & Document Tracker Module
 * Implements SRS FR-2.1 through FR-2.8
 */

const Dashboard = {
  currentPage: 1,
  pageSize: 8,
  totalCount: 0,
  currentFilters: {
    searchQuery: '',
    docType: '',
    startDate: '',
    endDate: ''
  },

  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Search input with debounce
    const searchInput = document.getElementById('dashSearchInput');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.currentFilters.searchQuery = e.target.value.trim();
          this.currentPage = 1;
          this.loadDocuments();
        }, 300);
      });
    }

    // Filter by Type
    const filterType = document.getElementById('dashFilterType');
    if (filterType) {
      filterType.addEventListener('change', (e) => {
        this.currentFilters.docType = e.target.value;
        this.currentPage = 1;
        this.loadDocuments();
      });
    }

    // Filter by Start Date
    const filterStart = document.getElementById('dashFilterStart');
    if (filterStart) {
      filterStart.addEventListener('change', (e) => {
        this.currentFilters.startDate = e.target.value;
        this.currentPage = 1;
        this.loadDocuments();
      });
    }

    // Filter by End Date
    const filterEnd = document.getElementById('dashFilterEnd');
    if (filterEnd) {
      filterEnd.addEventListener('change', (e) => {
        this.currentFilters.endDate = e.target.value;
        this.currentPage = 1;
        this.loadDocuments();
      });
    }

    // Clear Filters
    const btnClearFilters = document.getElementById('dashBtnClearFilters');
    if (btnClearFilters) {
      btnClearFilters.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (filterType) filterType.value = '';
        if (filterStart) filterStart.value = '';
        if (filterEnd) filterEnd.value = '';
        this.currentFilters = { searchQuery: '', docType: '', startDate: '', endDate: '' };
        this.currentPage = 1;
        this.loadDocuments();
      });
    }

    // Refresh button
    const btnRefresh = document.getElementById('dashBtnRefresh');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => this.loadDocuments());
    }

    // Pagination controls
    const btnPrev = document.getElementById('dashBtnPrevPage');
    const btnNext = document.getElementById('dashBtnNextPage');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.loadDocuments();
        }
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        const totalPages = Math.ceil(this.totalCount / this.pageSize);
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.loadDocuments();
        }
      });
    }
  },

  async loadDocuments() {
    const tableBody = document.getElementById('dashTableBody');
    const emptyState = document.getElementById('dashEmptyState');
    const statsContainer = document.getElementById('dashStatsContainer');

    if (!tableBody) return;

    try {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2.5rem;">
            <div class="spinner-sm" style="margin: 0 auto 0.5rem;"></div>
            <div style="color: var(--text-muted);">Loading documents from database...</div>
          </td>
        </tr>
      `;

      const result = await SupabaseService.getDocuments({
        searchQuery: this.currentFilters.searchQuery,
        docType: this.currentFilters.docType,
        startDate: this.currentFilters.startDate,
        endDate: this.currentFilters.endDate,
        page: this.currentPage,
        limit: this.pageSize
      });

      this.totalCount = result.totalCount;
      this.updatePaginationUI();
      this.updateStatsCards();

      if (!result.documents || result.documents.length === 0) {
        tableBody.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
      }

      if (emptyState) emptyState.classList.add('hidden');
      this.renderTableRows(result.documents);
    } catch (err) {
      console.error('Failed to load documents:', err);
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem; color: var(--accent-rose);">
            ✕ Error loading documents: ${UI.escapeHtml(err.message || 'Check database connection.')}
          </td>
        </tr>
      `;
    }
  },

  renderTableRows(docs) {
    const tableBody = document.getElementById('dashTableBody');
    if (!tableBody) return;

    const origin = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');

    const rowsHtml = docs.map(doc => {
      const publicUrl = `${origin}/public.html?token=${doc.public_token}`;
      const typeBadge = this.getDocTypeBadge(doc.doc_type);
      const formattedDate = UI.formatDate(doc.created_at);

      return `
        <tr>
          <td>
            <strong class="code-badge">${UI.escapeHtml(doc.doc_reference)}</strong>
            <div style="font-size: 0.775rem; color: var(--text-muted); margin-top: 0.2rem;">
              ${UI.escapeHtml(doc.title || 'Untitled Document')}
            </div>
          </td>
          <td>${typeBadge}</td>
          <td>
            <div style="font-weight: 600;">${UI.escapeHtml(doc.recipient_name || 'N/A')}</div>
          </td>
          <td>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${formattedDate}</div>
            <div style="font-size: 0.725rem; color: var(--text-dim);">By: ${UI.escapeHtml(doc.generated_by || 'Admin')}</div>
          </td>
          <td>
            <span class="badge badge-success">Active</span>
          </td>
          <td>
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              <button class="btn btn-outline btn-sm" title="Copy Public Share Link" onclick="UI.copyToClipboard('${publicUrl}', 'Public link copied!')">
                🔗 Link
              </button>
              <a href="${publicUrl}" target="_blank" class="btn btn-secondary btn-sm" title="Open Public Page">
                👁️ View
              </a>
              <button class="btn btn-outline btn-sm" title="Download Word (.docx)" onclick="Dashboard.downloadDocx('${doc.id}')">
                📄 DOCX
              </button>
              <button class="btn btn-primary btn-sm" title="Download PDF Certificate" onclick="Dashboard.downloadPdf('${doc.id}')">
                📥 PDF
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tableBody.innerHTML = rowsHtml;
  },

  getDocTypeBadge(type) {
    const map = {
      insurance_policy: '<span class="badge" style="background: rgba(200, 16, 46, 0.15); color: #f43f5e; border: 1px solid rgba(200, 16, 46, 0.3);">🛡️ Insurance Policy</span>',
      event_ticket: '<span class="badge badge-primary">🎟️ Ticket</span>',
      certificate: '<span class="badge badge-warning">📜 Certificate</span>',
      receipt_invoice: '<span class="badge badge-secondary">🧾 Invoice</span>'
    };
    return map[type] || '<span class="badge badge-primary">🛡️ Insurance Policy</span>';
  },

  async downloadPdf(docId) {
    try {
      let doc = null;
      if (SupabaseService.isDemoMode) {
        const localList = JSON.parse(localStorage.getItem(SupabaseService.DEMO_STORAGE_KEY) || '[]');
        doc = localList.find(d => d.id === docId);
      } else {
        const { data } = await SupabaseService.client.from('documents').select('*').eq('id', docId).single();
        doc = data;
      }

      if (!doc) {
        UI.showToast('Document record not found', 'error');
        return;
      }

      UI.showToast('Generating official PDF certificate...', 'info');
      await DocumentEngine.generateAndDownloadPdf(doc.submitted_values || {});
    } catch (err) {
      console.error('PDF download error:', err);
      UI.showToast('PDF download error: ' + err.message, 'error');
    }
  },

  async downloadDocx(docId) {
    try {
      let doc = null;
      if (SupabaseService.isDemoMode) {
        const localList = JSON.parse(localStorage.getItem(SupabaseService.DEMO_STORAGE_KEY) || '[]');
        doc = localList.find(d => d.id === docId);
      } else {
        const { data } = await SupabaseService.client.from('documents').select('*').eq('id', docId).single();
        doc = data;
      }

      if (!doc) {
        UI.showToast('Document record not found', 'error');
        return;
      }

      UI.showToast('Generating DOCX download...', 'info');
      await DocumentEngine.generateAndDownloadDocx(doc.submitted_values || {});
      UI.showToast('DOCX file downloaded successfully!', 'success');
    } catch (err) {
      console.error('Download error:', err);
      UI.showToast('Download error: ' + err.message, 'error');
    }
  },

  updatePaginationUI() {
    const totalPages = Math.max(1, Math.ceil(this.totalCount / this.pageSize));
    const pageIndicator = document.getElementById('dashPageIndicator');
    const btnPrev = document.getElementById('dashBtnPrevPage');
    const btnNext = document.getElementById('dashBtnNextPage');

    if (pageIndicator) {
      pageIndicator.textContent = `Page ${this.currentPage} of ${totalPages} (${this.totalCount} total)`;
    }
    if (btnPrev) btnPrev.disabled = this.currentPage <= 1;
    if (btnNext) btnNext.disabled = this.currentPage >= totalPages;
  },

  async updateStatsCards() {
    const statTotal = document.getElementById('statTotalDocs');
    const statTickets = document.getElementById('statTotalTickets');
    const statCerts = document.getElementById('statTotalCerts');
    const statInvoices = document.getElementById('statTotalInvoices');

    if (statTotal) statTotal.textContent = this.totalCount;

    // Optional quick counts if in demo mode or fetch
    if (SupabaseService.isDemoMode) {
      const localList = JSON.parse(localStorage.getItem(SupabaseService.DEMO_STORAGE_KEY) || '[]');
      if (statTotal) statTotal.textContent = localList.length;
      if (statTickets) statTickets.textContent = localList.filter(d => d.doc_type === 'event_ticket').length;
      if (statCerts) statCerts.textContent = localList.filter(d => d.doc_type === 'certificate').length;
      if (statInvoices) statInvoices.textContent = localList.filter(d => d.doc_type === 'receipt_invoice').length;
    }
  },

  async quickDownload(docId) {
    try {
      UI.showToast('Fetching document for PDF export...', 'info');
      
      let doc = null;
      if (SupabaseService.isDemoMode) {
        const localList = JSON.parse(localStorage.getItem(SupabaseService.DEMO_STORAGE_KEY) || '[]');
        doc = localList.find(d => d.id === docId);
      } else {
        const { data } = await SupabaseService.client.from('documents').select('*').eq('id', docId).single();
        doc = data;
      }

      if (!doc) {
        UI.showToast('Document not found', 'error');
        return;
      }

      // Render into hidden export container
      let exportContainer = document.getElementById('exportScratchpad');
      if (!exportContainer) {
        exportContainer = document.createElement('div');
        exportContainer.id = 'exportScratchpad';
        exportContainer.style.position = 'fixed';
        exportContainer.style.left = '-9999px';
        exportContainer.style.top = '0';
        document.body.appendChild(exportContainer);
      }

      exportContainer.innerHTML = DocumentEngine.renderDocumentHtml(
        doc.doc_type,
        doc.submitted_values,
        doc.doc_reference,
        doc.public_token
      );

      await DocumentExporter.downloadAsPdf('exportScratchpad', `${doc.doc_reference}.pdf`);
      exportContainer.innerHTML = '';
    } catch (err) {
      console.error('Quick download failed:', err);
      UI.showToast('Download failed: ' + err.message, 'error');
    }
  }
};

window.Dashboard = Dashboard;
