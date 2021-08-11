const child_process = require('child_process');
const fs = require('fs');



module.exports = function install (packageManager) {
  if (fs.existsSync('./autharchy')) {
    console.log('Autharchy seems to be installed')
    process.exit()
  }

  switch (packageManager) {
    case 'yarn':
      child_process.execSync('yarn add -D autharchy', {stdio:[0,1,2]});
      break;
    case 'npm':
      child_process.execSync('npm i -d autharchy', {stdio:[0,1,2]});
      break;
    default:
      console.log('Package manager', packageManager, 'not supported')
      process.exit(1)
  }
  
  fs.mkdirSync('./.autharchy');
  
  fs.writeFileSync('./.autharchy/config.js', 'module.exports = {};');
}