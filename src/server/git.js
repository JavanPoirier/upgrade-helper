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
    `git diff --no-index ${path.join(
      engineDir,
      fromVersion,
      mappedEngineDirs.react.main,
      '/package.json'
    )} ${path.join(
      engineDir,
      toVersion,
      mappedEngineDirs.react.main,
      '/package.json'
    )} > `
  )
}

module.exports = { createGitDiff }
