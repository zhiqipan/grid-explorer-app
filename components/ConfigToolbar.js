import React, { Component } from 'react'

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
      <button disabled={selectedTool === name} style={{ color: selectedTool === name ? 'green' : '' }} onClick={() => {
        this.props.onSelect(name)
        this.setState({ selectedTool: name })
      }}>{name}</button>
    )
    return (
      <div>
        {tool('reward')}
        {tool('block')}
        {tool('wind')}
        {tool('empty')}
        {tool('terminal')}
        <button onClick={() => {
          this.props.onSelect(null)
          this.setState({ selectedTool: null })
        }}>Cancel selection
        </button>
      </div>
    )
  }
}
