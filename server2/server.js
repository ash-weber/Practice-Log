require('dotenv').config();
const express = require('express');
const cors = require('cors');
const entryRoutes = require('./routes/viewrou');

const app = express();
const PORT = process.env.PORT || 8000;


app.use(cors());
app.use(express.json());


app.use('/api', entryRoutes);


app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
