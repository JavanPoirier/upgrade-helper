const fs = require('fs')
const path = require('path')
const os = require('os')
const util = require('util')
const mapDir = require('node-map-directory')
const compareVersions = require('compare-versions')
const exec = require('child_process').exec

const engineUpgradeVersion = '5.12.0'
const projectDir = path.join(os.homedir(), '/Desktop/Repos/network10')
const projectCloudDir = path.join(projectDir, 'client')

const engineDir = path.join(os.homedir(), 'youiengine')
const exlcudedEngineDir = ['.cli']
const mappedEngineDirs = {
  cloud: {
    main: 'src/cloud'
  },
  react: {
    main: 'templates/ReactTemplateProject/',
    exclude: [
      '__tests__',
      'client',
      'index.youi.js',
      'README.youi.md',
      'youi/AE'
    ]
  }
}

var engineVersions
var projectEngineVersion
var _projectEngineVersion = '5.9.0'

getInstalledVersions()
getPackageJson()
compareCloudFiles()
console.log(getUpgradableVersions(_projectEngineVersion, engineVersions))
createGitDiff('5.9.0', '5.12.0')

function getInstalledVersions() {
  const dirs = fs.readdirSync(engineDir).filter(dir => {
    if (exlcudedEngineDir.includes(dir)) return false
    return fs.statSync(path.join(engineDir, dir)).isDirectory()
  })

  engineVersions = dirs
    .filter(version => compareVersions.validate(version))
    .sort(compareVersions)
  console.log('engineVersions: ', engineVersions)
  return engineVersions
}

function getPackageJson() {
  try {
    const file = fs.readFileSync(path.join(projectDir, '/package.json'), 'utf8')
    const fileJson = JSON.parse(file)
    projectEngineVersion = fileJson['dependencies']['@youi/react-native-youi']
  } catch (err) {
    console.log('Unable to get current project package.json')
  }

  console.log('Current project version: ', projectEngineVersion)
}

/**
 * Returns an object with common cloud files between project and engine.
 */
async function compareCloudFiles() {
  var project = await mapDir(projectCloudDir)
  var engine = await mapDir(
    path.join(engineDir, engineUpgradeVersion, mappedEngineDirs.cloud.main)
  )
  const common = filterCommonDeep(project, engine)

  /**
   * Filters common objects from project to engine.
   *
   * @param {project} project project files for nested object level
   * @param {engine} engine Children at same nested level as common
   */
  function filterCommonDeep(project, engine) {
    var common = []
    project.forEach((_project, i) => {
      var _common = engine.find(
        _engine =>
          _engine.name == _project.name &&
          _engine.extension == _project.extension
      )

      if (_common) {
        if (_project.children) {
          //Find engine common object
          const _engine = engine.find(
            _engine =>
              _engine.name == _project.name &&
              _engine.extension == _project.extension
          )
          common.push({
            ..._project,
            children: filterCommonDeep(_project.children, _engine.children)
          })
        } else {
          common.push(_common)
        }
      }
    })

    return common
  }

  console.log(util.inspect(common, false, null, true /* enable colors */))
}

function getUpgradableVersions(currentVersion, engineVersions) {
  return engineVersions.filter(engineVersion =>
    compareVersions.compare(currentVersion, engineVersion, '<')
  )
}

function createGitDiff(fromVersion, toVersion) {
  console.log(
    'PATH1',
    path.join(
      engineDir,
      fromVersion,
      mappedEngineDirs.react.main,
      '/package.json'
    )
  )
  console.log(
    'PATH2',
    path.join(
      engineDir,
      toVersion,
      mappedEngineDirs.react.main,
      '/package.json'
    )
  )

  exec(
    `git diff ${path.join(
      engineDir,
      fromVersion,
      mappedEngineDirs.react.main,
      '/package.json'
    )} ${path.join(
      engineDir,
      toVersion,
      mappedEngineDirs.react.main,
      '/package.json'
    )} > ~/Desktop/test.diff`
  )
}
