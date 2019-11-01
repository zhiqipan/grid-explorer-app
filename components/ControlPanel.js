import React, { Component } from 'react'
import { Button, Input, Form, Label, Divider, Header } from 'semantic-ui-react'

export default class ControlPanel extends Component {
  static defaultProps = {
    agentName: null,
    defaultWidth: null,
    defaultHeight: null,
    defaultEpsilon: null,
    defaultDiscount: null,
  }

  state = {
    epsilonInput: this.props.defaultEpsilon,
    discountInput: this.props.defaultDiscount,
    widthInput: this.props.defaultWidth,
    heightInput: this.props.defaultHeight,
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props !== prevProps) {
      this.setState({
        epsilonInput: this.props.defaultEpsilon,
        discountInput: this.props.defaultDiscount,
        widthInput: this.props.defaultWidth,
        heightInput: this.props.defaultHeight,
      })
    }
  }

  render() {
    const { onCreateWorld, onSwitchAgent, onModifyAgent, agentName } = this.props

    return (
      <div>
        <Header as='h4'>Select agent</Header>
        <div>
          <Button basic size='tiny' style={{ margin: 5 }} onClick={() => onSwitchAgent('mc')} content={'State-based MC'} />
          <Button basic size='tiny' style={{ margin: 5 }} onClick={() => onSwitchAgent('td')} content={'State-based TD'} />
          <Button basic size='tiny' style={{ margin: 5 }} onClick={() => onSwitchAgent('q-learning-mc')} content={'Q-learning MC'} />
          <Button basic size='tiny' style={{ margin: 5 }} onClick={() => onSwitchAgent('sarsa-mc')} content={'Sarsa MC'} />
        </div>
        <div style={{ marginLeft: 5, color: 'gray' }}>
          <code>Current agent: {agentName}</code>
        </div>
        <Divider />

        <Header as='h4' style={{ marginTop: 0 }}>Agent params</Header>
        <div style={{ display: 'flex' }}>
          <Input
            label='Epsilon' size='mini' type="number" placeholder='epsilon' min={0} max={1} step={0.1}
            value={this.state.epsilonInput} style={{ width: 120, margin: 5 }}
            onChange={e => this.setState({ epsilonInput: Math.max(Math.min(e.target.value, 1), 0) })} />
          <Input
            label='Discount' size='mini' type="number" placeholder='discount' min={0} max={1} step={0.1}
            value={this.state.discountInput} style={{ width: 120, margin: 5 }}
            onChange={e => this.setState({ discountInput: Math.max(Math.min(e.target.value, 1), 0) })} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              basic
              positive
              size='tiny'
              content='Apply'
              style={{ marginLeft: 5 }}
              onClick={() => {
                const { epsilonInput, discountInput } = this.state
                onModifyAgent(epsilonInput, discountInput)
              }}
            />
          </div>
        </div>
        <Divider />

        <Header as='h4' style={{ marginTop: 0 }}>New world</Header>
        <div style={{ display: 'flex' }}>
          <Input
            label='Width' size='mini' type="number" placeholder='width' step={1} value={this.state.widthInput}
            fluid style={{ width: 120, margin: 5 }}
            onChange={e => this.setState({ widthInput: Math.max(Math.min(e.target.value, 10), 3) })} />
          <Input
            label='Height' size='mini' type="number" placeholder='height' step={1} value={this.state.heightInput}
            fluid style={{ width: 120, margin: 5 }}
            onChange={e => this.setState({ heightInput: Math.max(Math.min(e.target.value, 10), 3) })} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              basic
              positive
              size='tiny'
              content='Create'
              style={{ marginLeft: 5 }}
              onClick={() => {
                const { widthInput: w, heightInput: h } = this.state
                onCreateWorld(w, h)
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}
