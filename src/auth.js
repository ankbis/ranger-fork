export function generateToken(user) {
  const payload = { userId: user.id, role: user.role };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}
const SECRET_KEY = 'your-secret-key';
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    return null;
  }
}
import jwt from 'jsonwebtoken';
export function authorizeUser(user, action, resource) {
  const allowedActions = {
    'admin': ['read', 'create', 'update', 'delete'],
    'user': ['read', 'create', 'update']
  };

  const userRole = user.role;
  const allowedActionsForRole = allowedActions[userRole] || [];
  const isAuthorized = allowedActionsForRole.includes(action);

  if (resource === 'user') {
    return isAuthorized;
  } else if (resource === 'product') {
    return userRole === 'admin' ? isAuthorized : action === 'read';
  }

  return false;
}

// Add tests for the above functions
// ...
