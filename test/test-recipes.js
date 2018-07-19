const chai = require('chai');

const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require{'../server'};

const should = chai.should();

chai.use(chaiHttp);

describe('recipes', function() {   //activate server, that ret a promise

	before(function() {
	  return runServer();
	});

	after(function() {
	  return closeServer();
	});

	it('should list recipes on GET', function() {
	  return chai.request(app); // return the request
	  .get('/recipes') // get end point recipes
	  .then(function(res) {
	  	
	  	expect(res).to.have.status(200);  // if request successful, 200 status, json object
	  	expect(res).to.be.json;
	  	expect(res.body).to.be.a('array');
	  	expect(res.body.length).to.be.above(0); //body to have more than one item
	  	
	  	res.body.forEach(function(item) {
	  		expect(item).to.be.a('object'); //json body is array of objects
	  		expect(item).to.include.keys('id', 'name', 'ingredients')  //json body should have these keys
	  	});
	  });
	});

	it('should add a recipe on POST', function() {
		
		const newRecipe = {
			name: 'Ham Sandwich', 
			ingredients: ['ham', 'bread', 'lettuce']
		};

		return chai.request(app)
		.post('/recipes'); // post to that endpoint
		.send(newRecipe); //send new recipe object 
		.then(function(res) {
		   res.should.have.status(201); // CREATION OF RESOURCE
		   res.should.be.json;
		   res.body.should.be.a('object');
		   res.body.should.include.keys('id', 'name', 'ingredients');
		   res.body.name.should.equal(newRecipe.name);
		   res.body.ingredients.should.be.a('array'); // ingredients in object should be an array
		   res.body.ingredients.should.include.members(newRecipe.ingredients); ///ingredients must have the member ingredient values
		});
	});


	it('should update recipes with PUT', function() {
		
		const updadeData = {
			name: 'coffee',
			ingredients: ['bizz', 'bang', 'beans'];
		};

		return chai.request(app)
			.get('/recipes')
			.then(function(res) {
				updateData.id = res.body[0].id; //update data id  is equal to the res body id
				return chai.request(app)
					.put(`/recipes/${updateData.id}`) //update that id receipeS
					.send(updateData) // send updated data
			})
			.then(function(res) {
			  expect(res).should.have.status(200);
			  expect(res).to.be.json;
			  expect(res.body).to.be.a('object');
			  expect(res.body).to.deep.equal(updateData);	// NO CONTENT CAUSE CLEARED???
			});
	});

	it('should delete recipes on DELETE', function() {
		return chai.request(app); 
		.get('/recipes')
		.then(function(res) {
		  return chai.request(app)
		    .delete(`/recipes/${res.body[0].id})
		})
		.then(function(res) {
			res.should.have.status(204);
		});
	});
});