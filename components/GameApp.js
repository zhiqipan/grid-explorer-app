import React, { Component } from 'react'
import GridWorld from '../rl/GridWorld'
import McAgent from '../rl/agents/McAgent'
import TdAgent from '../rl/agents/TdAgent'
import SarsaMcAgent from '../rl/agents/SarsaMcAgent'
import QLearningMcAgent from '../rl/agents/QLearningMcAgent'
import StateValueGrid from '../components/StateValueGrid'
import ActionValueGrid from '../components/ActionValueGrid'
import { Card, Divider, Grid, Header } from 'semantic-ui-react'
import TrainingPanel from './TrainingPanel'
import GameGridWorld from './GameGridWorld'
import ControlPanel from './ControlPanel'
import ConfigToolbar from './ConfigToolbar'
import * as worldConstructors from '../rl/utils/constructWorld'
import PresetWorldSelector from './PresetWorldSelector'

export default class GameApp extends Component {
  state = {
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
    learntValues: {},
    selectedTool: null,
    agentEpsilon: 0.6,
    agentDiscount: 0.9,
    grid: null,
    agent: null,
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

    const grid = worldConstructors['basic']((w, h) => this.createWorld(w, h))
    this.switchAgent('mc', grid)
  }

  createWorld(width, height) {
    if (this.state.grid) this.state.grid.removeAllObservers()
    const grid = new GridWorld(width, height)
    grid.addObserver(this.gridWorldObserver)
    this.setState({ grid })
    if (this.state.agent) this.state.agent.switchGrid(grid)
    return grid
  }

  switchAgent(name, grid = this.state.grid) {
    const agents = {
      'mc': McAgent,
      'td': TdAgent,
      'q-learning-mc': QLearningMcAgent,
      'sarsa-mc': SarsaMcAgent,
    }
    if (agents[name]) {
      if (this.state.agent) this.state.agent.removeAllObservers()
      const { agentEpsilon, agentDiscount } = this.state
      const agent = new agents[name](grid, { epsilon: agentEpsilon, discount: agentDiscount })
      agent.addObserver(this.agentObserver)
      this.setState({ agent })
      return agent
    }
  }

  renderValueGrid() {
    if (!this.state.agent) return null

    const { learntValues, grid, agent } = this.state

    const { width, height } = grid.getSize()

    return agent.agentType === 'state-based' ?
      <StateValueGrid width={width} height={height} values={learntValues} />
      : <ActionValueGrid width={width} height={height} values={learntValues} />
  }

  modifyGridWorld(x, y) {
    const { selectedTool: tool, grid } = this.state
    switch (tool) {
      case 'reward':
        const r = parseInt(prompt('reward amount (int)'))
        grid.setReward(x, y, r)
        return
      case 'block':
        grid.addBlock(x, y)
        return
      case 'wind':
        const direction = prompt('direction (left, right, up, down)')
        const strength = parseInt(prompt('strength (eg: 2)'))
        const chance = parseFloat(prompt('chance (eg: 0.3)'))
        grid.addWind(x, y, { direction, strength, chance })
        return
      case 'clear':
        grid.removeBlock(x, y)
        grid.removeWind(x, y)
        grid.setReward(x, y, 0)
        return
      case 'terminal':
        grid.setTerminal(x, y)
        return
      default:
        return
    }
  }

  render() {
    const { rewards, blocks, winds, agentX, agentY, activeWind, grid, agent } = this.state

    if (!grid || !agent) return null

    return (
      <div>
        <Grid />
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column width={8}>
              <Header as="h3">Grid world</Header>
              <GameGridWorld
                rewards={rewards}
                blocks={blocks}
                winds={winds}
                agentX={agentX}
                agentY={agentY}
                activeWind={activeWind}
                grid={grid}
                onPositionClick={(x, y) => this.modifyGridWorld(x, y)}
              />
            </Grid.Column>
            <Grid.Column width={8} style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
              <Header as="h3">Learnt values</Header>
              {this.renderValueGrid()}
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={10}>
              <Card.Group itemsPerRow={2}>

                <Card>
                  <Card.Content>
                    <TrainingPanel grid={grid} agent={agent} />
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Content>
                    <ControlPanel
                      agentName={agent && agent.agentName}
                      defaultWidth={grid && grid.getSize().width}
                      defaultHeight={grid && grid.getSize().height}
                      defaultEpsilon={agent && agent.epsilon}
                      defaultDiscount={agent && agent.discount}
                      defaultLongTimeNoTryRewardBonusFactor={agent && agent.longTimeNoTryRewardBonusFactor}
                      onCreateWorld={(w, h) => this.createWorld(w, h)}
                      onSwitchAgent={name => this.switchAgent(name)}
                      onModifyAgent={(ep, discount, bonusFactor) => {
                        agent.setEpsilon(ep)
                        agent.setDiscount(discount)
                        agent.setLongTimeNoTryRewardBonusFactor(bonusFactor)
                      }}
                    />
                  </Card.Content>
                </Card>

              </Card.Group>
            </Grid.Column>

            <Grid.Column width={6}>
              <Card.Group itemsPerRow={1}>
                <Card>
                  <Card.Content>
                    <ConfigToolbar onSelect={selectedTool => this.setState({ selectedTool })} />
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Content>
                    <PresetWorldSelector onSelect={name => {
                      if (worldConstructors[name]) {
                        const grid = worldConstructors[name]((w, h) => this.createWorld(w, h))
                        this.switchAgent('mc', grid)
                      }
                    }} />
                  </Card.Content>
                </Card>
              </Card.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
