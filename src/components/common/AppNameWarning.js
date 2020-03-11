import styled from '@emotion/styled'
import { Alert } from 'antd'
import React from 'react'
import Markdown from './Markdown'

const Container = styled.div({
  width: '100%',
  marginTop: '16px'
})

export const AppNameWarning = () => (
  <Container>
    <Alert
      message={
        <Markdown>
          Keep in mind that `YiRNTemplateApp` and `YiReactApp` are placeholders.
          When upgrading, you should replace them with your actual project's
          name. You can also provide your app name by clicking the settings icon
          on the top right.
        </Markdown>
      }
      type="info"
      closable
    />
  </Container>
)
