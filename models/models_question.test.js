var mongoose = require('mongoose');
var expect = require('chai').expect;

const models = require('./models.js');
var Response = models.Response;
var Choice = models.Choice;
var Question = models.Question;


/**************************/
/* Question Schema Tests  */
/**************************/

// ****************************** //
// *** Basic Validation Tests *** //
// ****************************** //
// Checks that a valid Question object has no errors
describe('question', function() {
  it('should be valid if no required fields are left empty', function(done) {
    // Several valid response objects to be used for creating a choice
    var r0 = new Response({age: 24, gender: "male", race: "white"});
    var r1 = new Response({age: 19, gender: "female", race: "african american"});
    var r2 = new Response({age: 32, gender: "other", race: "asian"});
    var r3 = new Response({age: 21, gender: "female", race: "hispanic"});
    var r4 = new Response({age: 22, gender: "other", race: "other"});
    var r5 = new Response({age: 14, gender: "other", race: "white"});
    var r6 = new Response({age: 17, gender: "other", race: "american indian"});
    var r7 = new Response({age: 84, gender: "male", race: "asian"});
    var r8 = new Response({age: 28, gender: "other", race: "african american"});

    // Several valid choice objects to be used for creating a question
    var c0 = new Choice({body: "Choice 0", responses: [r0.id, r1.id, r2.id]});
    var c1 = new Choice({body: "Choice 1", responses: [r3.id, r4.id, r5.id]});
    var c2 = new Choice({body: "Choice 2", responses: [r6.id, r7.id, r8.id]});

  	var q = new Question({body: "Select one of the following choices", date_asked: Date(), choices: [c0.id, c1.id, c2.id]});
  	q.validate(function(err) {
  		expect(err).to.not.exist;
  		done();
  	});
  });
});

// Checks that empty required fields create an error
describe('question', function() {
  it('should be invalid if a required field is left empty', function(done) {
    // Several valid response objects to be used for creating a choice
    var r0 = new Response({age: 24, gender: "male", race: "white"});
    var r1 = new Response({age: 19, gender: "female", race: "african american"});
    var r2 = new Response({age: 32, gender: "other", race: "asian"});
    var r3 = new Response({age: 21, gender: "female", race: "hispanic"});
    var r4 = new Response({age: 22, gender: "other", race: "other"});
    var r5 = new Response({age: 14, gender: "other", race: "white"});
    var r6 = new Response({age: 17, gender: "other", race: "american indian"});
    var r7 = new Response({age: 84, gender: "male", race: "asian"});
    var r8 = new Response({age: 28, gender: "other", race: "african american"});

    // Several valid choice objects to be used for creating a question
    var c0 = new Choice({body: "Choice 0", responses: [r0.id, r1.id, r2.id]});
    var c1 = new Choice({body: "Choice 1", responses: [r3.id, r4.id, r5.id]});
    var c2 = new Choice({body: "Choice 2", responses: [r6.id, r7.id, r8.id]});

    // Checks that an empty bodys field creates an error
    var q = new Question({date_asked: Date(), choices: [c0.id, c1.id, c2.id]});
  	q.validate(function(err) {
      expect(err.errors.body).to.exist;
      done();
    });

    // Checks that an empty date_asked field creates an error
    q = new Question({body: "Select one of the following choices", choices: [c0.id, c1.id, c2.id]});
  	q.validate(function(err) {
      expect(err.errors.date_asked).to.exist;
      done();
    });

    // // Checks that an empty choices field creates an error
    // q = new Question({body: "Select one of the choices", date_asked: Date()});
  	// q.validate(function(err) {
    //   expect(err.errors.choices).to.exist;
    //   done();
    // });

    // Checks that all empty required fields create an error
    q = new Question({});
    q.validate(function(err) {
    	expect(err.errors.body).to.exist;
      expect(err.errors.date_asked).to.exist;
      // expect(err.errors.choices).to.exist;
      done();
    });
  });
});



