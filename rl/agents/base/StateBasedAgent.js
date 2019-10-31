import Agent from './Agent'

// on-policy model-free Monte-Carlo learning for state value function
export default class StateBasedAgent extends Agent {
  agentType = 'state-based'

  getValue(x, y) {
    if (!this.values[x]) return 0
    if (!this.values[x][y]) return 0
    return this.values[x][y]
  }

  updateValue(x, y, value) {
    if (!this.values[x]) this.values[x] = {}
    if (!this.counters[x]) this.counters[x] = {}
    if (!this.counters[x][y]) this.counters[x][y] = 0
    this.counters[x][y] += 1

    // Vn = (n-1/n) * Vn-1 + (1/n) * value
    const n = this.counters[x][y]
    this.values[x][y] = (n - 1) / n * this.getValue(x, y) + 1 / n * value
    this.notifyValuesUpdate()
  }

  pickGreedyAction() {
    const actions = this.grid.getAvailableActions()
    Object.keys(actions).forEach(key => {
      const { x, y } = actions[key]
      actions[key].value = this.getValue(x, y)
    })
    const values = Object.values(actions).map(a => a.value)
    const greedyIndex = values.indexOf(Math.max(...values))
    return Object.keys(actions)[greedyIndex]
  }
}
