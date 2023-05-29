const chai = require('chai'); //for assertions
const chaiHttp = require('chai-http');// for http requests 
const { app, server } = require('../app');

//chai will use chaiHttp plugin and assertion style 'should'
chai.use(chaiHttp);
chai.should();

//groups related test cases together and provides a description for the tests for the description title "People". 
//after describe block is executed /after running all the tests, close the server and stop listening to the port
//this block includes all the tests that begin with  another 'describe' fn
describe('People', () => {
  after(() => {
    server.close();
  });

  describe('post /api/v1/people', () => {
    it('should not create a people entry without a name', (done) => {
      chai
        .request(app) // make http request to my express app
        .post('/api/v1/people') // http method and endpoint to be tested
        .send({ age: 10 }) // payload that the test is sending to the endpoint/server
        .end((err, res) => { // here goes the response we should get from server (status code and res.body) and we compare it with what we actually get
          res.should.have.status(400);
          res.body.should.be.eql({ error: 'Please enter a name.' });
          done(); // means that test case  is compleated
        });
    });

    it('should create a people entry with valid input', (done) => {
      chai
        .request(app)
        .post('/api/v1/people')
        .send({ name: 'Ana', age: 20 })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.contain({ message: 'A person record was added' });
          this.lastIndex = res.body.index;//store the value of the "index" property from the response body for potential later use.
          done();
        });
    });
  });

  //length of an array is always a LAST index (0,1,2...) +1
  //just to be sure: in app.js on line 22 we set req.body.index = people.length; BEFORE pushing a new person to an array- so that
  //after pushing the length of an array will be that index (just created/las index= length of an array before pushing) +1 -> so everything  works fine?
  describe('get /api/v1/people', () => {
    it(`should return an array of person entries of length ${
      this.lastIndex + 1
    }`, (done) => {
      chai
        .request(app)
        .get('/api/v1/people')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.length(this.lastIndex + 1);
          done();
        });
    });
  });

  describe('get /apl/v1/people/:id', () => {
    it('should return the entry corresponding to the last person added.', (done) => {
      chai
        .request(app)
        .get(`/api/v1/people/${this.lastIndex}`)
        .end((err, res) => {
          res.should.have.status(200);
          console.log(res.body);
          res.body.name.should.be.eql('Ana');
          done();
        });
    });

    it('should return an error if the index is >= the length of the array', (done) => {
      chai
        .request(app)
        .get('/api/v1/people/45875245')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});

