const bcrypt = require('bcryptjs');

const plainPassword = '12345678';

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) return console.error(err);
  console.log("Hashed Password:", hash);
});
