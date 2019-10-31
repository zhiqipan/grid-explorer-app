import Agent from './Agent'

const ANY = 'any'

export default class ActionBasedAgent extends Agent {
  agentType = 'action-based'

  getValue(x, y, action) {
    if (!this.values[x]) return 0
    if (!this.values[x][y]) return 0
    if (!this.values[x][y][action]) return 0
    if (this.grid.isTerminal(x, y)) {
      return this.values[x][y][ANY]
    }
    return this.values[x][y][action]
  }

  updateValue(x, y, action, value) {
    if (!this.values[x]) this.values[x] = {}
    if (!this.values[x][y]) this.values[x][y] = {}
    if (!this.counters[x]) this.counters[x] = {}
    if (!this.counters[x][y]) this.counters[x][y] = {}
    if (!this.counters[x][y][action]) this.counters[x][y][action] = 0
    this.counters[x][y][action] += 1

    // Vn = (n-1/n) * Vn-1 + (1/n) * value
    const n = this.counters[x][y][action]
    if (this.grid.isTerminal(x, y)) {
      this.values[x][y][ANY] = (n - 1) / n * this.getValue(x, y, ANY) + 1 / n * value
    } else {
      this.values[x][y][action] = (n - 1) / n * this.getValue(x, y, action) + 1 / n * value
    }
    this.notifyValuesUpdate()
  }

  pickGreedyAction() {
    const actions = this.grid.getAvailableActions()
    Object.keys(actions).forEach(action => {
      const { x, y } = this.grid.getCurrPos()
      actions[action].value = this.getValue(x, y, action)
    })
    const values = Object.values(actions).map(a => a.value)
    const greedyIndex = values.indexOf(Math.max(...values))
    return Object.keys(actions)[greedyIndex]
  }
}
