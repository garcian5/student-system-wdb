// our web server
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // mongodb orm
const path = require('path'); // deals with file paths

// configure our environment variables
require('dotenv').config();

// initialize database
const app = express();

// open server in port 5000 or if it's busy open in a different port
const port = process.env.PORT || 5000;

// use cors middleware and express middleware
app.use(cors());
app.use(express.json());

const mongodb_uri = process.env.MONGODB_URI;

// connect our server to mongoose
mongoose.connect(mongodb_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// use routes
app.use('/admin', require('./routes/admin'));
app.use('/student', require('./routes/student'));
app.use('/instructor', require('./routes/instructor'));
app.use('/subject', require('./routes/subject'));
app.use('/subsched', require('./routes/subjectscheule'));
app.use('/schedule', require('./routes/schedule'));
app.use('/grade', require('./routes/grade'));

// heroku production
// server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static(path.join(__dirname + '/client/build')));
  // any request that's not line 24 should load up index.html
  app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname + '/client/build/index.html'));
  })
}

// start our server
app.listen(port, () => {
  console.log(`Server started at ${port}`);
})