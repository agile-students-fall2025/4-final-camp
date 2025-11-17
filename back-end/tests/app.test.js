const chai = require('chai');
const request = require('supertest');
const app = require('../app');
const { expect } = chai;

describe('App basics', () => {
  it('returns 404 JSON for unknown route', async () => {
    const res = await request(app).get('/nope/not-found');
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error', 'Not Found');
  });
});
