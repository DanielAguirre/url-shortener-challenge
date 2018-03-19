const request = require('supertest');
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const app = require('../server/server');

const mockgoose = new Mockgoose(mongoose);

const req = request(app);
const URL = '/';

beforeAll(done => {
  mockgoose.prepareStorage().then(function() {
		mongoose.connect('mongodb://localhost/urlsShortestTest', function(err) {
			done(err);
		});
	});
});

test("Create a short Url", done => {
  return req
    .post(URL)
    .set('Accept', 'application/json')
    .send({url: 'https://google.com'})
    .expect(200)
    .then((res) => {
      const body = res.body
      expect(body.url).toMatch('https://google.com')
      expect(body.hash).toBeDefined();
      done();
    })
});

test("Should fail with an empty url", done => {
  return req
    .post(URL)
    .set('Accept', 'application/json')
    .send({})
    .expect(422)
    .then(res => {
      const err = res.body.err[0];
      expect(err.param).toBe('url');
      expect(err.msg).toBe('You must supply a url!');
      done();
    })
});

test("Should fail with an invalid url", () => {
  return req
    .post(URL)
    .send({url: 'this is not a url'})
    .set('Accept', 'application/json')
    .expect(500)
});


test('Should visit  the original url twice', done => {
  let hash;
  return req
    .post(URL)
    .set('Accept', 'application/json')
    .send({url: 'https://google.com'})
    .expect(200)
    .then((res) => {
      const body = res.body
      hash = body.hash
      return req
        .get(`${URL}${hash}`)
        .set('Accept', 'application/json')
        .expect(200)
    },done)
    .then(() =>{
      return req
        .get(`${URL}${hash}`)
        .set('Accept', 'application/json')
        .expect(200)
    })
    .then(res => {
      const body = res.body
      expect(body.visit).toBe(2);
      done()
    });
});

test('Should find the original url using the hash', done =>{
  return req
    .post(URL)
    .set('Accept', 'application/json')
    .send({url: 'https://google.com'})
    .expect(200)
    .then((res) => {
      const body = res.body
      return req
        .get(`${URL}${body.hash}`)
        .set('Accept', 'application/json')
        .expect(200)
    },done)
    .then(res => {
      const body = res.body
      expect(body.url).toMatch('https://google.com');
      done()
    });
});

test('Should get a 404  when the hash was not found', done =>{
    return req
      .get(`${URL}this.hash.not.exists`)
      .set('Accept', 'application/json')
      .expect(404)
      .then(res => {
        const err = res.body.err;
        expect(err.msg).toMatch('Hash not found');
        done();
      });

});

test('Should remove the information when the hash and removetoken make match', done =>{
  let hash;
  let removeToken;

  return req
    .post(URL)
    .set('Accept', 'application/json')
    .send({url: 'https://google.com'})
    .expect(200)
    .then((res) => {
      const body = res.body;
      return req
        .get(`${URL}${body.hash}`)
        .set('Accept', 'application/json')
        .expect(200)
    },done)
    .then((res)  => {
      const body = res.body
      hash = body.hash;
      removeToken = body.removeToken;
      return req
        .delete(`${URL}${body.hash}/${body.removeToken}`)
        .set('Accept', 'application/json')
        .expect(204)
    }, done)
    .then(() => {
      req
        .get(`${URL}${hash}`)
        .set('Accept', 'application/json')
        .expect(404)
        done();
    })
});