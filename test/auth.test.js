describe('Auth', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const user = { id: 1, role: 'admin' };
      const token = generateToken(user);
  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const user = { id: 1, role: 'admin' };
      const token = generateToken(user);
      const decoded = verifyToken(token);
      expect(decoded).toEqual({ userId: 1, role: 'admin' });
    });
      expect(token).toBeDefined();
    it('should return null for an invalid token', () => {
      const decoded = verifyToken('invalid-token');
      expect(decoded).toBeNull();
    });
  });
    });
  describe('authorizeUser', () => {
    it('should authorize an admin user for all actions on all resources', () => {
      const user = { id: 1, role: 'admin' };
      expect(authorizeUser(user, 'read', 'user')).toBe(true);
      expect(authorizeUser(user, 'create', 'product')).toBe(true);
      expect(authorizeUser(user, 'update', 'user')).toBe(true);
      expect(authorizeUser(user, 'delete', 'product')).toBe(true);
    });
  });
    it('should authorize a user for read and create actions on products', () => {
      const user = { id: 2, role: 'user' };
      expect(authorizeUser(user, 'read', 'product')).toBe(true);
      expect(authorizeUser(user, 'create', 'product')).toBe(false);
      expect(authorizeUser(user, 'update', 'product')).toBe(false);
      expect(authorizeUser(user, 'delete', 'product')).toBe(false);
    });
import { generateToken, verifyToken, authorizeUser } from '../src/auth';
    it('should not authorize a user for unauthorized actions', () => {
      const user = { id: 2, role: 'user' };
      expect(authorizeUser(user, 'delete', 'user')).toBe(false);
      expect(authorizeUser(user, 'create', 'unknown')).toBe(false);
    });
  });
});
