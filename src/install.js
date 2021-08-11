const child_process = require('child_process');
const fs = require('fs');

if (fs.existsSync('./autharchy')) {
  console.log('Autharchy seems to be installed')
  process.exit()
}

fs.mkdirSync('./.autharchy');

fs.writeFileSync('./.autharchy/config.js', `
module.exports = {
};`);

child_process.execSync('npm i -d autharchy', {stdio:[0,1,2]});