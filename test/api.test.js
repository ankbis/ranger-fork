  beforeAll(() => {
    adminToken = generateToken({ id: 1, role: 'admin' });
    userToken = generateToken({ id: 2, role: 'user' });
  });
describe('API', () => {
  describe('POST /login', () => {
    it('should return a token for valid credentials', async () => {
      const res = await request(app)
        .post('/login')
        .send({ username: 'admin', password: 'password' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  let adminToken;
    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/login')
        .send({ username: 'invalid', password: 'invalid' });
      expect(res.statusCode).toBe(401);
    });
  });
  let userToken;
  describe('GET /api/users', () => {
    it('should return users for an authorized admin user', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
    });
import request from 'supertest';
    it('should return 403 for an unauthorized user', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(403);
    });
  });
import app from '../src/server';
  describe('GET /api/products', () => {
    it('should return products for an authorized user', async () => {
      const res = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
    });
import { generateToken } from '../src/auth';
    it('should return 403 for an unauthorized user', async () => {
      const res = await request(app)
        .get('/api/products')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.statusCode).toBe(403);
    });
  });
});
