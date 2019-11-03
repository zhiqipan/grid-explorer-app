import React, { Component } from 'react'
import { Icon, Menu } from 'semantic-ui-react'

export default class Header extends Component {
  render() {
    return (
      <Menu>
        <Menu.Item>Grid Explorer</Menu.Item>

        <Menu.Menu position='right'>
          <a className='item' href='https://github.com/zhiqipan/grid-explorer-app' target='_blank'><Icon name='github' />Source code</a>
        </Menu.Menu>
      </Menu>
    )
  }
}
