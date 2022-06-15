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

app.get('/api/info', (req, res, next) => {
    Person.find({}).then(people => {
        let dateStr = new Date().toString();

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('Phonebook has info for ' + people.length + ' people\n');
        res.end(dateStr);
    })
        .catch(e => next(e));
});

app.get('/api/people', (req, res) => {
    Person.find({}).then(people => res.json(people));
});

app.get('/api/people/:id', (req, res, next) => {
    const id = req.params.id;

    Person.findById(id)
        .then(person => {
            if (person) {
                res.json(person);
            }
            else {
                res.status(404).end();
            }
        })
        .catch(e => next(e));
});

app.delete('/api/people/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndRemove(id).then(() => {
        res.status(204).end();
    })
        .catch(e => next(e));
});

app.post('/api/people', (req, res, next) => {
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

        person.save()
            .then(result => {
                res.json(result);
            })
            .catch(error => next(error));
    }
});

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

app.use(errorHandler);
