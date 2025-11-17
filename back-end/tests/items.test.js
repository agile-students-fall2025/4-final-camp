const chai = require('chai');
const request = require('supertest');
const app = require('../app');
const { expect } = chai;

describe('Items routes', () => {
  it('GET /api/items returns items, filters, facilities', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).to.equal(200);
    expect(res.body.items).to.be.an('array').that.is.not.empty;
    expect(res.body.filters).to.be.an('object');
    expect(res.body.facilities).to.be.an('array');
  });

  it('GET /api/items/1 returns a single item', async () => {
    const res = await request(app).get('/api/items/1');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id', 1);
  });

  it('GET /api/items/999 returns 404 when not found', async () => {
    const res = await request(app).get('/api/items/999');
    expect(res.status).to.equal(404);
  });
});
