const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const passwordSchema = new Schema({
  password: {type: String, required: true}
});
/********************/
/*  Response Model  */
/********************/
const responseSchema = new Schema({
  age: {
    type: String,
    enum: ['<10', '10-20', '20-30', '30-40', '40-50', '50-60', '60+', "unknown"],
    required: false
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'nonbinary', 'other', "unknown"],
    required: false
  },
  race: {
    type: String,
    enum: ['white', 'african american', 'asian', 'hispanic', 'american indian', 'other', "unknown"],
    required: false
  }
});

responseSchema.set('toJSON', {
  getters: true,
});


/********************/
/*   Choice Model   */
/********************/
const choiceSchema = new Schema({
  body: {type: String, required: true},
  responses: [
      {type: Schema.Types.ObjectId, ref: 'Response'}
    ]
});

choiceSchema.set('toJSON', {
  getters: true,
});


/********************/
/*  Question Model  */
/********************/
const questionSchema = new Schema({
  body: {type: String, required: true},
  date_asked: {type: Date, required: true},
  choices: [
    {type: Schema.Types.ObjectId, ref: 'Choice'}
  ],
});

questionSchema.set('toJSON,', {
  getters: true,
});



/********************/
/*     Exports      */
/********************/
const Question = mongoose.model('Question', questionSchema);
const Choice = mongoose.model('Choice', choiceSchema);
const Response = mongoose.model('Response', responseSchema);

module.exports = {
  Question: Question,
  Choice: Choice,
  Response: Response,
  Password: mongoose.model('password', passwordSchema)
};
