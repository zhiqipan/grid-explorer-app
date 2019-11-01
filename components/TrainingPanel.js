import React, { Component } from 'react'
import { Button, Divider, Header, Form, Input, Label } from 'semantic-ui-react'
import AgentTrainer from '../rl/AgentTrainer'

export default class TrainingPanel extends Component {
  intervals = []

  static defaultProps = {
    grid: null,
    agent: null,
  }

  state = {
    trajectoryRunning: false,
    stepInterval: 100,
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
        <Header as='h4' style={{ marginTop: 0 }}>Train the agent</Header>
        <Button basic size='tiny' style={{ width: 100 }} onClick={() => this.startTraining(10)} content={'10 times'} />
        <Button basic size='tiny' style={{ width: 100 }} onClick={() => this.startTraining(100)} content={'100 times'} />
        <Button basic size='tiny' style={{ width: 100 }} onClick={() => this.startTraining(1000)} content={'1000 times'} />
        <Divider />
        <Header as='h4' style={{ marginTop: 0 }}>Step by step</Header>
        <Button
          basic
          size='tiny'
          disabled={this.state.trajectoryRunning}
          onClick={() => agent.goNextStep()}
          content='Non-greedy step'
        />
        <Button
          basic
          size='tiny'
          disabled={this.state.trajectoryRunning}
          onClick={() => agent.goNextStep(null, null, { alwaysGreedy: true, shouldUpdate: false })}
          content='Greedy step'
        />
        <Divider />
        <Header as='h4' style={{ marginTop: 0 }}>Run an episode</Header>
        <Form.Field style={{ marginBottom: 10 }}>
          <Input
            placeholder='speed'
            type='number'
            step={100}
            min={0}
            size='mini'
            disabled={this.state.trajectoryRunning}
            value={this.state.stepInterval}
            onChange={e => this.setState({ stepInterval: e.target.value })}
          />
          <Label pointing='left'>step interval</Label>
        </Form.Field>
        <Button
          basic
          size='tiny'
          content='Explore and learn'
          disabled={this.state.trajectoryRunning}
          onClick={() => {
            this.setState({ trajectoryRunning: true })
            const interval = setInterval(() => {
              agent.goNextStep(null, () => {
                this.setState({ trajectoryRunning: false })
                clearInterval(interval)
              })
            }, this.state.stepInterval)
            this.intervals.push(interval)
          }}
        />
        <Button
          basic
          size='tiny'
          content='Greedy play'
          disabled={this.state.trajectoryRunning}
          onClick={() => {
            this.setState({ trajectoryRunning: true })
            const interval = setInterval(() => {
              agent.goNextStep(null, () => {
                this.setState({ trajectoryRunning: false })
                clearInterval(interval)
              }, { alwaysGreedy: true, shouldUpdate: false })
            }, this.state.stepInterval)
            this.intervals.push(interval)
          }}
        />
        <Divider />
        <Button
          basic
          color='red'
          size='tiny'
          content='Reset agent'
          style={{ marginTop: 10 }}
          onClick={() => {
            this.setState({ trajectoryRunning: false })
            this.intervals.forEach(it => clearInterval(it))
            agent.start(0, 0)
          }}
        />
        <Button
          basic
          color='red'
          size='tiny'
          content='Reset learning progress'
          onClick={() => {
            agent.resetLearningProgress()
          }}
        />
      </div>
    )
  }
}
