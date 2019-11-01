import React, { Component } from 'react'
import * as worldConstructors from '../rl/utils/constructWorld'

export default class PresetWorldSelector extends Component {
  static defaultProps = {
    onSelect: () => null,
  }

  render() {
    return (
      <div>
        {Object.keys(worldConstructors).map(name => {
          return <button onClick={() => this.props.onSelect(name)}>{name}</button>
        })}
      </div>
    )
  }
}
