const chai = require('chai');
const request = require('supertest');
const app = require('../app');
const { expect } = chai;

describe('Payments and Dashboard routes', () => {
  it('POST /api/payments/:fineId/pay requires fields', async () => {
    const res = await request(app).post('/api/payments/1/pay').send({});
    expect(res.status).to.equal(400);
  });

  it('POST /api/payments/:fineId/pay succeeds with minimal fields', async () => {
    const res = await request(app)
      .post('/api/payments/1/pay')
      .send({ method: 'Campus Cash', name: 'Test User' });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('ok', true);
  });

  it('GET /api/payments/history requires userId', async () => {
    const res = await request(app).get('/api/payments/history');
    expect(res.status).to.equal(400);
  });

  it('GET /api/payments/history returns payments for userId', async () => {
    const res = await request(app).get('/api/payments/history?userId=usr_001');
    expect(res.status).to.equal(200);
    expect(res.body.payments).to.be.an('array');
  });

  it('GET /api/dashboard requires userId', async () => {
    const res = await request(app).get('/api/dashboard');
    expect(res.status).to.equal(400);
  });

  it('GET /api/dashboard returns stats and dueItems', async () => {
    const res = await request(app).get('/api/dashboard?userId=usr_001');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('stats');
    expect(res.body).to.have.property('dueItems');
  });
});
