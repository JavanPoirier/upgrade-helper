const fs = require('fs')
const path = require('path')
const os = require('os')
const inquirer = require('inquirer')
const exec = require('child_process').exec;
const open = require('open');

const { serveDiffs } = require('../server');
const { createDiff } = require('../server/git');

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))

const engineDir = path.join(os.homedir(), 'youiengine');
var projectDir;

async function cli() {
    //Upgrade helper must be run in project root.
    validateProjectDir();

    !fs.existsSync(engineDir) && await promptEngineDir();
    //TODO: Validate engine dir by checking or semantic version folders.
    console.log(`Engine directory set to ${engineDir}`);

    main();
}

function main() {
  //exec(`npm run start`);
  createDiff('5.11.0', '5.12.0', 'templates/ReactTemplateProject', 'ReactTemplateProject');
  createDiff('5.11.0', '5.12.0', 'src/cloud', 'cloud');

  serveDiffs();
}

function promptEngineDir() {
  return new Promise(async (resolve, reject) => {
    let engineDirValid = false;
    do {
      console.log(`Cannot find engine directory at ${engineDir}`)
      response = await inquirer.prompt({
        type: 'fuzzypath',
        name: 'path',
        message: 'Enter absolute path to engine install folder:',
        rootPath: os.homedir(),
        depthLimit: 0
      });

      engineDir = response.path;
      fs.existsSync(engineDir) && (engineDirValid = true)
    } while (!engineDirValid)
    resolve();
  })
}

function validateProjectDir() {
  projectDir = process.cwd();
  console.log('Project Dir: ', projectDir);
}

module.exports = { cli, engineDir: engineDir };
