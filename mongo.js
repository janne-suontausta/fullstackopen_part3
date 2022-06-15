/* eslint-disable no-undef */
const mongoose = require('mongoose');

// eslint-disable-next-line no-undef
if (process.argv.length !== 3 && process.argv.length !== 5) {
    console.log('give password as argument to list people or give password, name and number as arguments to ad person to people collection');
    // eslint-disable-next-line no-undef
    process.exit(1);
}

// eslint-disable-next-line no-undef
const password = process.argv[2];
const url = `mongodb+srv://janne:${password}@cluster0.jgrgo.mongodb.net/phoneBookApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 5) {
    Person.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
}
else {
    const name = process.argv[3];
    const number = process.argv[4];
    const person = new Person({
        name: name,
        number: number
    });

    person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
}
