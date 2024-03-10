import React, { Component } from 'react'
import GameApp from '../components/GameApp'
import Layout from '../components/common/Layout'
import '../styles/game-grid.scss'

export default class Home extends Component {
  render() {
    return <Layout><GameApp /></Layout>
  }
}
