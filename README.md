# Lead-Management-CRM
A full stack lead management CRM built with React, Vite, Node.js, Express, and MongoDB.

## Features

- Add new leads/customers
- View leads dashboard
- Update lead status
- Edit lead details
- Delete leads
- Search by name, email, or company
- Status filters and sort controls
- Pagination for lead lists
- Lead statistics panel
- Notes preview and mobile-friendly layout
- Responsive design
- Always-visible lead entry form and lead detail modal

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB

## Project Summary

This CRM is a polished lead management system built for submission-ready delivery. It supports:
- Add, view, edit, and delete leads
- Search by name, email, or company
- Filter by lead status and sort by date or name
- Paginated lead table for clean data browsing
- Live stats panel with counts for New, Contacted, Qualified, Converted, and Lost leads
- Form validation for required fields, valid email, and valid phone format
- Responsive dashboard with a balanced new-lead entry area and compact stats cards

## Local Setup

1. Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

2. Configure MongoDB

Create `backend/.env` based on `.env.example`:

```bash
MONGODB_URI=mongodb://localhost:27017/leadcrm
PORT=5000
```

3. Run backend and frontend

```bash
cd backend
npm run dev
```

In another terminal:

```bash
cd frontend
npm run dev
```

4. Open the app

Visit the Vite frontend URL shown in the terminal, typically `http://localhost:5173`.

## API Endpoints

- `POST /api/leads` - create a new lead
- `GET /api/leads` - fetch leads with optional search `?q=`, filter `?status=`, pagination `?page=&limit=`, and sorting `?sortBy=&order=` 
- `GET /api/leads/:id` - fetch a single lead
- `PUT /api/leads/:id` - update a lead
- `DELETE /api/leads/:id` - delete a lead

## Assignment Completion

- Required fields: `name`, `email`, `phone`, `company`, `status`, `notes`, `createdAt` are all implemented.
- Lead operations: add, view, update status, edit, delete, and search are supported.
- API design: RESTful Express routes with MongoDB integration.
- Bonus features included: lead statistics panel, pagination, sorting/filtering controls, responsive UI, and field validation.

## Final Notes

This CRM includes:
- full lead CRUD with validations
- search, sort, filter, and pagination
- compact statistics cards
- mobile-friendly responsive layout
- visible edit experience with live form scrolling


