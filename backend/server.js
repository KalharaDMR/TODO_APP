const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// CORS setup
const corsOptions = {
  origin: ['http://localhost:5173'],
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
})