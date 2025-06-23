const bcrypt =  require('bcryptjs');
bcrypt.hash('admin@admin',10).then(console.log);