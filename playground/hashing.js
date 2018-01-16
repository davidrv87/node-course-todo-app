"use strict";

const {SHA256} = require('crypto-js');
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');

// var message = 'I am number 3';
// var hash = SHA256(message).toString();

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'SALT').toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data) + 'asd').toString();

// if (resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Do not trust!');
// }

// var data = {
//     id: 10
// };

// // Generate the token from the data and using the secret
// // Go to http://jwt.io if you want to revert it back
// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$4EzNQJe3p6I6HDwev16K1uUOHrqfilm0./t.opZA7JYj99kE4pAIy';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});










