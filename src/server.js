// src/server.js
const express = require('express');
const path = require('path');
const app = require('./app');

const PORT = process.env.PORT || 3000;

// ✅ Serve static files from "src/public"
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Optional: serve index.html at the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

