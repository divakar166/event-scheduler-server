const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
  origin: ['http://localhost:5173',process.env.FRONTEND_URL],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));



app.use('/api/events', require('./routes/eventRoutes'));

app.get('/', (req, res) => {
  res.send('Event Handler Backend');
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

