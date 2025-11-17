const chai = require('chai');
const request = require('supertest');
const app = require('../app');

const { expect } = chai;

describe('API smoke tests', () => {
  it('GET / should return 200', async () => {
    const res = await request(app).get('/');
    expect(res.status).to.equal(200);
  });

  it('GET /api/health should return 200 and ok=true', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('ok', true);
  });
});
