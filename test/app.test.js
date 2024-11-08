const request = require('supertest');
const app = require('../app')

describe('GET /stations', () => {
  it('should return a 200 status code', async () => {
    const response = await request(app).get('/stations');
    expect(response.statusCode).toBe(200);
  })
  it('should return a JSON response', async () => {
    const response = await request(app).get('/stations');
    expect(response.header['content-type']).toBe('application/json; charset=utf-8');
  })
});

describe('GET /cities', () => {
    it('should return a 200 status code', async () => {
      const response = await request(app).get('/cities');
      expect(response.statusCode).toBe(200);
    })
    it('should return a JSON response', async () => {
      const response = await request(app).get('/cities');
      expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    })
});

describe('GET /measurements', () => {
    it('should return a 400 status code', async () => {
      const response = await request(app).get('/measurements');
      expect(response.statusCode).toBe(400);
    })
});