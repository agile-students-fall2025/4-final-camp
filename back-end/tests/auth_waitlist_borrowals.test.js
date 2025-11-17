const chai = require('chai');
const request = require('supertest');
const app = require('../app');
const { expect } = chai;

describe('Auth/Waitlist/Borrowals routes', () => {
  it('POST /api/auth/student/login requires credentials', async () => {
    const res = await request(app).post('/api/auth/student/login').send({});
    expect(res.status).to.equal(400);
  });

  it('POST /api/auth/student/login returns token on success', async () => {
    const res = await request(app)
      .post('/api/auth/student/login')
      .send({ email: 'student@univ.edu', password: 'pass' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('POST /api/waitlist validates body', async () => {
    const bad = await request(app).post('/api/waitlist').send({});
    expect(bad.status).to.equal(400);
  });

  it('POST /api/waitlist creates waitlist record', async () => {
    const ok = await request(app)
      .post('/api/waitlist')
      .send({ userId: 'usr_001', itemId: 'itm_1' });
    expect(ok.status).to.equal(201);
    expect(ok.body).to.have.property('ok', true);
  });

  it('GET /api/borrowals requires userId', async () => {
    const bad = await request(app).get('/api/borrowals');
    expect(bad.status).to.equal(400);
  });

  it('GET /api/borrowals returns data with userId', async () => {
    const res = await request(app).get('/api/borrowals?userId=usr_001');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('current');
    expect(res.body).to.have.property('history');
  });
});
