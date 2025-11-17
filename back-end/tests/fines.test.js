const chai = require('chai');
const request = require('supertest');
const app = require('../app');
const { expect } = chai;

describe('Fines routes', () => {
  it('GET /api/fines returns fines object', async () => {
    const res = await request(app).get('/api/fines?userId=usr_001');
    expect(res.status).to.equal(200);
    expect(res.body.fines).to.be.an('array');
  });

  it('POST /api/fines/:id/pay pays a fine or 404', async () => {
    const res = await request(app)
      .post('/api/fines/1/pay')
      .send({ method: 'Campus Cash' });
    expect([200, 404]).to.include(res.status);
  });
});
