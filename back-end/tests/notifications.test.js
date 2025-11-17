const chai = require('chai');
const request = require('supertest');
const app = require('../app');
const { expect } = chai;

describe('Notifications routes', () => {
  it('GET /api/notifications/preferences requires userId', async () => {
    const res = await request(app).get('/api/notifications/preferences');
    expect(res.status).to.equal(400);
  });

  it('GET /api/notifications/preferences returns defaults for new user', async () => {
    const res = await request(app).get('/api/notifications/preferences?userId=new_user');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('email');
    expect(res.body).to.have.property('sms');
  });

  it('PUT /api/notifications/preferences updates values', async () => {
    const res = await request(app)
      .put('/api/notifications/preferences')
      .send({ userId: 'usr_001', email: false, reminder: { startDaysBefore: 3 } });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('ok', true);
    expect(res.body).to.have.property('email', false);
    expect(res.body.reminder).to.have.property('startDaysBefore', 3);
  });
});
