var mongoose = require('mongoose');
var expect = require('chai').expect;

const models = require('./models.js');
var Response = models.Response;


/**************************/
/*  Response Schema Tests */
/**************************/

// ****************************** //
// *** Basic Validation Tests *** //
// ****************************** //
// Checks that a valid Response object has no errors
describe('response', function() {
  it('should be valid if no required fields are left empty', function(done) {
  	var r = new Response({age: "<10", gender: "male", race: "white"});
  	r.validate(function(err) {
  		expect(err).to.not.exist;
  		done();
  	});
  });
});

// Checks that empty non-required fields do not create an error
describe('response', function() {
  it('should be invalid if a required field is left empty', function(done) {
    // Checks that an empty gender field does not createe an error
    var r = new Response({age: "10-20", race: "white"});
  	r.validate(function(err) {
  	  expect(err).to.not.exist;
      done();
    });

    // Checks that an empty age field does not createe an error
    r = new Response({gender: "male", race: "white"});
  	r.validate(function(err) {
  	  expect(err).to.not.exist;
      done();
    });

    // Checks that an empty race field does not createe an error
    r = new Response({age: "30-40", gender: "male"});
  	r.validate(function(err) {
  	  expect(err).to.not.exist;
      done();
    });

    // Checks that all empty non-required fields do not create an error
    r = new Response({});
  	r.validate(function(err) {
    	expect(err).to.not.exist;
      done();
    });
  });
});



// ********************************** //
// *** Type/Enum Validation Tests *** //
// ********************************** //

// Checks that a Response's age field is one of the string enum expected
// Technically there capitalization should not matter but since this will be a select option it does not matter
describe('response', function() {
  it('should be invalid if a Response\'s age field is not an expected string enum', function(done) {
    // Checks that a valid gender does not create an error
    var r = new Response({age: "10-20", gender: "male", race: "white"});
    r.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    r = new Response({ age: "60+", gender: "female", race: "white"});
    r.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    r = new Response({ age: "30-40", gender: "other", race: "white"});
    r.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });

    // Checks that an invalid age creates an error
    r = new Response({ age: "0", gender: "male", race: "white"});
    r.validate(function(err) {
      expect(err.errors.age).to.exist;
      done();
    });
    r = new Response({ age: 0, gender: "male", race: "white"});
    r.validate(function(err) {
      expect(err.errors.age).to.exist;
      done();
    });
    r = new Response({ age: "70-80", gender: "male", race: "white"});
    r.validate(function(err) {
      expect(err.errors.age).to.exist;
      done();
    });
    r = new Response({ age: "Helicopter", gender: "male", race: "white"});
    r.validate(function(err) {
      expect(err.errors.age).to.exist;
      done();
    });
    r = new Response({ age: 24, gender: "male", race: "white"});
    r.validate(function(err) {
      expect(err.errors.age).to.exist;
      done();
    });
  });
});

// Checks that a Response's gender field is one of the following string enums ['male', 'female', 'other']
// Technically there capitalization should not matter but since this will be a select option it does not matter
describe('response', function() {
  it('should be invalid if a Response\'s gender field is not one of the following string enums [\'male\', \'female\', \'other\']', function(done) {
    // Checks that a valid gender does not create an error
    var r = new Response({age: "10-20", gender: "male", race: "white"});
  	r.validate(function(err) {
  		expect(err).to.not.exist;
  		done();
  	});
    r = new Response({ age: "10-20", gender: "female", race: "white"});
    r.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    r = new Response({ age: "10-20", gender: "other", race: "white"});
    r.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });

    // Checks that an invalid gender creates an error
    var r = new Response({age: "10-20", gender: "m", race: "white"});
  	r.validate(function(err) {
  		expect(err.errors.gender).to.exist;
  		done();
  	});
    r = new Response({ age: "10-20", gender: "f", race: "white"});
    r.validate(function(err) {
      expect(err.errors.gender).to.exist;
      done();
    });
    r = new Response({age: "10-20", gender: "mal", race: "white"});
    r.validate(function(err) {
      expect(err.errors.gender).to.exist;
      done();
    });
    r = new Response({age: "10-20", gender: 0, race: "white"});
    r.validate(function(err) {
      expect(err.errors.gender).to.exist;
      done();
    });
    r = new Response({ age: "10-20", gender: 2, race: "white"});
    r.validate(function(err) {
      expect(err.errors.gender).to.exist;
      done();
    });
    r = new Response({ age: "10-20", gender: "Helicopter", race: "white"});
    r.validate(function(err) {
      expect(err.errors.gender).to.exist;
      done();
    });
  });
});

// Checks that a Response's race field is one of the following string enums ['white', 'african american', 'asian', 'hispanic', 'american indian', 'other']
// Technically there capitalization should not matter but since this will be a select option it does not matter
describe('response', function() {
  it('should be invalid if a Response\'s race field is not one of the following string enums [\'white\', \'african american\', \'asian\', \'hispanic\', \'american indian\', \'other\']', function(done) {
    // Checks that a valid race does not create an error
    var r = new Response({age: "10-20", gender: "male", race: "white"});
  	r.validate(function(err) {
  		expect(err).to.not.exist;
  		done();
  	});
    r = new Response({ age: "10-20", gender: "male", race: "african american"});
    r.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    r = new Response({ age: "10-20", gender: "male", race: "asian"});
    r.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    r = new Response({ age: "10-20", gender: "male", race: "hispanic"});
    r.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    r = new Response({ age: "10-20", gender: "male", race: "american indian"});
    r.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
    r = new Response({age: "10-20", gender: "male", race: "other"});
    r.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });

    // Checks that an invalid race creates an error
    var r = new Response({age: "10-20", gender: "male", race: "whit"});
  	r.validate(function(err) {
  		expect(err.errors.race).to.exist;
  		done();
  	});
    r = new Response({age: "10-20", gender: "male", race: "orange"});
    r.validate(function(err) {
      expect(err.errors.race).to.exist;
      done();
    });
    r = new Response({ age: "10-20", gender: "male", race: 0});
    r.validate(function(err) {
      expect(err.errors.race).to.exist;
      done();
    });
    r = new Response({age: "10-20", gender: "male", race: 2});
    r.validate(function(err) {
      expect(err.errors.race).to.exist;
      done();
    });
    r = new Response({age: "10-20", gender: "male", race: "dwarf"});
    r.validate(function(err) {
      expect(err.errors.race).to.exist;
      done();
    });
  });
});
