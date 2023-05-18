require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.json());

const people = [];

//routes
//create person -post
app.post('/api/v1/people', (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ error: 'Please enter a name.' });
    return;
  }
  if (!req.body.age) {
    res.status(400).json({ error: 'Please provide age.' }); 
    return;
  } 
  //we assign index to a new person we are about to create to be eql to the lenght of our array (actual)
  //after pushing, the length of an array changes +1
  req.body.index = people.length;
  people.push(req.body);

  res.status(201).json({ message: 'A person record was added', index: req.body.index });
});


//get all the people
app.get('/api/v1/people/', (req, res) => {
  res.json(people);
});

//get specific person
//id represents a dynamic parameter that can be accessed via req.params.id in the route handler.
app.get('/api/v1/people/:id', (req, res) => {
  const index = req.params.id;
  if (isNaN(index) || index >= people.length) {
    res
      .status(404)
      .json({ message: 'The user with the id {index} does not exist' });
    return;
  }
  res.json(people[index]);
});

app.all('/api/v1/*', (req, res) => {
  res.json({ error: 'That route is not implemented.' });
});

const server = app.listen(3000, () => {
  console.log('Server is listening on port 3000...');
});

module.exports = { app, server };

