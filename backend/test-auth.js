require('dotenv').config();
const bcrypt = require('bcryptjs');

// Test password hash
const password = '(130Bpm)';
const hash = bcrypt.hashSync(password, 10);

console.log('Password:', password);
console.log('Hash:', hash);

// Test comparison
const testHash = '$2a$10$R.sQyoXjIVPvJwPnSe98xOBWfixKkRiPjT.yF5K0rr/iJCw0ELkFe';
const isValid = bcrypt.compareSync(password, testHash);
console.log('Password matches stored hash:', isValid);

// Test JWT_SECRET
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);