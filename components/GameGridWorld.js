import React, { Component } from 'react'

export default class GameGridWorld extends Component {
  render() {
    const { rewards, blocks, winds, agentX, agentY, activeWind, grid, onPositionClick } = this.props
    const { width, height } = grid.getSize()

    const rows = []

    function getClassName({ isBlock, hasWind, isWindActive, hasAgent, isTerminal, windDirection }) {
      let name = 'cell'
      if (isBlock) name += ' cell--block'
      if (windDirection) name += ` cell--wind cell--wind--${windDirection}`
      if (isWindActive) name += ' cell--wind--active'
      if (hasAgent) name += ' cell--agent'
      if (isTerminal) name += ' cell--terminal'
      return name
    }

    function getContent({ isBlock, reward, hasWind, isWindActive, windStrength, windChance, windDirection }) {
      if (isBlock) return ''

      const rewardElem = <code style={{ color: reward >= 0 ? 'green' : 'red' }}>{reward}</code>

      if (isWindActive) return <code>{windDirection}</code>

      if (!hasWind) return rewardElem

      return (
        <div style={{ position: 'relative' }}>
          {rewardElem}
          <div style={{ position: 'absolute', top: 18, left: -22, width: 48, textAlign: 'right', fontSize: 9, color: 'dodgerblue' }}>
            <code>{windStrength}/{windChance}</code>
          </div>
        </div>
      )
    }

    for (let y = 0; y < height; y++) {
      const cells = []
      for (let x = 0; x < width; x++) {
        const reward = rewards[x] && rewards[x][y] || 0
        const isBlock = blocks[x] && blocks[x][y]
        const hasWind = !isBlock && winds[x] && winds[x][y] && winds[x][y].strength > 0 && winds[x][y].chance > 0
        const windDirection = hasWind && winds[x][y].direction
        const windStrength = hasWind && winds[x][y].strength
        const windChance = hasWind && winds[x][y].chance
        const isWindActive = hasWind && activeWind && activeWind.x === x && activeWind.y === y
        const hasAgent = agentX === x && agentY === y
        const isTerminal = grid.isTerminal(x, y)

        const className = getClassName({ isBlock, hasWind, isWindActive, hasAgent, isTerminal, windDirection })
        const content = getContent({ isBlock, reward, hasWind, isWindActive, windStrength, windChance, windDirection })
        cells.push(<div key={`${x}-${y}`} className={className} onClick={() => onPositionClick(x, y)}>{content}</div>)
      }
      rows.push(<div key={y} className='row'>{cells}</div>)
    }

    return (
      <div className='game-grid'>
        {rows}
      </div>
    )
  }
}
