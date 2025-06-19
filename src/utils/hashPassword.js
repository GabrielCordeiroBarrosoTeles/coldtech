// Simple password hashing utility (no bcryptjs dependency)

// Hash a password (simplified version)
export async function hashPassword(password) {
  // In a real app, use a proper hashing library
  return `hashed_${password}`;
}

// Compare a password with a hash (simplified version)
export async function comparePassword(password, hashedPassword) {
  // In a real app, use a proper comparison method
  return `hashed_${password}` === hashedPassword;
}