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
        <Header as='h4'>Construct the world</Header>
        <div style={{ fontSize: 12, marginBottom: 5 }}>
          <p>- Click a tool to customize a cell in the world</p>
          <p>- Click again to cancel the tool selection</p>
          <p>- Each world must have one terminal state</p>
          <p>- Use 'clear' to reset a cell in the world</p>
        </div>
        {tool('reward')}
        {tool('block')}
        {tool('wind')}
        {tool('terminal')}
        {tool('clear')}
      </div>
    )
  }
}
