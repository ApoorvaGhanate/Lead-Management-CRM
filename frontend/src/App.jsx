import { useEffect, useMemo, useRef, useState } from 'react';
import { createLead, deleteLead, fetchLeads, updateLead, fetchStats } from './api.js';
import LeadForm from './components/LeadForm.jsx';
import LeadTable from './components/LeadTable.jsx';
import LeadModal from './components/LeadModal.jsx';
import StatsPanel from './components/StatsPanel.jsx';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  status: 'New',
  notes: ''
};

const statusOptions = ['All', 'New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
const sortOptions = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'name', label: 'Name' },
  { value: 'company', label: 'Company' },
  { value: 'status', label: 'Status' }
];

function App() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [viewLead, setViewLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [globalStats, setGlobalStats] = useState({ total: 0, breakdown: {} });
  const formRef = useRef(null);
  const isEditing = Boolean(selectedLead?._id);

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3200);
  };

  useEffect(() => {
    if (selectedLead && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedLead, formRef]);

  const loadLeads = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchLeads({
        search,
        page,
        limit,
        status: statusFilter,
        sortBy,
        order
      });
      setLeads(data.leads);
      setTotal(data.total);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to load leads');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await fetchStats();
      setGlobalStats(data);
    } catch (err) {
      // non-fatal
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchTerm), 450);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sortBy, order]);

  useEffect(() => {
    loadLeads();
    loadStats();
  }, [search, page, statusFilter, sortBy, order]);

  const addLead = async (values) => {
    try {
      const lead = await createLead(values);
      setLeads((current) => [lead, ...current]);
      setSelectedLead(null);
      showMessage('Lead added successfully.');
      await loadStats();
    } catch (err) {
      setError(err.response?.data?.errors ? Object.values(err.response.data.errors).join(', ') : err.message || 'Create failed');
    }
  };

  const saveLead = async (id, values) => {
    try {
      const updated = await updateLead(id, values);
      setLeads((current) => current.map((lead) => (lead._id === id ? updated : lead)));
      setSelectedLead(null);
      showMessage('Lead updated successfully.');
      await loadStats();
    } catch (err) {
      setError(err.response?.data?.errors ? Object.values(err.response.data.errors).join(', ') : err.message || 'Update failed');
    }
  };

  const removeLead = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await deleteLead(id);
      setLeads((current) => current.filter((lead) => lead._id !== id));
      showMessage('Lead deleted successfully.');
      await loadStats();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Delete failed');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const updated = await updateLead(id, { status });
      setLeads((current) => current.map((lead) => (lead._id === id ? updated : lead)));
      showMessage('Status updated.');
      await loadStats();
    } catch (err) {
      setError(err.response?.data?.errors ? Object.values(err.response.data.errors).join(', ') : err.message || 'Status update failed');
    }
  };

  const stats = useMemo(() => {
    const totalCount = leads.length;
    const breakdown = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});
    return { total: totalCount, breakdown };
  }, [leads]);

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Lead Management CRM</h1>
          <p>Track leads, update status, and manage customer relationships.</p>
        </div>
      </header>

      <main>
        <div className="dashboard-grid">
          <section className="panel form-panel" ref={formRef}>
            <div className="panel-header">
              <div>
                <h2>{selectedLead ? 'Edit Lead' : 'New Lead'}</h2>
                {selectedLead && (
                  <p className="edit-banner">Editing {selectedLead.name}. Update details or cancel to add a new lead.</p>
                )}
              </div>
              {selectedLead && (
                <button className="secondary" onClick={() => setSelectedLead(null)}>
                  Cancel Edit
                </button>
              )}
            </div>
            <LeadForm
              key={selectedLead?._id || 'new'}
              initialData={selectedLead || initialForm}
              onSubmit={selectedLead ? (values) => saveLead(selectedLead._id, values) : addLead}
              onCancel={() => setSelectedLead(null)}
            />
          </section>

          <section className="panel stats-panel">
            <StatsPanel stats={globalStats} />
          </section>
        </div>

        <section className="panel lead-panel">
          <div className="panel-header">
            <div>
              <h2>All Leads</h2>
              <p>Showing {leads.length} of {globalStats.total} total leads</p>
            </div>
            <div className="filters-row">
              <input
                type="search"
                placeholder="Search by name, email, or company"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                {statusOptions.map((status) => (
                  <option key={status} value={status === 'All' ? '' : status}>
                    {status}
                  </option>
                ))}
              </select>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort by {option.label}
                  </option>
                ))}
              </select>
              <select value={order} onChange={(event) => setOrder(event.target.value)}>
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
            </div>
          </div>

          {message && <div className="notification success">{message}</div>}
          {error && <div className="notification error">{error}</div>}

          {loading ? (
            <div className="loading">Loading leads…</div>
          ) : leads.length === 0 ? (
            <div className="empty-state">No leads found. Add a new lead or clear filters.</div>
          ) : (
            <>
              <LeadTable
                leads={leads}
                onEdit={setSelectedLead}
                onDelete={removeLead}
                onStatusChange={updateStatus}
                onView={setViewLead}
              />

              <div className="pagination">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      {viewLead && (
        <LeadModal
          lead={viewLead}
          onClose={() => setViewLead(null)}
          onEdit={(lead) => {
            setSelectedLead(lead);
            setViewLead(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
