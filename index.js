require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const morgan = require('morgan')

const errorHandler = require('./errorHandler');
const Person = require('./models/person.js');

const app = express();
app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());

morgan.token('content', req => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  Person.find({})
    .then(persons =>
      res.send(
        `<p>Phonebook has info for ${persons.length} people</p>` +
        `<p>${Date()}</p>`
      )
    )
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => res.json(persons));
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((resp) => {
      if (resp) {
        res.json(resp)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error));
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error));
})

app.put('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndUpdate(req.params.id, req.body,
    { new: true, runValidators: true, context: 'query' }
  )
    .then((resp) => {
      res.json(resp)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const newPerson = new Person({ ...req.body });
  let error = '';
  if ( newPerson.name && newPerson.name !== ''
    && newPerson.phone && newPerson.phone !== '') {
    // const newName = newPerson.name.toLowerCase();
    // if (persons.find(p => p.name.toLowerCase() === newName) === undefined) {
    newPerson.save()
      .then(resp => {
        console.log(`added ${resp.name} number ${resp.phone} to phonebook`)
        return res.json(resp);
      })
      .catch(error => next(error));
  } else {
    // something's missing!
    error = 'request must include both a non-empty "name" and a non-empty "phone" field';
    return res.status(400).json({ error })
  }
})

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(errorHandler);
