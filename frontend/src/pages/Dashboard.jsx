// Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TaskStats from "../components/TaskStats";
import TaskFilters from "../components/TaskFilters";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [filters, setFilters] = useState({
    filter: 'all',
    category: '',
    priority: ''
  });
  const [showTaskForm, setShowTaskForm] = useState(false);

  const token = localStorage.getItem("token");

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
  };

  const loadTasks = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.filter) queryParams.append('filter', filters.filter);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.priority) queryParams.append('priority', filters.priority);

      const res = await fetch(`http://localhost:5000/api/tasks?${queryParams}`, {
        headers: { Authorization: token },
      });

      if (res.status === 401) {
        navigate("/");
        return;
      }

      const data = await res.json();
      setTasks(data);
    } catch (error) {
      showAlert("error", "Failed to load tasks");
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks/stats", {
        headers: { Authorization: token },
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadTasks(), loadStats()]);
      setLoading(false);
    };

    loadData();
  }, [filters]);

  const handleTaskUpdate = async () => {
    await Promise.all([loadTasks(), loadStats()]);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {alert.show && (
          <div className={`alert ${alert.type}`}>
            <i className={`fas fa-${alert.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
            {alert.message}
          </div>
        )}

        <div className="dashboard-header">
          <div className="header-left">
            <h1>
              <i className="fas fa-tasks"></i>
              TaskFlow
            </h1>
            <button 
              className="new-task-btn"
              onClick={() => setShowTaskForm(!showTaskForm)}
            >
              <i className={`fas fa-${showTaskForm ? 'times' : 'plus'}`}></i>
              {showTaskForm ? 'Cancel' : 'New Task'}
            </button>
          </div>
          <button className="header-logout-btn" onClick={logout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>

        {showTaskForm && (
          <TaskForm 
            onTaskAdded={() => {
              setShowTaskForm(false);
              handleTaskUpdate();
            }}
            showAlert={showAlert}
            token={token}
          />
        )}

        {stats && <TaskStats stats={stats} />}

        <TaskFilters 
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={() => setFilters({ filter: 'all', category: '', priority: '' })}
        />

        <TaskList 
          tasks={tasks}
          onTaskUpdate={handleTaskUpdate}
          showAlert={showAlert}
          token={token}
        />
      </div>
    </div>
  );
}

export default Dashboard;