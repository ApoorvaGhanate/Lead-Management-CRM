import { useState } from 'react';

const statusOptions = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

function LeadForm({ initialData, onSubmit, onCancel }) {
  const [formState, setFormState] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    const errs = {};
    if (!formState.name?.trim()) errs.name = 'Name is required';
    if (!formState.email?.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) errs.email = 'Email is invalid';
    if (!formState.phone?.trim()) errs.phone = 'Phone is required';
    else if (!/^[0-9+\-\s()]{7,20}$/.test(formState.phone)) errs.phone = 'Phone must be valid';
    if (!formState.company?.trim()) errs.company = 'Company is required';

    setErrors(errs);
    if (Object.keys(errs).length) return;

    onSubmit(formState);
  };

  return (
    <form onSubmit={submit}>
      <div className="field-row">
        <label>
          Name
          <input name="name" value={formState.name} onChange={handleChange} required />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </label>
        <label>
          Email
          <input name="email" type="email" value={formState.email} onChange={handleChange} required />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </label>
      </div>

      <div className="field-row">
        <label>
          Phone
          <input name="phone" type="tel" value={formState.phone} onChange={handleChange} required />
          {errors.phone && <div className="field-error">{errors.phone}</div>}
        </label>
        <label>
          Company
          <input name="company" value={formState.company} onChange={handleChange} required />
          {errors.company && <div className="field-error">{errors.company}</div>}
        </label>
      </div>

      <div className="field-row single">
        <label>
          Lead Status
          <select name="status" value={formState.status} onChange={handleChange}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="field-row single">
        <label>
          Notes
          <textarea name="notes" value={formState.notes} onChange={handleChange} />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary">
          {initialData?._id ? 'Save Lead' : 'Add Lead'}
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default LeadForm;
