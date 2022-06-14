const mongoose = require('mongoose');

if (process.argv.length !== 3 && process.argv.length !== 5) {
    console.log('give password as argument to list people or give password, name and number as arguments to ad person to people collection');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://janne:${password}@cluster0.jgrgo.mongodb.net/phoneBookApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
    Person.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
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
      
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
}