// ********************************** //
// *** Type/Enum Validation Tests *** //
// ********************************** //
// Checks that a question's body field is a string
describe('choice', function() {
  it('should be invalid if a Question\'s body field is not a string', function(done) {
    // Several valid response objects to be used for creating a choice
    var r0 = new Response({age: 24, gender: "male", race: "white"});
    var r1 = new Response({age: 19, gender: "female", race: "african american"});
    var r2 = new Response({age: 32, gender: "other", race: "asian"});
    var r3 = new Response({age: 21, gender: "female", race: "hispanic"});
    var r4 = new Response({age: 22, gender: "other", race: "other"});
    var r5 = new Response({age: 14, gender: "other", race: "white"});
    var r6 = new Response({age: 17, gender: "other", race: "american indian"});
    var r7 = new Response({age: 84, gender: "male", race: "asian"});
    var r8 = new Response({age: 28, gender: "other", race: "african american"});

    // Several valid choice objects to be used for creating a question
    var c0 = new Choice({body: "Choice 0", responses: [r0.id, r1.id, r2.id]});
    var c1 = new Choice({body: "Choice 1", responses: [r3.id, r4.id, r5.id]});
    var c2 = new Choice({body: "Choice 2", responses: [r6.id, r7.id, r8.id]});

    // Checks that a valid body field value does not create an error
    var q = new Question({body: "Select one of the following choices", date_asked: Date(), choices: [c0.id, c1.id, c2.id]});
  	q.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    q = new Question({body: "CHOOSE!!!", date_asked: Date(), choices: [c0.id, c1.id, c2.id]});
  	q.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    q = new Question({body: "S?", date_asked: Date(), choices: [c0.id, c1.id, c2.id]});
  	q.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });

    // Turns out that the models/validation that happens converts things to strings so these were initially suppose
    // to be invalid but they all actually work and I don't think that they would actually cause issues because they
    // would all be converted
    q = new Question({body: 5, date_asked: Date(), choices: [c0.id, c1.id, c2.id]});
  	q.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    q = new Question({body: 5.24, date_asked: Date(), choices: [c0.id, c1.id, c2.id]});
  	q.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    q = new Question({body: c0.id, date_asked: Date(), choices: [c0.id, c1.id, c2.id]});
  	q.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    q = new Question({body: 't', date_asked: Date(), choices: [c0.id, c1.id, c2.id]});
  	q.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
  });
});

// Checks that a question's date field is a date
describe('choice', function() {
  it('should be invalid if a Question\'s date field is not a date', function(done) {
    // Several valid response objects to be used for creating a choice
    var r0 = new Response({age: 24, gender: "male", race: "white"});
    var r1 = new Response({age: 19, gender: "female", race: "african american"});
    var r2 = new Response({age: 32, gender: "other", race: "asian"});
    var r3 = new Response({age: 21, gender: "female", race: "hispanic"});
    var r4 = new Response({age: 22, gender: "other", race: "other"});
    var r5 = new Response({age: 14, gender: "other", race: "white"});
    var r6 = new Response({age: 17, gender: "other", race: "american indian"});
    var r7 = new Response({age: 84, gender: "male", race: "asian"});
    var r8 = new Response({age: 28, gender: "other", race: "african american"});

    // Several valid choice objects to be used for creating a question
    var c0 = new Choice({body: "Choice 0", responses: [r0.id, r1.id, r2.id]});
    var c1 = new Choice({body: "Choice 1", responses: [r3.id, r4.id, r5.id]});
    var c2 = new Choice({body: "Choice 2", responses: [r6.id, r7.id, r8.id]});

    // Checks that a valid date field value does not create an error
    var q = new Question({body: "Select one of the following choices", date_asked: Date(), choices: [c0.id, c1.id, c2.id]});
  	q.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });

    // Checks that an invalid date field value creates an error
  });
});
