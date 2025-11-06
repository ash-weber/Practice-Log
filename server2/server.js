require('dotenv').config();
const express = require('express');
const cors = require('cors');
const entriesRoutes = require('./routes/entries');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api', entriesRoutes);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
