// components/TaskForm.jsx
import { useState } from "react";

function TaskForm({ onTaskAdded, showAlert, token }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split('T')[0],
    priority: "medium",
    category: "Personal",
    tags: ""
  });

  const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Education'];
  const priorities = [
    { value: 'low', label: 'Low', color: '#48bb78' },
    { value: 'medium', label: 'Medium', color: '#ecc94b' },
    { value: 'high', label: 'High', color: '#f56565' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      showAlert("error", "Please enter a task title");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }),
      });

      if (!res.ok) throw new Error("Failed to add task");

      showAlert("success", "Task added successfully");
      onTaskAdded();
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        dueDate: new Date().toISOString().split('T')[0],
        priority: "medium",
        category: "Personal",
        tags: ""
      });
    } catch (error) {
      showAlert("error", "Failed to add task");
    }
  };

  return (
    <form className="task-form-container" onSubmit={handleSubmit}>
      <h3><i className="fas fa-plus-circle"></i> Create New Task</h3>
      
      <div className="form-group">
        <label for="titleInput">Title *</label>
        <input
          id="titleInput"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Enter task description"
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label for="due">Due Date</label>
          <input
            id="due"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label for="priority">Priority</label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
          >
            {priorities.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label for="category">Category</label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label for="tags">Tags (comma-separated)</label>
          <input
            id="tags"
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            placeholder="e.g., urgent, important, home"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          <i className="fas fa-save"></i>
          Create Task
        </button>
      </div>
    </form>
  );
}

export default TaskForm;