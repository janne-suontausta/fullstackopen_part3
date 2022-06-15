const mongoose = require('mongoose');

// const url = `mongodb+srv://janne:${password}@cluster0.jgrgo.mongodb.net/phoneBookApp?retryWrites=true&w=majority`;
const url = process.env.MONGODB_URI

console.log('connecting', url);
mongoose.connect(url).then(r => {
    console.log('Connected to the database');
})
.catch(e => {
    console.log('Database connection failed');
    console.log(url);
});

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3
    },
    number: String
});

personSchema.set('toJSON',  {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
});
  
module.exports = mongoose.model('Person', personSchema);
