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

test("Create a short Url", () => {
  return req
    .post(URL)
    .send({url: 'https://google.com'})
    .expect(200)
});

test("Should fail with an empty url", () => {
  return req
    .post(URL)
    .send({})
    .expect(500)
});

test("Should fail with an invalid url", () => {
  return req
    .post(URL)
    .send({url: 'this is not a url'})
    .expect(500)
});