import styled from '@emotion/styled'
import { Alert } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { parseDiff, withChangeSelect } from 'react-diff-view'
import 'react-diff-view/style/index.css'
import { getDiffPatchURL } from '../../utils'
import { AppNameWarning } from './AppNameWarning'
import CompletedFilesCounter from './CompletedFilesCounter'
import DiffLoading from './Diff/DiffLoading'
import DiffSection from './Diff/DiffSection'
import ViewStyleOptions from './Diff/DiffViewStyleOptions'
import UsefulContentSection from './UsefulContentSection'

const Container = styled.div`
  width: 90%;
`

const getDiffKey = ({ oldRevision, newRevision }) =>
  `${oldRevision}${newRevision}`

const DiffViewer = ({
  showDiff,
  fromVersion,
  toVersion,
  selectedChanges,
  onToggleChangeSelection,
  appName
}) => {
  const [isLoading, setLoading] = useState(true)
  const [diff, setDiff] = useState(null)
  const [completedDiffs, setCompletedDiffs] = useState([])

  const handleCompleteDiff = diffKey => {
    if (completedDiffs.includes(diffKey)) {
      return setCompletedDiffs(prevCompletedDiffs =>
        prevCompletedDiffs.filter(completedDiff => completedDiff !== diffKey)
      )
    }

    setCompletedDiffs(prevCompletedDiffs => [...prevCompletedDiffs, diffKey])
  }

  const renderUpgradeDoneMessage = ({ diff, completedDiffs }) =>
    diff.length === completedDiffs.length && (
      <Alert
        style={{ marginTop: 16 }}
        message="Your upgrade is done 🎉🎉"
        type="success"
        showIcon
        closable
      />
    )

  const resetCompletedDiff = () => setCompletedDiffs([])

  const [diffViewStyle, setViewStyle] = useState(
    localStorage.getItem('viewStyle') || 'split'
  )

  const handleViewStyleChange = newViewStyle => {
    setViewStyle(newViewStyle)
    localStorage.setItem('viewStyle', newViewStyle)
  }

  const replaceAppName = useCallback(
    text => {
      if (!appName) return text
      return text
        .replace(/YiRNTemplateApp/g, appName)
        .replace(/YiReactApp/g, appName.toLowerCase())
    },
    [appName]
  )

  useEffect(async () => {
    if (!showDiff) {
      return
    }

    console.log('here')
    const fetchDiff = async () => {
      setLoading(true)

      const files = ['ReactTemplateProject', 'cloud']

      var response = ''
      for await (const file of files) {
        response += await // await fetch(getDiffPatchURL({ fromVersion, toVersion }))
        (
          await fetch(`http://localhost:8080/diffs/${file}.patch`, {
            headers: {
              Origin: 'http://localhost:3000'
            }
          })
        ).text()
      }

      console.log('response', response)

      setDiff(
        parseDiff(replaceAppName(response)).sort(({ newPath }) =>
          newPath.includes('package.json') ? -1 : 1
        )
      )

      resetCompletedDiff()

      setLoading(false)
    }

    const debounce = setTimeout(() => {
      fetchDiff()
    }, 750)
    return () => {
      clearTimeout(debounce)
    }
  }, [appName, fromVersion, replaceAppName, showDiff, toVersion])

  if (!showDiff) {
    return null
  }

  if (isLoading) {
    return (
      <Container>
        <DiffLoading />
      </Container>
    )
  }

  const diffSectionProps = {
    diff: diff,
    getDiffKey: getDiffKey,
    completedDiffs: completedDiffs,
    fromVersion: fromVersion,
    toVersion: toVersion,
    handleCompleteDiff: handleCompleteDiff,
    selectedChanges: selectedChanges,
    onToggleChangeSelection: onToggleChangeSelection
  }

  return (
    <Container>
      <UsefulContentSection
        isLoading={isLoading}
        fromVersion={fromVersion}
        toVersion={toVersion}
      />

      <AppNameWarning />

      <ViewStyleOptions
        handleViewStyleChange={handleViewStyleChange}
        diffViewStyle={diffViewStyle}
      />

      <DiffSection
        {...diffSectionProps}
        isDoneSection={false}
        diffViewStyle={diffViewStyle}
        appName={appName}
      />

      {renderUpgradeDoneMessage({ diff, completedDiffs })}

      <DiffSection
        {...diffSectionProps}
        isDoneSection={true}
        title="Done"
        appName={appName}
      />

      <CompletedFilesCounter
        completed={completedDiffs.length}
        total={diff.length}
      />
    </Container>
  )
}

export default withChangeSelect({ multiple: true })(DiffViewer)
