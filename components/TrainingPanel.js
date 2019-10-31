import React, { Component } from 'react'
import AgentTrainer from '../rl/AgentTrainer'

export default class TrainingPanel extends Component {
  intervals = []

  static defaultProps = {
    grid: null,
    agent: null,
  }

  state = {
    trajectoryRunning: false,
    stepInterval: 10,
  }

  startTraining(times = 1) {
    const { grid, agent } = this.props
    grid.pauseObservers()
    agent.pauseObservers()
    AgentTrainer.train(agent, times)
    grid.resumeObservers()
    agent.resumeObservers()
  }

  render() {
    const { grid, agent } = this.props
    if (!grid || !agent) {
      return null
    }

    return (
      <div>
        <button onClick={() => this.startTraining(10)}>Train 10 times</button>
        <button onClick={() => this.startTraining(100)}>Train 100 times</button>
        <button onClick={() => this.startTraining(1000)}>Train 1000 times</button>
        <hr />
        <input placeholder='speed' type='number' disabled={this.state.trajectoryRunning} value={this.state.stepInterval}
               onChange={e => this.setState({ stepInterval: e.target.value })} />
        <button disabled={this.state.trajectoryRunning} onClick={() => {
          agent.goNextStep()
        }}>Step (non-greedy)
        </button>
        <button disabled={this.state.trajectoryRunning} onClick={() => {
          agent.goNextStep(null, null, { alwaysGreedy: true, shouldUpdate: false })
        }}>Step (greedy)
        </button>
        <button disabled={this.state.trajectoryRunning} onClick={() => {
          this.setState({ trajectoryRunning: true })
          const interval = setInterval(() => {
            agent.goNextStep(null, () => {
              this.setState({ trajectoryRunning: false })
              clearInterval(interval)
            })
          }, this.state.stepInterval)
          this.intervals.push(interval)
        }}>Explore and Learn (auto)
        </button>
        <button disabled={this.state.trajectoryRunning} onClick={() => {
          this.setState({ trajectoryRunning: true })
          const interval = setInterval(() => {
            agent.goNextStep(null, () => {
              this.setState({ trajectoryRunning: false })
              clearInterval(interval)
            }, { alwaysGreedy: true, shouldUpdate: false })
          }, this.state.stepInterval)
          this.intervals.push(interval)
        }}>Greedy (auto)
        </button>
        <button onClick={() => {
          this.setState({ trajectoryRunning: false })
          this.intervals.forEach(it => clearInterval(it))
          agent.start(0, 0)
        }}>Reset agent
        </button>
        <button onClick={() => {
          agent.resetLearningProgress()
        }}>Reset learning progress
        </button>
      </div>
    )
  }
}
