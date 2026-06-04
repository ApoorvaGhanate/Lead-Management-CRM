function StatsPanel({ stats = { total: 0, breakdown: {} } }) {
  const statusList = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

  return (
    <div className="stats-list">
      <div className="stats-card">
        <h3>Total Leads</h3>
        <p>{stats.total || 0}</p>
      </div>

      {statusList.map((status) => (
        <div className="stats-card" key={status}>
          <h3>{status}</h3>
          <p>{stats.breakdown?.[status] || 0}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsPanel;
