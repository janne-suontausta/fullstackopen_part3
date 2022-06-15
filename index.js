require('dotenv').config();
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));
app.use(morgan('tiny'));

let people = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
]

app.get('/api/info', (req, res) => {
    let dateStr = new Date().toString();

    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.write('Phonebook has info for ' + people.length + ' people\n');
    res.end(dateStr);
})

app.get('/api/people', (req, res) => {
    Person.find({}).then(people => res.json(people));
})

app.get('/api/people/:id', (req, res, next) => {
    const id = req.params.id;
    const person = people.find(p => p.id === id);

    Person.findById(id).then(person => {
        if (person) {
            res.json(person);
        }
        else {
            res.status(404).end();
        }
    })
    .catch(e => next(e));
})

app.delete('/api/people/:id', (req, res, next) => {
    const id = req.params.id;
    people = people.filter(p => p.id !== id);
    Person.findByIdAndRemove(id).then(r => {
        res.status(204).end();
    })
    .catch(e => next(e));
})

app.post('/api/people', (req, res) => {
    const personObj = req.body;

    if (!personObj.name) {
        res.status(400).json({ error: 'name is missing' });
    }
    else if (!personObj.number) {
        res.status(400).json({ error: 'number is missing' });
    }
    else {
        const person = new Person({
            name: personObj.name,
            number: personObj.number
        });
      
        person.save().then(result => {
            res.json(result);
        });
    }
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message);
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' });
    }
  
    next(error);
}
  
app.use(errorHandler);
