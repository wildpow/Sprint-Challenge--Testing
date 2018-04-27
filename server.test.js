const mongoose = require('mongoose');
const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');
const server = require('./server');
const Game = require('./models');
const chaiHTTP = require('chai-http');

server.use(chaiHTTP);

describe('Games', () => {
  before(done => {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/test');
    const db = mongoose.connection;
    db.on('error', () => console.error.bind(console, 'connection error'));
    db.once('open', () => {
      console.log('we are connected');
      done();
    });
  });

  after(done => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
      console.log('we are disconnected');
    });
  });
  let testId = undefined;
  let testGame = undefined;
  // declare some global variables for use of testing
  // hint - these wont be constants because you'll need to override them.
  beforeEach(done => {
    const theGame = new Game({
      title: 'Skykid',
      genre: 'arcade',
      date: '1987'
    })
    theGame.save((error, game) =>{
      if (error) return done(error)
      testGame = game;
      testId = game._id;
      done()
      .catch(err => {
        console.error(err);
        done();
      })
    })
    // write a beforeEach hook that will populate your test DB with data
    // each time this hook runs, you should save a document to your db
    // by saving the document you'll be able to use it in each of your `it` blocks
  });
  afterEach(done => {
    Game.remove((error)=> {
      if (error) return done(error)
      done();
    })
  });

  // test the POST here

  // test the GET here

  // test the PUT here

  // --- Stretch Problem ---
  // Test the DELETE here
  describe('DELETE', () => {
    it('should remove item from our DB', () => {
      chai
      .request(server)
      .delete(`/api/game/destroy/${testId}`)
      .end((err, res) => {
        if(err) {
          console.loe(err);
          done();
        }
        expect(res.status).to.equal(400);
        expect(res.body.succes).to.equal(
          `${testGame.title} was removed`
        );
        done();
      })
    });
  });
  
});
