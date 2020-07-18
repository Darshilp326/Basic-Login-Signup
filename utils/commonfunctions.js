const moment = require("moment");
module.exports.createJwtToken = function (user) {
  const payload = {
    user,
    iat: new Date().getTime(),
    exp: moment().add(7, "days").valueOf(),
  };
  return jwt.encode(payload, process.env.JWT_KEY);
};
