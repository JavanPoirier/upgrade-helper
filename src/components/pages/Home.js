import styled from '@emotion/styled'
import { Card } from 'antd'
import React, { useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import GitHubButton from 'react-github-btn'
import { homepage } from '../../../package.json'
import { SHOW_LATEST_RCS } from '../../utils'
import DiffViewer from '../common/DiffViewer'
import VersionSelector from '../common/VersionSelector'

const Page = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 30px;
`

const Container = styled(Card)`
  width: 90%;
  border-radius: 3px;
`

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`

const LogoImg = styled.img`
  width: 100px;
  margin-bottom: 15px;
`

const TitleHeader = styled.h1`
  margin: 0;
  margin-left: 15px;
`

const StarButton = styled(({ className, ...props }) => (
  <div className={className}>
    <GitHubButton {...props} />
  </div>
))`
  margin-top: 10px;
  margin-left: 15px;
  margin-right: auto;
`

const Home = () => {
  const [fromVersion, setFromVersion] = useState('')
  const [toVersion, setToVersion] = useState('')
  const [showDiff, setShowDiff] = useState(false)
  const [settings, setSettings] = useState({
    [`${SHOW_LATEST_RCS}`]: false
  })
  const [appName, setAppName] = useState('')

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      ReactGA.initialize('UA-136307971-1')
      ReactGA.pageview('/')
    }
  }, [])

  const handleShowDiff = ({ fromVersion, toVersion }) => {
    if (fromVersion === toVersion) {
      return
    }

    setFromVersion(fromVersion)
    setToVersion(toVersion)
    setShowDiff(true)
  }

  const handleSettingsChange = settingsValues => {
    const normalizedIncomingSettings = settingsValues.reduce((acc, val) => {
      acc[val] = true
      return acc
    }, {})

    setSettings(normalizedIncomingSettings)
  }

  return (
    <Page>
      <Container>
        <TitleContainer>
          <LogoImg
            alt="You.i upgrade helper logo"
            title="You.i upgrade helper logo"
            src={
              'https://www.youi.tv/wp-content/themes/youi-v3/assets/images/youi-logo-pink.svg'
            }
          />

          <a href={homepage}>
            <TitleHeader>You.i Engine One upgrade helper</TitleHeader>
          </a>

          {/* <StarButton
            href="https://github.com/react-native-community/upgrade-helper"
            data-icon="octicon-star"
            data-show-count="true"
            aria-label="Star react-native-community/upgrade-helper on GitHub"
          >
            Star
          </StarButton>

          <Settings
            handleSettingsChange={handleSettingsChange}
            appName={appName}
            setAppName={setAppName}
          /> */}
        </TitleContainer>

        <VersionSelector
          showDiff={handleShowDiff}
          showReleaseCandidates={settings[SHOW_LATEST_RCS]}
        />
      </Container>

      <DiffViewer
        showDiff={true}
        fromVersion={fromVersion}
        toVersion={toVersion}
        appName={appName}
      />
    </Page>
  )
}

export default Home
