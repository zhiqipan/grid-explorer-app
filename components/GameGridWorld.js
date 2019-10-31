import React, { Component } from 'react'

export default class GameGridWorld extends Component {
  render() {
    const { rewards, blocks, winds, agentX, agentY, activeWind, grid, onPositionClick } = this.props
    const { width, height } = grid.getSize()

    const rows = []
    for (let y = 0; y < height; y++) {
      const cells = []
      for (let x = 0; x < width; x++) {
        const reward = rewards[x] && rewards[x][y] || 0
        const isBlock = blocks[x] && blocks[x][y]
        const hasWind = !isBlock && winds[x] && winds[x][y] && winds[x][y].strength > 0
        const isWindActive = hasWind && activeWind && activeWind.x === x && activeWind.y === y
        const hasAgent = agentX === x && agentY === y
        const isTerminal = grid.isTerminal(x, y)
        cells.push(<div key={`${x}-${y}`}
                        className={`cell ${isBlock ? 'cell--block' : ''} ${hasWind ? 'cell--wind' : ''} ${hasAgent ? 'cell--agent' : ''} ${isWindActive ? 'cell--wind--active' : ''} ${isTerminal ? 'cell--terminal' : ''}`}
                        onClick={() => onPositionClick(x, y)}>{isWindActive ? activeWind.direction : reward}</div>)
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
