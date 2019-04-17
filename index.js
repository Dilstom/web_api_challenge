// implement your API here
const express = require('express');
const server = express();
const db = require('./data/db');

server.use(express.json());

server.get('/api/users', (req, res) => {
 db
  .find()
  .then(users => {
   res.status(200).json(users);
  })
  .catch(err =>
   res
    .status(500)
    .json({ error: 'The user information could not be retrieved.' })
  );
});

server.get('/api/users/:id', (req, res) => {
 const id = req.params.id;
 db
  .findById(id)
  .then(user => {
   if (user.length === 0) {
    // doesn't hit this condition
    res
     .statusCode(404) // 404 - (Not Found)
     .json({ message: 'The user with the specified ID does not exist.' });
    return;
   }
   res.status(200).json(user);
  })
  .catch(err => {
   res
    .status(500)
    .json({ error: 'The user information could not be retrieved.' });
  });
});

server.post('/api/users', (req, res) => {
 const body = req.body;
 // 1. this condition jumps to .catch() ...
 //  2. db requires name only
 if (!body) {
  res
   .status(400) // 400 - Bad Request
   .json({ errorMessage: 'Please provide name and bio for the user.' });
  return;
 }
 db
  .insert(body)
  .then(user => {
   res.send(201).json(user); // 201 (Created)
  })
  .catch(err => {
   res
    .status(500) // 500 (Server Error)
    .json({
     error: 'There was an error while saving the user to the database',
    });
  });
});

//some bugs with error messages
server.delete('/api/users/:id', (req, res) => {
 const id = req.params.id;
 db
  .remove(id)
  .then(user => {
   res.status(204).end();
  })
  .catch(err => {
   res.status(500).json({ message: 'error retrieving the ser with this id' });
  });
});

server.put('/api/users/:id', (req, res) => {
 const id = req.params.id;
 const body = req.body;
 db
  .update(id, body)
  .then(user => {
   res.status(200).json(user);
  })
  .catch(err => {
   res.status(500).json({ err });
  });
});

server.listen(8000, () => console.log('Listening on port 8000'));
