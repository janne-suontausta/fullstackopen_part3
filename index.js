const express = require('express')
const app = express()

app.use(express.json());

let persons = [
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
    res.write('Phonebook has info for ' + persons.length + ' people\n');
    res.end(dateStr);
})

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);

    if (person) {
        res.json(person);
    }
    else {
        res.status(404).end();
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id);

    res.status(204).end();
})

app.post('/api/persons', (req, res) => {
    const person = req.body;

    if (!person.name) {
        res.json({ error: 'name is missing' });
    }
    else if (!person.number) {
        res.json({ error: 'number is missing' });
    }
    else if (persons.find(p => p.name === person.name)) {
        res.json({ error: 'name must be unique' });
    }
    else {
        const id = Math.round(Math.random() * 1000000);
        person.id = id;
        persons = persons.concat(person)
    
        res.json(person);    
    }

})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
