const chai = require('chai');
const request = require('supertest');
const app = require('../app');
const { expect } = chai;

describe('Staff routes', () => {
  it('GET /api/staff/inventory returns items list', async () => {
    const res = await request(app).get('/api/staff/inventory');
    expect(res.status).to.equal(200);
    expect(res.body.items).to.be.an('array');
  });

  it('POST /api/staff/items requires name', async () => {
    const res = await request(app).post('/api/staff/items').send({});
    expect(res.status).to.equal(400);
  });

  it('POST /api/staff/items creates item', async () => {
    const res = await request(app)
      .post('/api/staff/items')
      .send({ name: 'Test Item', category: 'Other', facility: 'IM Lab' });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('ok', true);
  });

  it('POST /api/staff/checkout validates inputs', async () => {
    const res = await request(app).post('/api/staff/checkout').send({});
    expect(res.status).to.equal(400);
  });

  it('POST /api/staff/checkin validates input', async () => {
    const res = await request(app).post('/api/staff/checkin').send({});
    expect(res.status).to.equal(400);
  });

  it('GET /api/staff/reservations returns reservations', async () => {
    const res = await request(app).get('/api/staff/reservations');
    expect(res.status).to.equal(200);
    expect(res.body.reservations).to.be.an('array');
  });

  it('GET /api/staff/overdue returns items', async () => {
    const res = await request(app).get('/api/staff/overdue');
    expect(res.status).to.equal(200);
    expect(res.body.items).to.be.an('array');
  });

  it('GET /api/staff/alerts returns stats', async () => {
    const res = await request(app).get('/api/staff/alerts');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('inventoryStats');
  });

  it('GET /api/staff/fines returns empty array', async () => {
    const res = await request(app).get('/api/staff/fines');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});
