const statusOptions = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

function LeadTable({ leads, onEdit, onDelete, onStatusChange, onView }) {
  return (
    <div className="table-scroll">
      <table className="lead-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.company}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>
                <div className={"badge " + lead.status}>{lead.status}</div>
                <select
                  value={lead.status}
                  onChange={(event) => onStatusChange(lead._id, event.target.value)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                {lead.notes ? `${lead.notes.slice(0, 60)}${lead.notes.length > 60 ? '…' : ''}` : '—'}
              </td>
              <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
              <td className="actions">
                  <button type="button" className="secondary" onClick={() => onView && onView(lead)}>
                    View
                  </button>
                <button type="button" className="secondary" onClick={() => onEdit(lead)}>
                  Edit
                </button>
                <button type="button" className="danger" onClick={() => onDelete(lead._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeadTable;
