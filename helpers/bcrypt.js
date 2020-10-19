const bcrypt = require('bcrypt');
const saltRound = Number(process.env.SALT_ROUND);

const encryptPwd = (password) => bcrypt.hashSync(password,saltRound)
const decryptPwd = (password,dbPassword) => bcrypt.compareSync(password,dbPassword);

module.exports = {
    encryptPwd, decryptPwd
}
