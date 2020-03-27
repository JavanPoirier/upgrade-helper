const path = require('path')
const os = require('os')
const exec = require('child_process').exec;

const engineDir = path.join(os.homedir(), 'youiengine');
// const { engineDir } = require('./index');

//mappedEngineDirs.react.main

function createDiff(fromVersion, toVersion, _path, name) {
  console.log(engineDir)
  console.log(
    'PATH1',
    path.join(engineDir, fromVersion, _path)
  )
  console.log(
    'PATH2',
    path.join(engineDir, toVersion, _path)
  )
    
  exec(
    `git diff --no-index ${path.join(
      engineDir,
      fromVersion,
      _path,
    )} ${path.join(
      engineDir,
      toVersion,
      _path,
    )} > ${__dirname}/public/diffs/${name}.patch`
  )
}

module.exports = { createDiff }


