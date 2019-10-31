import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default class Header extends Component {
  render() {
    return (
      <Menu>
        <Menu.Item>Grid Explorer</Menu.Item>

        <Menu.Menu position='right'>
          <a className='item' href='https://www.github.com/zhiqipan' target='_blank'>GitHub</a>
        </Menu.Menu>
      </Menu>
    )
  }
}
