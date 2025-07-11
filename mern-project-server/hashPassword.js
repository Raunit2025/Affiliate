const bcrypt = require('bcryptjs');

const plainPassword = '123456'; // or any password you want

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) return console.error(err);
  console.log("Hashed Password:", hash);
});
