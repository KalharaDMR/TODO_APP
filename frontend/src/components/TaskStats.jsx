// components/TaskStats.jsx
function TaskStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats-grid">
      <div className="stat-card total">
        <div className="stat-icon">
          <i className="fas fa-clipboard-list"></i>
        </div>
        <div className="stat-content">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{stats.total}</span>
        </div>
      </div>

      <div className="stat-card completed">
        <div className="stat-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <div className="stat-content">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
      </div>

      <div className="stat-card pending">
        <div className="stat-icon">
          <i className="fas fa-clock"></i>
        </div>
        <div className="stat-content">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{stats.pending}</span>
        </div>
      </div>

      <div className="stat-card overdue">
        <div className="stat-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <div className="stat-content">
          <span className="stat-label">Overdue</span>
          <span className="stat-value">{stats.overdue}</span>
        </div>
      </div>

      <div className="stat-card today">
        <div className="stat-icon">
          <i className="fas fa-calendar-day"></i>
        </div>
        <div className="stat-content">
          <span className="stat-label">Due Today</span>
          <span className="stat-value">{stats.today}</span>
        </div>
      </div>

      <div className="stat-card priority">
        <div className="stat-icon">
          <i className="fas fa-flag"></i>
        </div>
        <div className="stat-content">
          <span className="stat-label">High Priority</span>
          <span className="stat-value">{stats.byPriority?.high || 0}</span>
        </div>
      </div>
    </div>
  );
}

export default TaskStats;