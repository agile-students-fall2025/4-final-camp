const chai = require('chai');
const request = require('supertest');
const app = require('../app');
const { expect } = chai;

describe('API Smoke Tests', () => {
  it('GET / should return root message', async () => {
    const res = await request(app).get('/');
    expect(res.status).to.equal(200);
    expect(res.text).to.contain('C.A.M.P. Backend API');
  });

  it('GET /api/health should return ok:true', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('ok', true);
  });

  it('GET /api/items should return items bundle', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('items').that.is.an('array');
    expect(res.body).to.have.property('filters');
  });

  it('GET /api/fines should return fines list object', async () => {
    const res = await request(app).get('/api/fines');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('fines').that.is.an('array');
  });
});
