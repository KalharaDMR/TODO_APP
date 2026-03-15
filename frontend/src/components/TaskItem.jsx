// components/TaskItem.jsx
import { useState } from "react";

function TaskItem({ task, onTaskUpdate, showAlert, token, bulkMode, isSelected, onSelect }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    dueDate: task.dueDate,
    priority: task.priority,
    category: task.category
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#f56565';
      case 'medium': return '#ecc94b';
      case 'low': return '#48bb78';
      default: return '#a0aec0';
    }
  };

  const getDueDateStatus = (dueDate) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const due = new Date(dueDate).setHours(0, 0, 0, 0);
    
    if (task.completed) return 'completed';
    if (due < today) return 'overdue';
    if (due === today) return 'today';
    return 'upcoming';
  };

  const handleToggleComplete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!res.ok) throw new Error("Failed to update task");

      onTaskUpdate();
    } catch (error) {
      showAlert("error", error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      if (!res.ok) throw new Error("Failed to delete task");

      showAlert("success", "Task deleted successfully");
      onTaskUpdate();
    } catch (error) {
      showAlert("error", error.message);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error("Failed to update task");

      setIsEditing(false);
      showAlert("success", "Task updated successfully");
      onTaskUpdate();
    } catch (error) {
      showAlert("error", error.message);
    }
  };

  const dueDateStatus = getDueDateStatus(task.dueDate);
  const priorityColor = getPriorityColor(task.priority);

  if (isEditing) {
    return (
      <div className="task-item editing">
        <div className="task-edit-form">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({...editData, title: e.target.value})}
            placeholder="Task title"
            className="edit-title"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({...editData, description: e.target.value})}
            placeholder="Description"
            className="edit-description"
            rows="2"
          />
          <div className="edit-actions">
            <input
              type="date"
              value={editData.dueDate}
              onChange={(e) => setEditData({...editData, dueDate: e.target.value})}
            />
            <select
              value={editData.priority}
              onChange={(e) => setEditData({...editData, priority: e.target.value})}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              value={editData.category}
              onChange={(e) => setEditData({...editData, category: e.target.value})}
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
            </select>
          </div>
          <div className="edit-buttons">
            <button onClick={handleSaveEdit} className="save-btn">
              <i className="fas fa-save"></i>
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">
              <i className="fas fa-times"></i>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item ${dueDateStatus} ${task.completed ? 'completed' : ''}`}>
      {bulkMode ? (
        <div className="task-select">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(task.id, e.target.checked)}
          />
        </div>
      ) : (
        <div className="task-checkbox">
          <input
            type="checkbox"
            checked={task.completed || false}
            onChange={handleToggleComplete}
          />
        </div>
      )}

      <div className="task-content">
        <div className="task-main">
          <span className={`task-title ${task.completed ? 'completed' : ''}`}>
            {task.title}
          </span>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
        </div>

        <div className="task-metadata">
          <span className="task-category">
            <i className="fas fa-tag"></i>
            {task.category}
          </span>
          
          <span className="task-due-date">
            <i className="fas fa-calendar-alt"></i>
            {new Date(task.dueDate).toLocaleDateString()}
            {dueDateStatus === 'today' && <span className="badge today">Today</span>}
            {dueDateStatus === 'overdue' && <span className="badge overdue">Overdue</span>}
          </span>

          <span className="task-priority" style={{ backgroundColor: priorityColor + '20', color: priorityColor }}>
            <i className="fas fa-flag"></i>
            {task.priority}
          </span>

          {task.tags && task.tags.length > 0 && (
            <div className="task-tags">
              {task.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {!bulkMode && (
        <div className="task-actions">
          <button
            className="edit-btn"
            onClick={() => setIsEditing(true)}
            title="Edit task"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="delete-btn"
            onClick={handleDelete}
            title="Delete task"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskItem;