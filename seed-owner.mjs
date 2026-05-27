import crypto from 'crypto';
import mysql from 'mysql2/promise';

// Hash password function
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function seedOwner() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    const passwordHash = hashPassword('password123');
    
    await connection.execute(
      'INSERT INTO owner (username, passwordHash) VALUES (?, ?)',
      ['admin', passwordHash]
    );
    
    console.log('Owner account created successfully!');
    console.log('Username: admin');
    console.log('Password: password123');
    
    await connection.end();
  } catch (error) {
    console.error('Error seeding owner:', error.message);
    process.exit(1);
  }
}

seedOwner();
