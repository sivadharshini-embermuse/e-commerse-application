import crypto from 'crypto';
const bytes = crypto.randomBytes(16);
console.log(bytes.toString('hex'));

const token=bytes.toString('hex');
console.log(token);
//unique reset token 
const resettoken=crypto.createHash('sha256').update(token).digest('hex');
console.log(resettoken);

// validity
const resetTokenExpire=Date.now()+15*60*1000;
console.log(resetTokenExpire);