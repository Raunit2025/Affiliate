const bcrypt = require('bcryptjs');

const plainPasswordToTest = '12345678'; // REPLACE THIS with the password you are typing
const hashedPasswordFromDB = '$2b$10$NKw4Sd1CBcW/GwX0AngzgOS14SZO5N52bpWGMBp6eC20lt8TwlfiG'; // REPLACE THIS with the hash copied from MongoDB

bcrypt.compare(plainPasswordToTest, hashedPasswordFromDB, (err, isMatch) => {
  if (err) {
    console.error('Error during comparison:', err);
    return;
  }
  if (isMatch) {
    console.log('Password matches!');
  } else {
    console.log('Password DOES NOT match.');
  }
});