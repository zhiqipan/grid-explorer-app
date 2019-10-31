import React, { Component } from 'react'

export default class ControlPanel extends Component {
  state = {
    agentEpsilon: 0.6,
    agentDiscount: 0.9,
    widthInput: 5,
    heightInput: 6,
  }

  render() {
    const { onCreateWorld, onSwitchAgent, agent } = this.props

    return (
      <div>
        <code>current agent: {agent.agentName}</code><br />
        <button onClick={() => onSwitchAgent('mc')}>State-based MC</button>
        <button onClick={() => onSwitchAgent('td')}>State-based TD</button>
        <button onClick={() => onSwitchAgent('q-learning-mc')}>Q-learning MC</button>
        <button onClick={() => onSwitchAgent('sarsa-mc')}>Sarsa MC</button>
        <hr />
        <div>
          Epsilon greedy:
          <input type="number" placeholder='epsilon' value={this.state.agentEpsilon} style={{ width: 50, margin: 5 }}
                 onChange={e => this.setState({ agentEpsilon: Math.max(Math.min(e.target.value, 1), 0) })} />
          <br />
          Discount factor:
          <input type="number" placeholder='discount' value={this.state.agentDiscount} style={{ width: 50, margin: 5 }}
                 onChange={e => this.setState({ agentDiscount: Math.max(Math.min(e.target.value, 1), 0) })} />
          <button onClick={() => {
            const { agentEpsilon, agentDiscount } = this.state
            agent.setEpsilon(agentEpsilon)
            agent.setDiscount(agentDiscount)
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
