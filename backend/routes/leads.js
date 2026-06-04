const express = require('express');
const Lead = require('../models/Lead');
const router = express.Router();

const validStatuses = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
const sortableFields = ['createdAt', 'name', 'company', 'status'];

function validateLead(data = {}) {
  const errors = {};

  if (!data.name?.trim()) errors.name = 'Name is required';
  if (!data.email?.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Email must be valid';
  if (!data.phone?.trim()) errors.phone = 'Phone is required';
  else if (!/^[0-9+\-\s()]{7,20}$/.test(data.phone)) errors.phone = 'Phone must be valid';
  if (!data.company?.trim()) errors.company = 'Company is required';

  if (data.status && !validStatuses.includes(data.status)) {
    errors.status = 'Status must be one of: ' + validStatuses.join(', ');
  }

  return errors;
}

router.post('/', async (req, res) => {
  const errors = validateLead(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  try {
    const lead = new Lead(req.body);
    const savedLead = await lead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Global stats for dashboard
router.get('/stats', async (req, res) => {
  try {
    const agg = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const breakdown = {};
    agg.forEach((a) => (breakdown[a._id] = a.count));
    const total = await Lead.countDocuments();
    res.json({ total, breakdown });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const {
      q = '',
      status = '',
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};
    if (q) {
      query.$or = [
        { name: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
        { company: new RegExp(q, 'i') }
      ];
    }

    if (status && validStatuses.includes(status)) {
      query.status = status;
    }

    const sortKey = sortableFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = order === 'asc' ? 1 : -1;

    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const leads = await Lead.find(query)
      .sort({ [sortKey]: sortDirection })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    const count = await Lead.countDocuments(query);
    res.json({ leads, total: count, page: parsedPage, limit: parsedLimit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const errors = validateLead(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedLead) return res.status(404).json({ error: 'Lead not found' });
    res.json(updatedLead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    if (!deletedLead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
