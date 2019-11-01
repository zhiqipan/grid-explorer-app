import React, { Component } from 'react'
import { Button, Header } from 'semantic-ui-react'

export default class ConfigToolbar extends Component {
  static defaultProps = {
    onSelect: () => null,
  }

  state = {
    selectedTool: null,
  }

  render() {
    const { selectedTool } = this.state
    const tool = name => (
      <Button
        size='tiny'
        style={{ width: 100, margin: 5 }}
        basic={selectedTool !== name}
        primary={selectedTool === name}
        onClick={() => {
          if (selectedTool === name) {
            this.props.onSelect(null)
            this.setState({ selectedTool: null })
          } else {
            this.props.onSelect(name)
            this.setState({ selectedTool: name })
          }
        }}
        content={name}
      />
    )
    return (
      <div>
        <Header as='h4'>Construction</Header>
        {tool('reward')}
        {tool('block')}
        {tool('wind')}
        {tool('empty')}
        {tool('terminal')}
      </div>
    )
  }
}
