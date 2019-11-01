import React, { Component } from 'react'
import * as worldConstructors from '../rl/utils/constructWorld'
import { Button, Header } from 'semantic-ui-react'

export default class PresetWorldSelector extends Component {
  static defaultProps = {
    onSelect: () => null,
  }

  render() {
    return (
      <div>
        <Header as='h4'>Preset environments</Header>
        {Object.keys(worldConstructors).map(name => {
          return <Button basic size='tiny' style={{ margin: 5 }} onClick={() => this.props.onSelect(name)} content={name} />
        })}
      </div>
    )
  }
}
