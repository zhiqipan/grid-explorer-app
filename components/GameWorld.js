import React, { Component } from 'react'
import '../styles/game-grid.scss'
import GridWorld from '../rl/GridWorld'
import Agent from '../rl/Agent'
import TdAgent from '../rl/TdAgent'
import SarsaAgent from '../rl/SarsaAgent'
import QLearningAgent from '../rl/QLearningAgent'
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
  }

  componentDidMount() {
    const gridRewards = [
      [+0, +0, -1, +0, -1],
      [+0, +0, +0, +0, +0],
      [+0, -1, +0, +0, +0],
      [+0, +0, +0, +0, -1],
      [+0, -1, +3, +0, -1],
      [+0, +0, +0, +0, -1],
    ]

    this.grid = new GridWorld(5, 6)
    this.agent = new QLearningAgent(this.grid, { epsilon: 0.6, discount: 0.9 })
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
    this.grid.addObserver(this.gridWorldObserver)
    this.agentObserver = {
      notifyValuesUpdate: (learntValues) => {
        this.setState({ learntValues })
      },
    }
    this.agent.addObserver(this.agentObserver)

    this.grid.setRewards(gridRewards)
    this.grid.setTerminal(2, 4)
    this.grid.addBlock(0, 1)
    this.grid.addWind(1, 1, { strength: 2, direction: 'right', chance: .3 })
  }

  render() {
    const { gridWidth, gridHeight, rewards, blocks, winds, agentX, agentY, activeWind, learntValues } = this.state
    const gameGrid = []
    for (let y = 0; y < gridHeight; y++) {
      const cells = []
      for (let x = 0; x < gridWidth; x++) {
        const reward = rewards[x] && rewards[x][y] || 0
        const isBlock = blocks[x] && blocks[x][y]
        const hasWind = !isBlock && winds[x] && winds[x][y] && winds[x][y].strength > 0
        const isWindActive = hasWind && activeWind && activeWind.x === x && activeWind.y === y
        const hasAgent = agentX === x && agentY === y
        cells.push(<div key={`${x}-${y}`}
                        className={`cell ${isBlock ? 'cell--block' : ''} ${hasWind ? 'cell--wind' : ''} ${hasAgent ? 'cell--agent' : ''} ${isWindActive ? 'cell--wind--active' : ''}`}
                        style={{ margin: 5 }}>{isWindActive ? activeWind.direction : reward}</div>)
      }
      gameGrid.push(<div key={y} className='row'>{cells}</div>)
    }

    return (
      <div>
        <div className='game-grid'>
          {gameGrid}
        </div>
        <hr />
        <button onClick={() => {
          this.grid.removeObserver(this.gridWorldObserver)
          this.agent.removeObserver(this.agentObserver)
          AgentTrainer.train(this.agent, 10)
          this.grid.addObserver(this.gridWorldObserver)
          this.agent.addObserver(this.agentObserver)
        }}>Train 10 times
        </button>
        <button onClick={() => {
          this.grid.removeObserver(this.gridWorldObserver)
          this.agent.removeObserver(this.agentObserver)
          AgentTrainer.train(this.agent, 100)
          this.grid.addObserver(this.gridWorldObserver)
          this.agent.addObserver(this.agentObserver)
        }}>Train 100 times
        </button>
        <button onClick={() => {
          this.grid.removeObserver(this.gridWorldObserver)
          this.agent.removeObserver(this.agentObserver)
          AgentTrainer.train(this.agent, 1000)
          this.grid.addObserver(this.gridWorldObserver)
          this.agent.addObserver(this.agentObserver)
        }}>Train 1000 times
        </button>
        <hr />
        <input placeholder='speed' type='number' disabled={this.state.trajectoryRunning} value={this.state.stepInterval}
               onChange={e => this.setState({ stepInterval: e.target.value })} />
        <button disabled={this.state.trajectoryRunning} onClick={() => {
          this.agent.goNextStep()
        }}>Step
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
        <ActionValueGrid width={gridWidth} height={gridHeight} values={learntValues} />
        {/*<StateValueGrid width={gridWidth} height={gridHeight} values={learntValues} />*/}
      </div>
    )
  }
}
