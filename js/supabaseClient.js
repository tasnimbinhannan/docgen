/**
 * Supabase Client & Unified Data Layer
 * Connects to Supabase PostgreSQL or falls back to demo mode if keys are not yet provided.
 */

const SupabaseService = {
  client: null,
  isDemoMode: true,
  DEMO_STORAGE_KEY: 'DOCUGEN_LOCAL_DOCS_STORE',
  DEMO_AUTH_KEY: 'DOCUGEN_LOCAL_ADMIN_AUTH',

  init() {
    const hasCreds = window.hasSupabaseCredentials && window.hasSupabaseCredentials();

    if (hasCreds && window.supabase && window.supabase.createClient) {
      try {
        this.client = window.supabase.createClient(
          window.APP_CONFIG.SUPABASE_URL,
          window.APP_CONFIG.SUPABASE_ANON_KEY,
          {
            auth: {
              persistSession: true,
              autoRefreshToken: true
            }
          }
        );
        this.isDemoMode = false;
        console.log('⚡ Supabase Client initialized with remote database.');
      } catch (err) {
        console.error('Failed to initialize Supabase client, falling back to demo mode:', err);
        this.isDemoMode = true;
      }
    } else {
      this.isDemoMode = true;
      this.initDemoSeed();
      console.log('ℹ️ Running in Demo Storage Mode. Connect Supabase credentials in settings anytime.');
    }

    if (window.UI) {
      window.UI.updateConnectionStatus();
    }
  },

  // Seed sample records for demo mode
  initDemoSeed() {
    if (!localStorage.getItem(this.DEMO_STORAGE_KEY)) {
      const sampleDocs = [
        {
          id: '1a2b3c4d-0001-4000-8000-000000000001',
          doc_reference: 'T2P-2025-BDB2B-0000513',
          public_token: 'd4e5f6a1-0001-4000-8000-000000000001',
          doc_type: 'insurance_policy',
          title: 'Tune Protect Travel Assurance — MD RAZU AHMED',
          recipient_name: 'MD RAZU AHMED',
          submitted_values: {
            policyNo: 'T2P-2025-BDB2B-0000513',
            issueDate: '2025-03-20',
            areaOfTravel: 'Worldwide (Excluding USA/CAN)',
            planType: 'Outbound, Silver (Covid Plus)',
            departureDate: '2025-05-20',
            returnDate: '2026-05-19',
            validity: 'Annual Plan (Return)',
            passportNo: 'A16334319',
            rowNo: '1',
            insuredName: 'MD RAZU AHMED',
            gender: 'MALE',
            dob: '1999-10-14',
            nationality: 'Bangladesh'
          },
          generated_by: 'admin@docugen.io',
          status: 'active',
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: '1a2b3c4d-0002-4000-8000-000000000002',
          doc_reference: 'CRT-2026-B3J71',
          public_token: 'd4e5f6a1-0002-4000-8000-000000000002',
          doc_type: 'certificate',
          title: 'Certificate of Excellence in Cloud Architecture',
          recipient_name: 'Daniel Hayes',
          submitted_values: {
            recipientName: 'Daniel Hayes',
            achievement: 'Excellence in Cloud Architecture & Microservices',
            issuer: 'Global Software Academy',
            issueDate: '2026-09-01',
            signatory: 'Dr. Evelyn Carter',
            signatoryTitle: 'Dean of Engineering',
            notes: 'Honors Grade with Distinction'
          },
          generated_by: 'admin@docugen.io',
          status: 'active',
          created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          id: '1a2b3c4d-0003-4000-8000-000000000003',
          doc_reference: 'INV-2026-P4R88',
          public_token: 'd4e5f6a1-0003-4000-8000-000000000003',
          doc_type: 'receipt_invoice',
          title: 'Official Invoice - Web Development Package',
          recipient_name: 'Apex Digital Solutions',
          submitted_values: {
            invoiceNo: 'INV-2026-P4R88',
            billToName: 'Apex Digital Solutions',
            billToEmail: 'billing@apexdigital.com',
            itemDesc: 'Full Stack Document Automation Solution',
            qty: 1,
            unitPrice: 1250,
            taxRate: 5,
            paymentStatus: 'PAID'
          },
          generated_by: 'admin@docugen.io',
          status: 'active',
          created_at: new Date(Date.now() - 3600000 * 48).toISOString()
        }
      ];
      localStorage.setItem(this.DEMO_STORAGE_KEY, JSON.stringify(sampleDocs));
    }
  },

  // ==========================================
  // AUTHENTICATION METHODS
  // ==========================================

  async signIn(email, password) {
    if (!this.isDemoMode && this.client) {
      const { data, error } = await this.client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    }

    // Demo Mode Auth: Accept credentials or default demo user
    if (email && password && password.length >= 4) {
      const demoUser = {
        id: 'demo-admin-id',
        email: email || 'admin@docugen.io',
        user_metadata: { name: email.split('@')[0] }
      };
      localStorage.setItem(this.DEMO_AUTH_KEY, JSON.stringify(demoUser));
      return { user: demoUser, session: { access_token: 'demo-token' } };
    } else {
      throw new Error('Please enter a valid email and password (minimum 4 characters).');
    }
  },

  async signOut() {
    if (!this.isDemoMode && this.client) {
      await this.client.auth.signOut();
    }
    localStorage.removeItem(this.DEMO_AUTH_KEY);
  },

  async getSession() {
    if (!this.isDemoMode && this.client) {
      const { data } = await this.client.auth.getSession();
      return data.session;
    }

    const saved = localStorage.getItem(this.DEMO_AUTH_KEY);
    if (saved) {
      return { user: JSON.parse(saved), access_token: 'demo-token' };
    }
    return null;
  },

  onAuthStateChange(callback) {
    if (!this.isDemoMode && this.client) {
      return this.client.auth.onAuthStateChange(callback);
    }
    return { data: { subscription: { unsubscribe: () => {} } } };
  },

  // ==========================================
  // DOCUMENT OPERATIONS
  // ==========================================

  async createDocument(docData) {
    if (!this.isDemoMode && this.client) {
      const { data, error } = await this.client
        .from('documents')
        .insert([docData])
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Demo Local Storage Insert
    const localList = JSON.parse(localStorage.getItem(this.DEMO_STORAGE_KEY) || '[]');
    const newDoc = Object.assign({
      id: crypto.randomUUID ? crypto.randomUUID() : 'demo-' + Date.now(),
      created_at: new Date().toISOString(),
      status: 'active'
    }, docData);

    localList.unshift(newDoc);
    localStorage.setItem(this.DEMO_STORAGE_KEY, JSON.stringify(localList));
    return newDoc;
  },

  async getDocuments({ searchQuery = '', docType = '', startDate = '', endDate = '', page = 1, limit = 10 } = {}) {
    if (!this.isDemoMode && this.client) {
      let query = this.client
        .from('documents')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (docType) query = query.eq('doc_type', docType);
      if (searchQuery) {
        query = query.or(`doc_reference.ilike.%${searchQuery}%,recipient_name.ilike.%${searchQuery}%,title.ilike.%${searchQuery}%`);
      }
      if (startDate) query = query.gte('created_at', new Date(startDate).toISOString());
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query = query.lte('created_at', end.toISOString());
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;
      return { documents: data || [], totalCount: count || 0 };
    }

    // Demo Storage Filter
    let localList = JSON.parse(localStorage.getItem(this.DEMO_STORAGE_KEY) || '[]');
    
    if (docType) {
      localList = localList.filter(d => d.doc_type === docType);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      localList = localList.filter(d => 
        (d.doc_reference && d.doc_reference.toLowerCase().includes(q)) ||
        (d.recipient_name && d.recipient_name.toLowerCase().includes(q)) ||
        (d.title && d.title.toLowerCase().includes(q))
      );
    }
    if (startDate) {
      localList = localList.filter(d => new Date(d.created_at) >= new Date(startDate));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      localList = localList.filter(d => new Date(d.created_at) <= end);
    }

    const totalCount = localList.length;
    const from = (page - 1) * limit;
    const paginated = localList.slice(from, from + limit);

    return { documents: paginated, totalCount };
  },

  async getDocumentByToken(publicToken) {
    if (!publicToken) return null;

    if (!this.isDemoMode && this.client) {
      const { data, error } = await this.client
        .from('documents')
        .select('*')
        .eq('public_token', publicToken)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Supabase query error for token:', error);
        return null;
      }
      return data;
    }

    // Demo Storage Lookup
    const localList = JSON.parse(localStorage.getItem(this.DEMO_STORAGE_KEY) || '[]');
    return localList.find(d => d.public_token === publicToken && d.status === 'active') || null;
  },

  async deleteDocument(id) {
    if (!this.isDemoMode && this.client) {
      const { error } = await this.client.from('documents').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    let localList = JSON.parse(localStorage.getItem(this.DEMO_STORAGE_KEY) || '[]');
    localList = localList.filter(d => d.id !== id);
    localStorage.setItem(this.DEMO_STORAGE_KEY, JSON.stringify(localList));
    return true;
  }
};

// Re-init listener when user updates config modal
window.addEventListener('supabase-config-changed', () => {
  SupabaseService.init();
});

window.SupabaseService = SupabaseService;
