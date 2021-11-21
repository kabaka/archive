import React from 'react'
import { Provider, teamsTheme, Flex, Segment } from '@fluentui/react-northstar'

import Header from '../components/header';

function MyApp({ Component, pageProps }) {
  return (<Provider theme={teamsTheme}>
    <Flex column>
      <Header />
      <Component {...pageProps} />
    </Flex>
  </Provider>);
}


export default MyApp
