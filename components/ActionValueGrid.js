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

    const left = typeof values.left === 'number' ? Math.round(values.left * 10) / 10 : ''
    const right = typeof values.right === 'number' ? Math.round(values.right * 10) / 10 : ''
    const up = typeof values.up === 'number' ? Math.round(values.up * 10) / 10 : ''
    const down = typeof values.down === 'number' ? Math.round(values.down * 10) / 10 : ''
    const any = typeof values.any === 'number' && Math.round(values.any * 10) / 10

    const idx = Object.values(values).indexOf(Math.max(...Object.values(values)))
    const bestAction = Object.keys(values)[idx]
    const dirValueMap = { left, right, up, down }

    const arrow = dir => (
      <div
        className={`triangle ${bestAction === dir ? 'triangle--highlight' : ''} ${(any || dirValueMap[dir]) === '' ? 'triangle--grey' : ''} triangle--${dir}`}
        style={{ color: (any || dirValueMap[dir]) >= 0 ? 'green' : 'red' }}>{any || dirValueMap[dir]}</div>
    )

    return (
      <div className='action-values'>
        {arrow('left')}
        {arrow('right')}
        {arrow('up')}
        {arrow('down')}
      </div>
    )
  }
}
