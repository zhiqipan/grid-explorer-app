import React, { Component } from 'react'

export default class StateValueGrid extends Component {
  static defaultProps = {
    width: 0,
    height: 0,
    values: {},
  }

  render() {
    const { width, height, values } = this.props
    const stateValueGrid = []
    let max = 0
    Object.keys(values).forEach(x => {
      max = Math.max(...Object.values(values[x]).map(v => Math.abs(v)))
    })
    for (let y = 0; y < height; y++) {
      const cells = []
      for (let x = 0; x < width; x++) {
        const stateValue = values[x] && values[x][y] && Math.round(values[x][y] * 100) / 100
        let color
        if (typeof stateValue === 'number') {
          if (stateValue >= 0) {
            color = `rgb(0, ${100 + stateValue / max * 115}, 0)`
          } else {
            color = `rgb(${100 + -stateValue / max * 115}, 0, 0)`
          }
        }
        cells.push(<div key={`${x}-${y}`}
                        className={`cell`}
                        style={{ color }}>{typeof stateValue === 'number' ? stateValue : '?'}</div>)
      }
      stateValueGrid.push(<div key={y} className='row'>{cells}</div>)
    }

    return (
      <div className='game-grid'>
        {stateValueGrid}
      </div>
    )
  }
}
