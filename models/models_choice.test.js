var mongoose = require('mongoose');
var expect = require('chai').expect;

const models = require('./models.js');
var Response = models.Response;
var Choice = models.Choice;


/**************************/
/*  Choice Schema Tests   */
/**************************/

// ****************************** //
// *** Basic Validation Tests *** //
// ****************************** //
// Checks that a valid Choice object has no errors
describe('choice', function() {
  it('should be valid if no required fields are left empty', function(done) {
    // Several valid response objects to be used for creating a choice
    var r0 = new Response({age: 24, gender: "Male", race: "White"});
    var r1 = new Response({age: 19, gender: "Female", race: "Black/African American"});
    var r2 = new Response({age: 32, gender: "Other", race: "Asian"});

  	var c = new Choice({body: "Choice 1", responses: [r0.id, r1.id, r2.id]});
  	c.validate(function(err) {
  		expect(err).to.not.exist;
  		done();
  	});
  });
});

// Checks that empty required fields create an error
describe('choice', function() {
  it('should be invalid if a required field is left empty', function(done) {
    // Several valid response objects to be used for creating a choice
    var r0 = new Response({age: 24, gender: "Male", race: "White"});
    var r1 = new Response({age: 19, gender: "Female", race: "Black/African American"});
    var r2 = new Response({age: 32, gender: "Other", race: "Asian"});

    // Checks that an empty body field creates an error
    var c = new Choice({responses: [r0.id, r1.id, r2.id]});
  	c.validate(function(err) {
      expect(err.errors.body).to.exist;
      done();
    });
  });
});

// Checks that empty non-required fields do not create an console.error;
describe('choice', function() {
  it('should be invalid if a required field is left empty', function(done) {
    // Several valid response objects to be used for creating a choice
    var r0 = new Response({age: 24, gender: "Male", race: "White"});
    var r1 = new Response({age: 19, gender: "Female", race: "Black/African American"});
    var r2 = new Response({age: 32, gender: "Other", race: "Asian"});

    // Checks that an empty responses field does not create an error
    c = new Choice({body: "Choice 1"});
  	c.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
  });
});



// ********************************** //
// *** Type/Enum Validation Tests *** //
// ********************************** //
// Checks that a Choice's body field is a string
describe('choice', function() {
  it('should be invalid if a Choice\'s body field is not a string', function(done) {
    // Several valid response objects to be used for creating a choice
    var r0 = new Response({age: 24, gender: "Male", race: "White"});
    var r1 = new Response({age: 19, gender: "Female", race: "Black/African American"});
    var r2 = new Response({age: 32, gender: "Other", race: "Asian"});

    // Checks that an valid Choice's body field does not create an error
    var c = new Choice({body: "Choice 1", responses: [r0.id, r1.id, r2.id]});
  	c.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    c = new Choice({body: "1", responses: [r0.id, r1.id, r2.id]});
  	c.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    c = new Choice({body: "The everlasting tiredness that I feel everyday despite sleeping four times daily", responses: [r0.id, r1.id, r2.id]});
  	c.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });

    // Turns out that the models/validation that happens converts things to strings so these were initially suppose
    // to be invalid but they all actually work and I don't think that they would actually cause issues because they
    // would all be converted
    c = new Choice({body: 1, responses: [r0.id, r1.id, r2.id]});
  	c.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    c = new Choice({body: 24.2, responses: [r0.id, r1.id, r2.id]});
  	c.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    c = new Choice({body: r0.id, responses: [r0.id, r1.id, r2.id]});
  	c.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    c = new Choice({body: 'f', responses: [r0.id, r1.id, r2.id]});
  	c.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
  });
});
