// components/TaskFilters.jsx
function TaskFilters({ filters, onFilterChange, onClearFilters }) {
  const filterOptions = [
    { value: 'all', label: 'All Tasks', icon: 'fas fa-list' },
    { value: 'today', label: 'Due Today', icon: 'fas fa-calendar-day' },
    { value: 'upcoming', label: 'Upcoming', icon: 'fas fa-calendar-alt' },
    { value: 'overdue', label: 'Overdue', icon: 'fas fa-exclamation-triangle' },
    { value: 'completed', label: 'Completed', icon: 'fas fa-check-circle' },
    { value: 'pending', label: 'Pending', icon: 'fas fa-clock' }
  ];

  const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Education'];
  const priorities = ['high', 'medium', 'low'];

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h4><i className="fas fa-filter"></i> Filters</h4>
        <button className="clear-filters" onClick={onClearFilters}>
          <i className="fas fa-times"></i>
          Clear All
        </button>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label>Status</label>
          <div className="filter-options">
            {filterOptions.map(option => (
              <button
                key={option.value}
                className={`filter-btn ${filters.filter === option.value ? 'active' : ''}`}
                onClick={() => onFilterChange({...filters, filter: option.value})}
              >
                <i className={option.icon}></i>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({...filters, priority: e.target.value})}
          >
            <option value="">All Priorities</option>
            {priorities.map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default TaskFilters;