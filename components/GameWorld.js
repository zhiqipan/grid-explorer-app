import React, { Component } from 'react'
import '../styles/game-grid.scss'
import GridWorld from '../rl/GridWorld'
import McAgent from '../rl/agents/McAgent'
import TdAgent from '../rl/agents/TdAgent'
import SarsaMcAgent from '../rl/agents/SarsaMcAgent'
import QLearningMcAgent from '../rl/agents/QLearningMcAgent'
import AgentTrainer from '../rl/AgentTrainer'
import StateValueGrid from '../components/StateValueGrid'
import ActionValueGrid from '../components/ActionValueGrid'

export default class GameWorld extends Component {
  intervals = []

  state = {
    gridWidth: 5,
    gridHeight: 6,
    rewards: {},
    blocks: {},
    winds: {},
    startX: null,
    startY: null,
    endX: null,
    endY: null,
    agentX: null,
    agentY: null,
    activeWind: null,
    //
    learntValues: {},
    //
    trajectoryRunning: false,
    stepInterval: 10,
    agentType: null,
    agentName: null,
    agentEpsilon: 0.6,
    agentDiscount: 0.9,
    //
    widthInput: 5,
    heightInput: 6,
    //
    selectedTool: null,
  }

  componentDidMount() {
    this.gridWorldObserver = {
      notifyGameInit: (x, y) => {
        this.setState({ startX: x, startY: y, agentX: x, agentY: y })
      },
      notifyGridConfigChange: ({ rewards, blocks, winds, terminal }) => {
        this.setState({ rewards, blocks, winds, endX: terminal.x, endY: terminal.y })
      },
      notifyAgentMove: (agentX, agentY, reward) => {
        this.setState({ agentX, agentY, lastReward: reward })
      },
      notifyWindTriggered: (windX, windY, { strength, direction, chance }) => {
        this.setState({ activeWind: { x: windX, y: windY, strength, direction } }, () => {
          setTimeout(() => {
            this.setState({ activeWind: null })
          }, 300)
        })
      },
    }
    this.agentObserver = {
      notifyValuesUpdate: (learntValues) => {
        this.setState({ learntValues })
      },
    }

    this.createWorld(5, 6)
    this.switchAgent('mc')

    const gridRewards = [
      [+0, +0, -1, +0, -1],
      [+0, +0, +0, +0, +0],
      [+0, -1, +0, -1, +0],
      [+0, +0, +0, +0, -1],
      [+0, -1, +3, +0, -1],
      [+0, +0, +0, +0, -1],
    ]

    this.grid.setRewards(gridRewards)
    this.grid.setTerminal(2, 4)
    this.grid.addBlock(0, 1)
    this.grid.addWind(1, 1, { strength: 2, direction: 'right', chance: .3 })
  }

  createWorld(width, height) {
    if (this.grid) this.grid.removeAllObservers()
    this.grid = new GridWorld(width, height)
    this.grid.addObserver(this.gridWorldObserver)
    if (this.agent) this.agent.switchGrid(this.grid)
  }

  switchAgent(name) {
    const agents = {
      'mc': McAgent,
      'td': TdAgent,
      'q-learning-mc': QLearningMcAgent,
      'sarsa-mc': SarsaMcAgent,
    }
    if (agents[name]) {
      if (this.agent) this.agent.removeAllObservers()
      const { agentEpsilon, agentDiscount } = this.state
      this.agent = new agents[name](this.grid, { epsilon: agentEpsilon, discount: agentDiscount })
      this.agent.addObserver(this.agentObserver)
      this.setState({ agentType: this.agent.agentType, agentName: name })
    }
  }

  startTraining(times = 1) {
    this.grid.removeObserver(this.gridWorldObserver)
    this.agent.removeObserver(this.agentObserver)
    AgentTrainer.train(this.agent, times)
    this.grid.addObserver(this.gridWorldObserver)
    this.agent.addObserver(this.agentObserver)
  }

  renderValueGrid() {
    if (!this.agent) return null

    const { gridWidth, gridHeight, learntValues, agentType } = this.state

    return agentType === 'state-based' ?
      <StateValueGrid width={gridWidth} height={gridHeight} values={learntValues} />
      : <ActionValueGrid width={gridWidth} height={gridHeight} values={learntValues} />
  }

