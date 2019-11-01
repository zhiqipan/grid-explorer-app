import React, { Component } from 'react'

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
        <code>current agent: {agentName}</code><br />
        <button onClick={() => onSwitchAgent('mc')}>State-based MC</button>
        <button onClick={() => onSwitchAgent('td')}>State-based TD</button>
        <button onClick={() => onSwitchAgent('q-learning-mc')}>Q-learning MC</button>
        <button onClick={() => onSwitchAgent('sarsa-mc')}>Sarsa MC</button>
        <hr />
        <div>
          Epsilon greedy:
          <input type="number" placeholder='epsilon' value={this.state.epsilonInput} style={{ width: 50, margin: 5 }}
                 onChange={e => this.setState({ epsilonInput: Math.max(Math.min(e.target.value, 1), 0) })} />
          <br />
          Discount factor:
          <input type="number" placeholder='discount' value={this.state.discountInput} style={{ width: 50, margin: 5 }}
                 onChange={e => this.setState({ discountInput: Math.max(Math.min(e.target.value, 1), 0) })} />
          <button onClick={() => {
            const { epsilonInput, discountInput } = this.state
            onModifyAgent(epsilonInput, discountInput)
          }}>Apply to agent
          </button>
        </div>
        <hr />
        <div>
          Width:
          <input type="number" placeholder='width' step={1} value={this.state.widthInput} style={{ width: 50, margin: 5 }}
                 onChange={e => this.setState({ widthInput: Math.max(Math.min(e.target.value, 15), 3) })} />
          <br />
          height:
          <input type="number" placeholder='height' step={1} value={this.state.heightInput} style={{ width: 50, margin: 5 }}
                 onChange={e => this.setState({ heightInput: Math.max(Math.min(e.target.value, 15), 3) })} />
          <button onClick={() => {
            const { widthInput: w, heightInput: h } = this.state
            onCreateWorld(w, h)
          }}>Apply to world
          </button>
        </div>
      </div>
    )
  }
}
