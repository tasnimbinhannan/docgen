/**
 * Document Generation Module — Direct DOCX-to-PDF Conversion Engine
 * Populates Insurance-Template.docx and converts it directly to a 100% Native Microsoft Word PDF.
 */

const DocumentEngine = {
  currentTemplate: 'insurance_policy',
  isFormDirty: false,

  init() {
    this.bindEvents();
    this.renderFormFields();
    this.setupUnsavedWarning();
  },

  bindEvents() {
    // Form Submission (Default to PDF generation)
    const docForm = document.getElementById('docGenerationForm');
    if (docForm) {
      docForm.addEventListener('submit', (e) => this.handleGenerate(e, 'pdf'));
      docForm.addEventListener('input', () => {
        this.isFormDirty = true;
      });
    }

    // Secondary DOCX Download button
    const btnDocx = document.getElementById('btnDownloadDocxOnly');
    if (btnDocx) {
      btnDocx.addEventListener('click', (e) => this.handleGenerate(e, 'docx'));
    }

    // Reset Form button
    const btnReset = document.getElementById('btnResetForm');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset the form fields?')) {
          docForm.reset();
          this.isFormDirty = false;
        }
      });
    }

    // Auto-fill Sample Data button
    const btnSample = document.getElementById('btnFillSampleData');
    if (btnSample) {
      btnSample.addEventListener('click', () => this.fillSampleData());
    }
  },

  // Render Form Fields Matching Insurance-Template.docx
  renderFormFields() {
    const container = document.getElementById('dynamicFormFields');
    if (!container) return;

    container.innerHTML = `
      <!-- Policy Details Section -->
      <div class="form-group full-width" style="margin-bottom: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; padding-bottom: 0.4rem; border-bottom: 1px solid var(--border-subtle);">
          <span style="font-size: 1.1rem; color: #c8102e;">📋</span>
          <h4 style="font-size: 1rem; color: var(--text-main); font-weight: 700;">Tune Protect Travel Assurance — Policy Details</h4>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="fieldPolicyNo">Policy No. <span class="req">*</span></label>
        <input type="text" id="fieldPolicyNo" name="policyNo" class="form-control" placeholder="e.g. T2P-2025-BDB2B-0000513" value="T2P-2025-BDB2B-0000513" required>
        <div class="form-error-msg">Policy number is required.</div>
      </div>

      <div class="form-group">
        <label class="form-label" for="fieldIssueDate">Issue Date <span class="req">*</span></label>
        <input type="date" id="fieldIssueDate" name="issueDate" class="form-control" value="2025-03-20" required>
        <div class="form-error-msg">Issue date is required.</div>
      </div>

      <div class="form-group">
        <label class="form-label" for="fieldAreaOfTravel">Area of Travel <span class="req">*</span></label>
        <input type="text" id="fieldAreaOfTravel" name="areaOfTravel" class="form-control" placeholder="e.g. Worldwide (Excluding USA/CAN)" value="Worldwide (Excluding USA/CAN)" required>
        <div class="form-error-msg">Area of travel is required.</div>
      </div>

      <div class="form-group">
        <label class="form-label" for="fieldPlanType">Plan Type <span class="req">*</span></label>
        <input type="text" id="fieldPlanType" name="planType" class="form-control" placeholder="e.g. Outbound, Silver (Covid Plus)" value="Outbound, Silver (Covid Plus)" required>
        <div class="form-error-msg">Plan type is required.</div>
      </div>

      <div class="form-group">
        <label class="form-label" for="fieldDepartureDate">Departure Date <span class="req">*</span></label>
        <input type="date" id="fieldDepartureDate" name="departureDate" class="form-control" value="2025-05-20" required>
        <div class="form-error-msg">Departure date is required.</div>
      </div>

      <div class="form-group">
        <label class="form-label" for="fieldReturnDate">Return Date <span class="req">*</span></label>
        <input type="date" id="fieldReturnDate" name="returnDate" class="form-control" value="2026-05-19" required>
        <div class="form-error-msg">Return date is required.</div>
      </div>

      <div class="form-group">
        <label class="form-label" for="fieldValidity">Validity <span class="req">*</span></label>
        <input type="text" id="fieldValidity" name="validity" class="form-control" placeholder="e.g. Annual Plan (Return)" value="Annual Plan (Return)" required>
        <div class="form-error-msg">Validity is required.</div>
      </div>

      <div class="form-group">
        <label class="form-label" for="fieldPassportNo">Passport No. <span class="req">*</span></label>
        <input type="text" id="fieldPassportNo" name="passportNo" class="form-control" placeholder="e.g. A16334319" value="A16334319" required>
        <div class="form-error-msg">Passport number is required.</div>
      </div>

      <!-- Insured Person Details Section -->
      <div class="form-group full-width" style="margin-top: 1.25rem; margin-bottom: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; padding-bottom: 0.4rem; border-bottom: 1px solid var(--border-subtle);">
          <span style="font-size: 1.1rem; color: #c8102e;">👤</span>
          <h4 style="font-size: 1rem; color: var(--text-main); font-weight: 700;">Insured Person Details</h4>
        </div>
      </div>

      <div class="form-group" style="max-width: 140px;">
        <label class="form-label" for="fieldRowNo">No. <span class="req">*</span></label>
        <input type="text" id="fieldRowNo" name="rowNo" class="form-control" value="1" required>
      </div>

      <div class="form-group full-width">
        <label class="form-label" for="fieldInsuredName">Insured Name <span class="req">*</span></label>
        <input type="text" id="fieldInsuredName" name="insuredName" class="form-control" placeholder="e.g. MD RAZU AHMED" value="MD RAZU AHMED" required>
        <div class="form-error-msg">Insured name is required.</div>
      </div>

      <div class="form-group">
        <label class="form-label" for="fieldGender">Gender <span class="req">*</span></label>
        <select id="fieldGender" name="gender" class="form-control" required>
          <option value="MALE" selected>MALE</option>
          <option value="FEMALE">FEMALE</option>
          <option value="OTHER">OTHER</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="fieldDOB">Date of Birth (DOB) <span class="req">*</span></label>
        <input type="date" id="fieldDOB" name="dob" class="form-control" value="1999-10-14" required>
        <div class="form-error-msg">DOB is required.</div>
      </div>

      <div class="form-group full-width">
        <label class="form-label" for="fieldNationality">Nationality <span class="req">*</span></label>
        <input type="text" id="fieldNationality" name="nationality" class="form-control" placeholder="e.g. Bangladesh" value="Bangladesh" required>
        <div class="form-error-msg">Nationality is required.</div>
      </div>
    `;
  },

  fillSampleData() {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };

    setVal('fieldPolicyNo', `T2P-2025-BDB2B-${randomSuffix}`);
    setVal('fieldIssueDate', '2025-03-20');
    setVal('fieldAreaOfTravel', 'Worldwide (Excluding USA/CAN)');
    setVal('fieldPlanType', 'Outbound, Silver (Covid Plus)');
    setVal('fieldDepartureDate', '2025-05-20');
    setVal('fieldReturnDate', '2026-05-19');
    setVal('fieldValidity', 'Annual Plan (Return)');
    setVal('fieldPassportNo', 'A16334319');
    setVal('fieldRowNo', '1');
    setVal('fieldInsuredName', 'MD RAZU AHMED');
    setVal('fieldGender', 'MALE');
    setVal('fieldDOB', '1999-10-14');
    setVal('fieldNationality', 'Bangladesh');

    UI.showToast('Sample insurance values loaded!', 'info');
  },

  getFormData() {
    const form = document.getElementById('docGenerationForm');
    if (!form) return {};

    const formData = new FormData(form);
    const values = {};
    for (let [key, val] of formData.entries()) {
      values[key] = val.trim();
    }
    return values;
  },

  validateForm() {
    let isValid = true;
    const form = document.getElementById('docGenerationForm');
    if (!form) return false;

    const requiredInputs = form.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
      const parentGroup = input.closest('.form-group');
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('is-invalid');
        if (parentGroup) parentGroup.classList.add('has-error');
      } else {
        input.classList.remove('is-invalid');
        if (parentGroup) parentGroup.classList.remove('has-error');
      }
    });

    return isValid;
  },

  // =========================================================================
  // CORE DOCX PROCESSOR: REPLACES PLACEHOLDERS & RETURNS UPDATED BLOB
  // =========================================================================
  async generateUpdatedDocxBlob(values) {
    const response = await fetch('Insurance-Template.docx');
    if (!response.ok) {
      throw new Error(`Failed to load Insurance-Template.docx (${response.statusText})`);
    }

    const arrayBuffer = await response.arrayBuffer();

    const replacements = {
      '{{POLICY_NO}}': values.policyNo || '',
      '{{ISSUE_DATE}}': values.issueDate || '',
      '{{AREA_OF_TRAVEL}}': values.areaOfTravel || '',
      '{{PLAN_TYPE}}': values.planType || '',
      '{{DEPARTURE_DATE}}': values.departureDate || '',
      '{{RETURN_DATE}}': values.returnDate || '',
      '{{VALIDITY}}': values.validity || '',
      '{{PASSPORT_NO}}': values.passportNo || '',
      '{{ROW_NO}}': values.rowNo || '1',
      '{{INSURED_NAME}}': values.insuredName || '',
      '{{GENDER}}': values.gender || '',
      '{{DOB}}': values.dob || '',
      '{{NATIONALITY}}': values.nationality || '',
      '{{QR_CODE_IMAGE}}': `VALIDATED-POLICY-${values.policyNo || ''}`
    };

    if (typeof JSZip === 'undefined') {
      throw new Error('ZIP processing library (JSZip) is not loaded.');
    }

    const zip = await JSZip.loadAsync(arrayBuffer);
    let docXml = await zip.file('word/document.xml').async('string');

    for (const [placeholder, value] of Object.entries(replacements)) {
      const escapedVal = String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      docXml = docXml.split(placeholder).join(escapedVal);
    }

    zip.file('word/document.xml', docXml);

    const outputBlob = await zip.generateAsync({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      compression: 'DEFLATE'
    });

    const safeName = (values.insuredName || 'Policy').replace(/[^a-zA-Z0-9_-]/g, '_');
    const safePolicy = (values.policyNo || 'Certificate').replace(/[^a-zA-Z0-9_-]/g, '_');
    const baseFilename = `Insurance_Certificate_${safePolicy}_${safeName}`;

    return { blob: outputBlob, baseFilename };
  },

  // =========================================================================
  // PDF GENERATOR: DIRECT NATIVE WORD DOCX-TO-PDF CONVERTER
  // =========================================================================
  async generateAndDownloadPdf(values) {
    const { blob, baseFilename } = await this.generateUpdatedDocxBlob(values);
    const pdfFilename = `${baseFilename}.pdf`;

    try {
      // 1. Try Native Word Conversion via local backend endpoint
      const response = await fetch('/api/convert-docx-to-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: blob
      });

      if (response.ok) {
        const pdfBlob = await response.blob();
        const downloadUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = pdfFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
        return { filename: pdfFilename };
      }
    } catch (err) {
      console.warn('Native Word conversion server unavailable, using vector exporter fallback:', err);
    }

    // 2. Fallback: Vector Multi-Page PDF Exporter
    let scratchContainer = document.getElementById('pdfExactRenderContainer');
    if (!scratchContainer) {
      scratchContainer = document.createElement('div');
      scratchContainer.id = 'pdfExactRenderContainer';
      scratchContainer.style.position = 'fixed';
      scratchContainer.style.top = '0';
      scratchContainer.style.left = '0';
      scratchContainer.style.width = '794px';
      scratchContainer.style.zIndex = '-9999';
      scratchContainer.style.opacity = '0.01';
      scratchContainer.style.pointerEvents = 'none';
      scratchContainer.style.background = '#ffffff';
      document.body.appendChild(scratchContainer);
    }

    const docReference = values.policyNo || 'T2P-CERTIFICATE';
    const publicToken = 'tok-' + Date.now();
    scratchContainer.innerHTML = this.renderDocumentHtml('insurance_policy', values, docReference, publicToken);

    await DocumentExporter.downloadAsPdf('pdfExactRenderContainer', pdfFilename);
    scratchContainer.innerHTML = '';
    return { filename: pdfFilename };
  },

  // =========================================================================
  // DOCX DOWNLOADER: TRIGGERS IMMEDIATE LOCAL DOWNLOAD OF .DOCX
  // =========================================================================
  async generateAndDownloadDocx(values) {
    const { blob, baseFilename } = await this.generateUpdatedDocxBlob(values);
    const docxFilename = `${baseFilename}.docx`;

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = docxFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

    return { filename: docxFilename, blob };
  },

  // =========================================================================
  // SUBMIT HANDLER: EXECUTE PDF / DOCX GENERATION & STORE RECORD
  // =========================================================================
  async handleGenerate(e, format = 'pdf') {
    if (e && e.preventDefault) e.preventDefault();

    if (!this.validateForm()) {
      UI.showToast('Please fill in all mandatory fields before generating.', 'error');
      return;
    }

    const submitBtn = document.getElementById('btnSubmitGenerate');
    const values = this.getFormData();
    const docReference = values.policyNo || `T2P-${Date.now()}`;
    const publicToken = crypto.randomUUID ? crypto.randomUUID() : 'tok-' + Math.random().toString(36).substring(2) + '-' + Date.now();
    const adminEmail = (Auth.currentUser && Auth.currentUser.email) || 'admin@docugen.io';

    const documentPayload = {
      doc_reference: docReference,
      public_token: publicToken,
      doc_type: 'insurance_policy',
      title: `Tune Protect Policy — ${values.insuredName || 'Certificate'}`,
      recipient_name: values.insuredName || 'Insured Person',
      submitted_values: values,
      generated_by: adminEmail,
      status: 'active'
    };

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = format === 'pdf' ? '<span class="spinner-sm"></span> Converting DOCX directly to PDF...' : '<span class="spinner-sm"></span> Generating DOCX...';
      }

      let exportedFilename = '';

      if (format === 'pdf') {
        const { filename } = await this.generateAndDownloadPdf(values);
        exportedFilename = filename;
      } else {
        const { filename } = await this.generateAndDownloadDocx(values);
        exportedFilename = filename;
      }

      // Record in Database / Local Storage
      const createdDoc = await SupabaseService.createDocument(documentPayload);

      // Construct public link
      const origin = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
      const publicUrl = `${origin}/public.html?token=${createdDoc.public_token}`;

      this.isFormDirty = false;
      UI.showToast(`✅ Generated & downloaded: ${exportedFilename}`, 'success', 5000);

      // Display Success Modal
      this.showSuccessModal(createdDoc, publicUrl, exportedFilename);

      // Refresh Dashboard records
      if (window.Dashboard) {
        window.Dashboard.loadDocuments();
      }
    } catch (err) {
      console.error('Document generation failed:', err);
      UI.showToast('Generation error: ' + (err.message || 'Check template file.'), 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '⚡ Generate & Download PDF Document';
      }
    }
  },

  showSuccessModal(doc, publicUrl, filename) {
    const modalRef = document.getElementById('successDocRef');
    const modalUrlInput = document.getElementById('successDocUrlInput');
    const modalOpenBtn = document.getElementById('btnSuccessOpenPublic');
    const modalCopyBtn = document.getElementById('btnSuccessCopyLink');
    const modalDownloadPdfBtn = document.getElementById('btnSuccessDownloadPdf');
    const modalDownloadDocxBtn = document.getElementById('btnSuccessDownloadDocx');

    if (modalRef) modalRef.textContent = doc.doc_reference;
    if (modalUrlInput) modalUrlInput.value = publicUrl;

    if (modalOpenBtn) {
      modalOpenBtn.onclick = () => window.open(publicUrl, '_blank');
    }

    if (modalCopyBtn) {
      modalCopyBtn.onclick = () => UI.copyToClipboard(publicUrl, 'Public link copied to clipboard!');
    }

    if (modalDownloadPdfBtn) {
      modalDownloadPdfBtn.onclick = () => {
        this.generateAndDownloadPdf(doc.submitted_values);
      };
    }

    if (modalDownloadDocxBtn) {
      modalDownloadDocxBtn.onclick = () => {
        this.generateAndDownloadDocx(doc.submitted_values);
      };
    }

    UI.openModal('modalGenerationSuccess');
  },

  // Complete Pixel-Perfect 2-Page A4 Certificate Renderer
  renderDocumentHtml(templateType, values = {}, docReference = 'T2P-2025-BDB2B-0000513', publicToken = '') {
    const policyNo = UI.escapeHtml(values.policyNo || docReference || 'T2P-2025-BDB2B-0000513');
    const issueDate = UI.escapeHtml(values.issueDate || '2025-03-20');
    const areaOfTravel = UI.escapeHtml(values.areaOfTravel || 'Worldwide (Excluding USA/CAN)');
    const planType = UI.escapeHtml(values.planType || 'Outbound, Silver (Covid Plus)');
    const departureDate = UI.escapeHtml(values.departureDate || '2025-05-20');
    const returnDate = UI.escapeHtml(values.returnDate || '2026-05-19');
    const validity = UI.escapeHtml(values.validity || 'Annual Plan (Return)');
    const passportNo = UI.escapeHtml(values.passportNo || 'A16334319');

    const rowNo = UI.escapeHtml(values.rowNo || '1');
    const insuredName = UI.escapeHtml(values.insuredName || 'MD RAZU AHMED');
    const gender = UI.escapeHtml(values.gender || 'MALE');
    const dob = UI.escapeHtml(values.dob || '1999-10-14');
    const nationality = UI.escapeHtml(values.nationality || 'Bangladesh');

    return `
      <div class="pdf-page-wrapper" id="renderedDocElement" style="background:#ffffff; color:#000000; width:794px; margin:0 auto; font-family:Arial, sans-serif;">
        
        <!-- ==================== PAGE 1: CERTIFICATE OF INSURANCE ==================== -->
        <div class="pdf-page" style="width:794px; min-height:1123px; height:1123px; box-sizing:border-box; padding:68px 71px 56px 71px; background:#ffffff; color:#000000; position:relative; display:flex; flex-direction:column; justify-content:space-between; font-family:Arial, sans-serif;">
          
          <div>
            <!-- Table 1: Header (TRAVEL Assurance | GREEN DELTA INSURANCE) -->
            <table style="width:100%; border-collapse:collapse; margin-bottom:8px; border:none;">
              <tr>
                <td style="width:50%; vertical-align:top; border:none; padding:0;">
                  <div style="font-family:Arial, sans-serif; font-size:24px; font-weight:900; color:#C00000; line-height:0.95; letter-spacing:-0.5px;">TRAVEL</div>
                  <div style="font-family:Arial, sans-serif; font-size:13.5px; font-weight:700; color:#1A1A1A; margin-top:2px;">Assurance</div>
                </td>
                <td style="width:50%; vertical-align:top; text-align:right; border:none; padding:0;">
                  <div style="font-family:Arial, sans-serif; font-size:17.5px; font-weight:900; color:#1A6B3C; text-transform:uppercase; line-height:1.1;">GREEN DELTA</div>
                  <div style="font-family:Arial, sans-serif; font-size:17.5px; font-weight:900; color:#1A1A1A; text-transform:uppercase; line-height:1.1;">INSURANCE</div>
                </td>
              </tr>
            </table>

            <!-- Title -->
            <h2 style="font-family:Arial, sans-serif; font-size:26px; font-weight:700; color:#C00000; text-align:center; margin:6px 0 3px 0;">Certificate of Insurance</h2>
            <div style="text-align:center; font-size:12px; color:#808080; font-weight:600; margin-bottom:2px;">[ QR CODE — VALIDATED-POLICY-${policyNo} ]</div>
            <div style="text-align:center; font-size:10.5px; color:#333333; line-height:1.35; margin-bottom:8px;">
              For the policy validation, please contact <a href="mailto:travelassurance@tuneprotect.com" style="color:#1F4E9C; text-decoration:none; font-weight:600;">travelassurance@tuneprotect.com</a>.<br>
              Please scan the QR code to validate your policy and benefits
            </div>

            <!-- Table 2: Tune Protect Travel Assurance -->
            <table style="width:100%; border-collapse:collapse; margin-bottom:8px; font-size:12px; border:1px solid #D9D9D9;">
              <thead>
                <tr>
                  <th colspan="4" style="background-color:#C00000 !important; color:#FFFFFF !important; font-weight:700; padding:5px 8px; text-align:left; border:1px solid #C00000; font-size:12px;">Tune Protect Travel Assurance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="width:21.6%; color:#C00000; font-weight:700; padding:4px 8px; border:1px solid #D9D9D9; background:#FFFFFF;">Policy No.</td>
                  <td style="width:28.4%; color:#000000; font-weight:700; padding:4px 8px; border:1px solid #D9D9D9; background:#FFFFFF;">${policyNo}</td>
                  <td style="width:21.6%; color:#C00000; font-weight:700; padding:4px 8px; border:1px solid #D9D9D9; background:#FFFFFF;">Issue Date</td>
                  <td style="width:28.4%; color:#000000; padding:4px 8px; border:1px solid #D9D9D9; background:#FFFFFF;">${issueDate}</td>
                </tr>
                <tr>
                  <td style="color:#C00000; font-weight:700; padding:4px 8px; border:1px solid #D9D9D9; background:#FFFFFF;">Area of Travel</td>
                  <td style="color:#000000; padding:4px 8px; border:1px solid #D9D9D9; background:#FFFFFF;">${areaOfTravel}</td>
                  <td style="color:#C00000; font-weight:700; padding:4px 8px; border:1px solid #D9D9D9; background:#FFFFFF;">Plan Type</td>
                  <td style="color:#000000; padding:4px 8px; border:1px solid #D9D9D9; background:#FFFFFF;">${planType}</td>
                </tr>
                <tr>
                  <td style="color:#C00000; font-weight:700; padding:4px 8px; border:1px solid #D9D9D9; background:#FFFFFF;">Departure Date</td>
                  <td style="color:#000000; padding:4px 8px; border:1px solid #D9D9D9; background:#FFFFFF;">${departureDate}</td>
                  <td style="color:#C00000; font-weight:700; padding:4px 8px; border:1px solid #D9D9D9; background:#FFFFFF;">Return Date</td>
                  <td style="color:#000000; padding:4px 8px; border:1px solid #D9D9D9; background:#FFFFFF;">${returnDate}</td>
                </tr>
                <tr>
                  <td style="color:#C00000; font-weight:700; padding:4px 8px; border:1px solid #D9D9D9; background:#FFFFFF;">Validity</td>
                  <td style="color:#000000; padding:4px 8px; border:1px solid #D9D9D9; background:#FFFFFF;">${validity}</td>
                  <td style="color:#C00000; font-weight:700; padding:4px 8px; border:1px solid #D9D9D9; background:#FFFFFF;">Passport No.</td>
                  <td style="color:#000000; padding:4px 8px; border:1px solid #D9D9D9; background:#FFFFFF;">${passportNo}</td>
                </tr>
              </tbody>
            </table>

            <!-- Table 3: Insured Person Details -->
            <table style="width:100%; border-collapse:collapse; margin-bottom:8px; font-size:12px; border:1px solid #D9D9D9;">
              <thead>
                <tr>
                  <th style="width:11.3%; background-color:#C00000 !important; color:#FFFFFF !important; font-weight:700; padding:5px 8px; text-align:center; border:1px solid #C00000; font-size:12px;">No.</th>
                  <th style="width:37.1%; background-color:#C00000 !important; color:#FFFFFF !important; font-weight:700; padding:5px 8px; text-align:left; border:1px solid #C00000; font-size:12px;">Insured Name</th>
                  <th style="width:15.5%; background-color:#C00000 !important; color:#FFFFFF !important; font-weight:700; padding:5px 8px; text-align:center; border:1px solid #C00000; font-size:12px;">Gender</th>
                  <th style="width:18.6%; background-color:#C00000 !important; color:#FFFFFF !important; font-weight:700; padding:5px 8px; text-align:center; border:1px solid #C00000; font-size:12px;">DOB</th>
                  <th style="width:17.5%; background-color:#C00000 !important; color:#FFFFFF !important; font-weight:700; padding:5px 8px; text-align:center; border:1px solid #C00000; font-size:12px;">Nationality</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:4px 8px; border:1px solid #D9D9D9; text-align:center; background:#FFFFFF; color:#000000;">${rowNo}</td>
                  <td style="padding:4px 8px; border:1px solid #D9D9D9; font-weight:700; background:#FFFFFF; color:#000000;">${insuredName}</td>
                  <td style="padding:4px 8px; border:1px solid #D9D9D9; text-align:center; background:#FFFFFF; color:#000000;">${gender}</td>
                  <td style="padding:4px 8px; border:1px solid #D9D9D9; text-align:center; background:#FFFFFF; color:#000000;">${dob}</td>
                  <td style="padding:4px 8px; border:1px solid #D9D9D9; text-align:center; background:#FFFFFF; color:#000000;">${nationality}</td>
                </tr>
              </tbody>
            </table>

            <!-- Table 4: Action Service Boxes (33.3% / 33.3% / 33.4%) -->
            <table style="width:100%; border-collapse:collapse; margin-bottom:8px; border:1px solid #BFBFBF;">
              <tr>
                <td style="width:33.33%; border:1px solid #BFBFBF; padding:5px 8px; vertical-align:top; background:#FFFFFF;">
                  <div style="font-size:13px; font-weight:700; color:#000000; margin-bottom:2px;">Policy Wording</div>
                  <div style="font-size:11.5px; font-weight:600; color:#C00000;">Download Now</div>
                </td>
                <td style="width:33.33%; border:1px solid #BFBFBF; padding:5px 8px; vertical-align:top; background:#FFFFFF;">
                  <div style="font-size:13px; font-weight:700; color:#000000; margin-bottom:2px;">Claim</div>
                  <div style="font-size:11.5px; font-weight:600; color:#1F4E9C;">Submit Your Claim Online</div>
                </td>
                <td style="width:33.34%; border:1px solid #BFBFBF; padding:5px 8px; vertical-align:top; background:#FFFFFF;">
                  <div style="font-size:13px; font-weight:700; color:#1F4E9C; margin-bottom:2px;">General Enquiry</div>
                  <div style="font-size:11.5px; font-weight:600; color:#1F4E9C;">travelassurance@tuneprotect.com</div>
                </td>
              </tr>
            </table>

            <!-- Table 5: Emergency Assistance Box -->
            <table style="width:100%; border-collapse:collapse; margin-bottom:8px; border:1px solid #BFBFBF;">
              <thead>
                <tr>
                  <th colspan="4" style="background:#FFFFFF !important; color:#1F4E9C !important; font-size:13.5px; font-weight:700; padding:5px 8px; text-align:left; border:1px solid #BFBFBF; border-bottom:none;">Emergency Assistance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="width:25%; border:1px solid #BFBFBF; padding:5px 8px; vertical-align:top; background:#FFFFFF;">
                    <div style="font-size:11.5px; font-weight:700; color:#1F4E9C; margin-bottom:2px;">Middle East</div>
                    <div style="font-size:11.5px; font-weight:700; color:#000000;">+9714-571-1000</div>
                    <div style="font-size:10px; color:#595959;">(English & Arabic)</div>
                  </td>
                  <td style="width:25%; border:1px solid #BFBFBF; padding:5px 8px; vertical-align:top; background:#FFFFFF;">
                    <div style="font-size:11.5px; font-weight:700; color:#1F4E9C; margin-bottom:2px;">US & Canada</div>
                    <div style="font-size:11.5px; font-weight:700; color:#000000;">+178 6472 7700</div>
                    <div style="font-size:10px; color:#595959;">(English, French & Arabic)</div>
                  </td>
                  <td style="width:25%; border:1px solid #BFBFBF; padding:5px 8px; vertical-align:top; background:#FFFFFF;">
                    <div style="font-size:11.5px; font-weight:700; color:#1F4E9C; margin-bottom:2px;">Europe/North Africa</div>
                    <div style="font-size:11.5px; font-weight:700; color:#000000;">+44 178 631 0605</div>
                    <div style="font-size:10px; color:#595959;">(English, French & Arabic)</div>
                  </td>
                  <td style="width:25%; border:1px solid #BFBFBF; padding:5px 8px; vertical-align:top; background:#FFFFFF;">
                    <div style="font-size:11.5px; font-weight:700; color:#1F4E9C; margin-bottom:2px;">Indian Subcontinent</div>
                    <div style="font-size:11.5px; font-weight:700; color:#000000;">+91 124 468 8488</div>
                    <div style="font-size:10px; color:#595959;">(English & Arabic)</div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Terms and conditions -->
            <div style="font-size:9.5px; font-weight:700; color:#000000; margin-bottom:2px;">Terms and conditions apply</div>
            <ol style="margin:0; padding-left:14px; font-size:8.7px; color:#333333; line-height:1.3;">
              <li style="margin-bottom:1.5px;">Tune Protect Travel Assurance shall not be subject to assignment, change, upgrade and/or refund.</li>
              <li style="margin-bottom:1.5px;">Outbound Coverage starts upon departure from the country of issuance.</li>
              <li style="margin-bottom:1.5px;">For Covid-19 full coverage up-to maximum limit will be provided under Accidental & Sickness Medical Reimbursement with an excess of USD 100. 5% excess is applicable for all sections except Section 2A.</li>
              <li style="margin-bottom:1.5px;">In the event of hospitalization, the Insured Person or treating hospital is required to contact the assigned Emergency Assistance within 24 hours of admission and the Insured Person or treating hospital must receive an acknowledgement on the coverage.</li>
              <li style="margin-bottom:1.5px;">Pre-existing medical conditions are excluded as stated in the General Exclusions Section of the Policy.</li>
              <li style="margin-bottom:1.5px;">The Insured/ Claimant will need to submit the claim within thirty (30) days from the incident.</li>
              <li style="margin-bottom:1.5px;">For Medical Claims, original document is mandatory for claim evaluation, failing to submit will result in rejection of claim. The Insured/ Claimant has maximum of ninety (90) Days to submit all supporting documents of the incident after submission of claim request</li>
              <li style="margin-bottom:1.5px;">Insured Person is required to pay a policy Excess of USD 100.00 and only applicable for Accidental & Sickness Medical Reimbursement Claim</li>
              <li style="margin-bottom:1.5px;">Schengen Visa Compliant: All plans have a minimum limit of EUR 30,000 to cover the emergency medical requirements and repatriation.</li>
              <li style="margin-bottom:1.5px;">Free coverage is afforded for one (1) accompanying named Infant per Insured Person for Section 1A, 2A, 3A & 3B. Benefits applicable are ten percent (10%) of the limit</li>
              <li style="margin-bottom:1.5px;">Annual Cover: Covers multiple trips in which each trip does not exceed 90 days.</li>
              <li style="margin-bottom:1.5px;">I/Holder of the Policy hereby agree to the Terms & Conditions of this Certificate of Insurance and the benefits/ coverages.</li>
            </ol>

            <div style="font-size:10px; color:#808080; margin-top:4px; text-align:left;">[ QR CODE — Search for Hospital ]</div>
          </div>

          <!-- Footer Page 1 -->
          <table style="width:100%; border-collapse:collapse; margin-top:auto; padding-top:6px; border-top:1px solid #D9D9D9; font-size:10px; color:#595959; border:none;">
            <tr>
              <td style="text-align:left; width:65%; border:none; padding:0;">
                <strong>Underwritten by</strong><br>
                Green Delta Insurance Company Limited<br>
                Green Delta AIMS Tower, 51-52, Mohakhali C/A, Dhaka-1212 Bangladesh
              </td>
              <td style="text-align:right; width:35%; border:none; padding:0;">
                <strong>tuneprotect.com/emeia</strong><br>
                Page 1 of 2
              </td>
            </tr>
          </table>
        </div>

        <!-- ==================== PAGE 2: SCHEDULE OF BENEFITS ==================== -->
        <div class="pdf-page" style="width:794px; min-height:1123px; height:1123px; box-sizing:border-box; padding:68px 71px 56px 71px; background:#ffffff; color:#000000; position:relative; display:flex; flex-direction:column; justify-content:space-between; font-family:Arial, sans-serif;">
          
          <div>
            <!-- Table 6: Header (TRAVEL Assurance | GREEN DELTA INSURANCE) -->
            <table style="width:100%; border-collapse:collapse; margin-bottom:8px; border:none;">
              <tr>
                <td style="width:50%; vertical-align:top; border:none; padding:0;">
                  <div style="font-family:Arial, sans-serif; font-size:24px; font-weight:900; color:#C00000; line-height:0.95; letter-spacing:-0.5px;">TRAVEL</div>
                  <div style="font-family:Arial, sans-serif; font-size:13.5px; font-weight:700; color:#1A1A1A; margin-top:2px;">Assurance</div>
                </td>
                <td style="width:50%; vertical-align:top; text-align:right; border:none; padding:0;">
                  <div style="font-family:Arial, sans-serif; font-size:17.5px; font-weight:900; color:#1A6B3C; text-transform:uppercase; line-height:1.1;">GREEN DELTA</div>
                  <div style="font-family:Arial, sans-serif; font-size:17.5px; font-weight:900; color:#1A1A1A; text-transform:uppercase; line-height:1.1;">INSURANCE</div>
                </td>
              </tr>
            </table>

            <div style="font-size:10.5px; color:#333333; text-align:center; margin:6px 0 10px 0; line-height:1.4;">
              ** تخضع هذه الوثيقة للشروط والأحكام والإستثناءات الواردة في الوثيقة الأصلية. **<br>
              This certificate is subject to the terms, conditions and exclusions contained in the Master Policy.
            </div>

            <!-- Table 7: Schedule of Benefits (40.2% / 26.8% / 33.0%) -->
            <table style="width:100%; border-collapse:collapse; margin-bottom:12px; font-size:12px; border:1px solid #D9D9D9;">
              <thead>
                <tr>
                  <th style="width:40.2%; background-color:#C00000 !important; color:#FFFFFF !important; font-weight:700; padding:5px 8px; border:1px solid #C00000; font-size:12px; text-align:left;">Schedule of Benefits</th>
                  <th style="width:26.8%; background-color:#C00000 !important; color:#FFFFFF !important; font-weight:700; padding:5px 8px; border:1px solid #C00000; font-size:12px; text-align:center;">حدود تغطية الباقة الذهبية</th>
                  <th style="width:33.0%; background-color:#C00000 !important; color:#FFFFFF !important; font-weight:700; padding:5px 8px; border:1px solid #C00000; font-size:12px; text-align:right;">جدول التغطيات</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; background:#FFFFFF; color:#000000;">1A. Accidental Death and Permanent Disablement</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:center; font-weight:700; background:#FFFFFF; color:#000000;">USD 20,000</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:right; direction:rtl; background:#FFFFFF; color:#000000;">*١- أ: حادث الوفاة العرضي والعجز الدائم</td>
                </tr>
                <tr>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; background:#FFFFFF; color:#000000;">2A. Accidental and Sickness Medical Reimbursement</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:center; font-weight:700; background:#FFFFFF; color:#000000;">Up to USD 50,000<br><small style="font-size:8px; font-weight:normal;">(Subject to an Excess of USD 100)</small></td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:right; direction:rtl; background:#FFFFFF; color:#000000;">٢- أ: سداد النفقات العرضية والأمراض الطبية</td>
                </tr>
                <tr>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; background:#FFFFFF; color:#000000;">2B. Follow up Treatment in Home Country</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:center; font-weight:700; background:#FFFFFF; color:#000000;">Upto USD 350</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:right; direction:rtl; background:#FFFFFF; color:#000000;">٢-ب: متابعة العلاج في الوطن الأم</td>
                </tr>
                <tr>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; background:#FFFFFF; color:#000000;">3A. Emergency Medical Evacuation</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:center; font-weight:700; background:#FFFFFF; color:#000000;">Up to USD 50,000</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:right; direction:rtl; background:#FFFFFF; color:#000000;">٣- أ: الاخلاء الطبي في حالات الطوارئ</td>
                </tr>
                <tr>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; background:#FFFFFF; color:#000000;">3B. Repatriation of Mortal Remains</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:center; font-weight:700; background:#FFFFFF; color:#000000;">Up to USD 5,000</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:right; direction:rtl; background:#FFFFFF; color:#000000;">٣-ب: ترحيل رفات المتوفي</td>
                </tr>
                <tr>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; background:#FFFFFF; color:#000000;">4A. Loss of Travel Documents</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:center; font-weight:700; background:#FFFFFF; color:#000000;">Up to USD 100</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:right; direction:rtl; background:#FFFFFF; color:#000000;">٤- أ: فقدان وثائق السفر</td>
                </tr>
                <tr>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; background:#FFFFFF; color:#000000;">5B. Loss or Damage of Baggage & Personal Effects</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:center; font-weight:700; background:#FFFFFF; color:#000000;">USD 250</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:right; direction:rtl; background:#FFFFFF; color:#000000;">٥-ب: فقدان الأمتعة والمتعلقات الشخصية</td>
                </tr>
                <tr>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; background:#FFFFFF; color:#000000;">6A. Personal Liability</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:center; font-weight:700; background:#FFFFFF; color:#000000;">USD 50,000</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:right; direction:rtl; background:#FFFFFF; color:#000000;">٦-أ ب: تغطيات المسؤولية الشخصية</td>
                </tr>
                <tr>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; background:#FFFFFF; color:#000000;">6B. Home Away Protection</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:center; font-weight:700; background:#FFFFFF; color:#000000;">USD 1,000</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:right; direction:rtl; background:#FFFFFF; color:#000000;">٦-ب: الحماية بعيدًا عن الوطن</td>
                </tr>
                <tr>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; background:#FFFFFF; color:#000000;">6C. Mugging</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:center; font-weight:700; background:#FFFFFF; color:#000000;">USD 200</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:right; direction:rtl; background:#FFFFFF; color:#000000;">٦-ت: تعويض عن الضرر الناتج عن الهجوم بقصد السرقة</td>
                </tr>
                <tr>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; background:#FFFFFF; color:#000000;">7. 24/7 Emergency Assistance</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:center; font-weight:700; color:#00843D; background:#FFFFFF;">Included / مشمولة</td>
                  <td style="padding:4.5px 8px; border:1px solid #D9D9D9; text-align:right; direction:rtl; background:#FFFFFF; color:#000000;">القسم السابع: المساعدة في حالات الطوارئ على مدار اليوم وسبعة أيام في الأسبوع</td>
                </tr>
              </tbody>
            </table>

            <!-- Promotional Banners -->
            <div style="border:1px dashed #BFBFBF; background:#F8FAFC; padding:8px; text-align:center; font-size:10.5px; color:#808080; margin-top:10px; border-radius:4px;">[ Promotional banner — Tune Protect eSIM ]</div>
            <div style="border:1px dashed #BFBFBF; background:#F8FAFC; padding:8px; text-align:center; font-size:10.5px; color:#808080; margin-top:10px; border-radius:4px;">[ Promotional banner — GetTransfer.com x Tune Protect ]</div>
          </div>

          <!-- Footer Page 2 -->
          <table style="width:100%; border-collapse:collapse; margin-top:auto; padding-top:6px; border-top:1px solid #D9D9D9; font-size:10px; color:#595959; border:none;">
            <tr>
              <td style="text-align:left; width:65%; border:none; padding:0;">
                <strong>Underwritten by</strong><br>
                Green Delta Insurance Company Limited<br>
                Green Delta AIMS Tower, 51-52, Mohakhali C/A, Dhaka-1212 Bangladesh
              </td>
              <td style="text-align:right; width:35%; border:none; padding:0;">
                <strong>tuneprotect.com/emeia</strong><br>
                Page 2 of 2
              </td>
            </tr>
          </table>
        </div>

      </div>
    `;
  },

  setupUnsavedWarning() {
    window.addEventListener('beforeunload', (e) => {
      if (this.isFormDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes in the document generator. Discard?';
        return e.returnValue;
      }
    });
  }
};

window.DocumentEngine = DocumentEngine;
