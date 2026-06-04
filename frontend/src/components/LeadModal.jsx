import React from 'react';

function LeadModal({ lead, onClose, onEdit }) {
  if (!lead) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>{lead.name}</h3>
          <div>
            <button className="secondary" onClick={() => onEdit && onEdit(lead)}>
              Edit
            </button>
            <button className="secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </header>

        <div className="modal-body">
          <p><strong>Company:</strong> {lead.company}</p>
          <p><strong>Email:</strong> {lead.email}</p>
          <p><strong>Phone:</strong> {lead.phone}</p>
          <p><strong>Status:</strong> {lead.status}</p>
          <p><strong>Notes:</strong></p>
          <p className="prewrap">{lead.notes || '—'}</p>
          <p><small>Created: {new Date(lead.createdAt).toLocaleString()}</small></p>
        </div>
      </div>
    </div>
  );
}

export default LeadModal;
