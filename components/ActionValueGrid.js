import React, { Component } from 'react'

export default class ActionValueGrid extends Component {
  static defaultProps = {
    width: 0,
    height: 0,
    values: {},
  }

  render() {
    const { width, height, values } = this.props
    const actionValueGrid = []
    let max = 0
    Object.keys(values).forEach(x => {
      max = Math.max(...Object.values(values[x]).map(v => Math.abs(v)))
    })
    for (let y = 0; y < height; y++) {
      const cells = []
      for (let x = 0; x < width; x++) {
        cells.push(
          <div key={`${x}-${y}`} className={`cell cell--larger`} style={{ margin: 5 }}>
            <ActionValue values={values[x] && values[x][y]} />
          </div>,
        )
      }
      actionValueGrid.push(<div key={y} className='row'>{cells}</div>)
    }

    return (
      <div className='game-grid'>
        {actionValueGrid}
      </div>
    )
  }
}

class ActionValue extends Component {
  static defaultProps = {
    values: {
      left: '?',
      right: '?',
      up: '?',
      down: '?',
      any: '?',
    },
  }

  render() {
    const { values } = this.props
    if (!values) return null

    const left = typeof values.left === 'number' ? Math.round(values.left * 10) / 10 : '?'
    const right = typeof values.right === 'number' ? Math.round(values.right * 10) / 10 : '?'
    const up = typeof values.up === 'number' ? Math.round(values.up * 10) / 10 : '?'
    const down = typeof values.down === 'number' ? Math.round(values.down * 10) / 10 : '?'
    const any = typeof values.any === 'number' && Math.round(values.any * 10) / 10

    return (
      <div className='action-values'>
        <div className="triangle triangle--left" style={{ color: (any || left) >= 0 ? 'green' : 'red' }}>{any || left}</div>
        <div className="triangle triangle--right" style={{ color: (any || right) >= 0 ? 'green' : 'red' }}>{any || right}</div>
        <div className="triangle triangle--up" style={{ color: (any || up) >= 0 ? 'green' : 'red' }}>{any || up}</div>
        <div className="triangle triangle--down" style={{ color: (any || down) >= 0 ? 'green' : 'red' }}>{any || down}</div>
      </div>
    )
  }
}
