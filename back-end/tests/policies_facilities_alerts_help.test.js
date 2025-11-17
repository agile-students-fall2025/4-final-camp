const chai = require('chai');
const request = require('supertest');
const app = require('../app');
const { expect } = chai;

describe('Policies/Facilities/Alerts/Help routes', () => {
  it('GET /api/policies returns policy object', async () => {
    const res = await request(app).get('/api/policies');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('borrowingPeriodDays');
  });

  it('GET /api/facilities returns array', async () => {
    const res = await request(app).get('/api/facilities');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('GET /api/facilities/im-lab/items returns items list', async () => {
    const res = await request(app).get('/api/facilities/im-lab/items');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('GET /api/alerts returns alerts array', async () => {
    const res = await request(app).get('/api/alerts');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('GET /api/help returns help sections', async () => {
    const res = await request(app).get('/api/help');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});
