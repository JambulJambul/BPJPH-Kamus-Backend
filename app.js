const express = require('express');
const cors = require('cors');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const { sequelize } = require('./models');
const bodyParser = require('body-parser');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));
app.use(cors()); 


const userRoutes = require('./routes/userRoutes');
const entryRoutes = require('./routes/entryRoutes');

app.use('/users', userRoutes);
app.use('/entries', entryRoutes);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();