  renderToolbar() {
    const tool = name => (
      <button disabled={this.state.selectedTool === name} style={{ color: this.state.selectedTool === name ? 'green' : '' }} onClick={() => {
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
        <button onClick={() => this.setState({ selectedTool: null })}>Cancel selection</button>
      </div>
    )
  }

  render() {
    const { gridWidth, gridHeight, rewards, blocks, winds, agentX, agentY, activeWind, learntValues } = this.state
    const gameGrid = []

    if (!this.grid || !this.agent) return null

    for (let y = 0; y < gridHeight; y++) {
      const cells = []
      for (let x = 0; x < gridWidth; x++) {
        const reward = rewards[x] && rewards[x][y] || 0
        const isBlock = blocks[x] && blocks[x][y]
        const hasWind = !isBlock && winds[x] && winds[x][y] && winds[x][y].strength > 0
        const isWindActive = hasWind && activeWind && activeWind.x === x && activeWind.y === y
        const hasAgent = agentX === x && agentY === y
        const isTerminal = this.grid.isTerminal(x, y)
        cells.push(<div key={`${x}-${y}`}
                        className={`cell ${isBlock ? 'cell--block' : ''} ${hasWind ? 'cell--wind' : ''} ${hasAgent ? 'cell--agent' : ''} ${isWindActive ? 'cell--wind--active' : ''} ${isTerminal ? 'cell--terminal' : ''}`}
                        style={{ margin: 5 }}
                        onClick={() => {
                          const { selectedTool: tool } = this.state
                          switch (tool) {
                          case 'reward':
                            const r = parseInt(prompt('reward amount (int)'))
                            this.grid.setReward(x, y, r)
                            return
                          case 'block':
                            this.grid.addBlock(x, y)
                            return
                          case 'wind':
                            const direction = prompt('direction (left, right, up, down)')
                            const strength = parseInt(prompt('strength (eg: 2)'))
                            const chance = parseFloat(prompt('chance (eg: 0.3)'))
                            this.grid.addWind(x, y, { direction, strength, chance })
                            return
                          case 'empty':
                            this.grid.removeBlock(x, y)
                            this.grid.removeWind(x, y)
                            this.grid.setReward(x, y, 0)
                            return
                          case 'terminal':
                            this.grid.setTerminal(x, y)
                            return
                          default:
                            return
                          }
                        }}>{isWindActive ? activeWind.direction : reward}</div>)
      }
      gameGrid.push(<div key={y} className='row'>{cells}</div>)
    }

    return (
      <div>
        <div className='game-grid'>
          {gameGrid}
        </div>
        <hr />
        <button onClick={() => this.startTraining(10)}>Train 10 times</button>
        <button onClick={() => this.startTraining(100)}>Train 100 times</button>
        <button onClick={() => this.startTraining(1000)}>Train 1000 times</button>
        <hr />
        <input placeholder='speed' type='number' disabled={this.state.trajectoryRunning} value={this.state.stepInterval}
               onChange={e => this.setState({ stepInterval: e.target.value })} />
        <button disabled={this.state.trajectoryRunning} onClick={() => {
          this.agent.goNextStep()
        }}>Step (non-greedy)
        </button>
        <button disabled={this.state.trajectoryRunning} onClick={() => {
          this.agent.goNextStep(null, null, { alwaysGreedy: true, shouldUpdate: false })
        }}>Step (greedy)
        </button>
        <button disabled={this.state.trajectoryRunning} onClick={() => {
          this.setState({ trajectoryRunning: true })
          const interval = setInterval(() => {
            this.agent.goNextStep(null, () => {
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
            this.agent.goNextStep(null, () => {
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
          this.agent.start(0, 0)
        }}>Reset agent
        </button>
        <button onClick={() => {
          this.agent.resetLearningProgress()
        }}>Reset learning progress
        </button>
        <hr />
        <code>current agent: {this.state.agentName}</code><br />
        <button onClick={() => this.switchAgent('mc')}>State-based MC</button>
        <button onClick={() => this.switchAgent('td')}>State-based TD</button>
        <button onClick={() => this.switchAgent('q-learning-mc')}>Q-learning MC</button>
        <button onClick={() => this.switchAgent('sarsa-mc')}>Sarsa MC</button>
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
            this.agent.setEpsilon(this.state.agentEpsilon)
            this.agent.setDiscount(this.state.agentDiscount)
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
            this.createWorld(this.state.widthInput, this.state.heightInput)
            this.setState({ gridWidth: this.state.widthInput, gridHeight: this.state.heightInput })
          }}>Apply to world
          </button>
        </div>
        <hr />
        {this.renderToolbar()}
        <hr />
        {this.renderValueGrid()}
      </div>
    )
  }
}
