import React, { Component } from 'react';
import Head from 'next/head';
import { Container } from 'semantic-ui-react';
import Header from './Header';

export default class Layout extends Component {
  render() {
    return (
      <Container style={{ padding: '10px 0', marginBottom: 30 }}>
        <Head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
        </Head>
        <Header />
        <div>
          {this.props.children}
        </div>
      </Container>
    );
  }
}
