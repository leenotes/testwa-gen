const fs = require("fs");
const path = require("path");
const lessToJs = require("less-vars-to-js");

module.exports = () => {
  const themePath = path.join(__dirname, "./theme.less");
  return lessToJs(fs.readFileSync(themePath, "utf8"));
};
