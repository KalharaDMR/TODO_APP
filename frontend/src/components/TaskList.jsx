// components/TaskList.jsx
import { useState } from "react";
import TaskItem from "./TaskItem";

function TaskList({ tasks, onTaskUpdate, showAlert, token }) {
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) return;
    
    if (!window.confirm(`Delete ${selectedTasks.length} selected tasks?`)) return;

    try {
      await Promise.all(selectedTasks.map(id => 
        fetch(`http://localhost:5000/api/tasks/${id}`, {
          method: "DELETE",
          headers: { Authorization: token },
        })
      ));

      showAlert("success", `${selectedTasks.length} tasks deleted successfully`);
      setSelectedTasks([]);
      setBulkMode(false);
      onTaskUpdate();
    } catch (error) {
      showAlert("error", "Failed to delete tasks");
    }
  };

  const handleBulkComplete = async () => {
    if (selectedTasks.length === 0) return;

    try {
      await Promise.all(selectedTasks.map(id => 
        fetch(`http://localhost:5000/api/tasks/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ completed: true }),
        })
      ));

      showAlert("success", `${selectedTasks.length} tasks marked as completed`);
      setSelectedTasks([]);
      setBulkMode(false);
      onTaskUpdate();
    } catch (error) {
      showAlert("error", "Failed to update tasks");
    }
  };

  const handleDeleteAllCompleted = async () => {
    if (!window.confirm("Delete all completed tasks?")) return;

    try {
      const res = await fetch("http://localhost:5000/api/tasks/completed/all", {
        method: "DELETE",
        headers: { Authorization: token },
      });

      const data = await res.json();
      showAlert("success", `${data.count} completed tasks deleted`);
      onTaskUpdate();
    } catch (error) {
      showAlert("error", "Failed to delete completed tasks");
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-clipboard-list"></i>
        <h3>No tasks found</h3>
        <p>Create a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list-wrapper">
      <div className="task-list-header">
        <div className="task-list-title">
          <h3>
            <i className="fas fa-tasks"></i>
            Tasks ({tasks.length})
          </h3>
          <div className="task-list-actions">
            <button 
              className={`bulk-mode-btn ${bulkMode ? 'active' : ''}`}
              onClick={() => setBulkMode(!bulkMode)}
            >
              <i className={`fas fa-${bulkMode ? 'times' : 'check-double'}`}></i>
              {bulkMode ? 'Exit Bulk Mode' : 'Bulk Select'}
            </button>
            {tasks.some(t => t.completed) && (
              <button 
                className="clear-completed-btn"
                onClick={handleDeleteAllCompleted}
              >
                <i className="fas fa-trash-alt"></i>
                Clear Completed
              </button>
            )}
          </div>
        </div>

        {bulkMode && selectedTasks.length > 0 && (
          <div className="bulk-actions">
            <span className="selected-count">
              {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
            </span>
            <div className="bulk-buttons">
              <button 
                className="bulk-complete-btn"
                onClick={handleBulkComplete}
              >
                <i className="fas fa-check-circle"></i>
                Mark Complete
              </button>
              <button 
                className="bulk-delete-btn"
                onClick={handleBulkDelete}
              >
                <i className="fas fa-trash"></i>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="task-list">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onTaskUpdate={onTaskUpdate}
            showAlert={showAlert}
            token={token}
            bulkMode={bulkMode}
            isSelected={selectedTasks.includes(task.id)}
            onSelect={(id, selected) => {
              if (selected) {
                setSelectedTasks([...selectedTasks, id]);
              } else {
                setSelectedTasks(selectedTasks.filter(tId => tId !== id));
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;