const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
console.log(secret);
f41f956113567cab67efe66b3c4a41c92af08c4f30f61befcd400773a0cb62d52ca28506fd75124432da68b00064352c335c39066c7bd81b257bb6a137e783c2