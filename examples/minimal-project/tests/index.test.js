const request = require('supertest');
const app = require('../src/index');

describe('Minimal Project Tests', () => {
  it('should have a working /health endpoint', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'up');
  });
});
