import Agent from './Agent'

// abstract class for any state based learning agent
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

  getLongTimeNoTryCount(x, y) {
    if (!this.lastTries[x]) return this.trainingStepTotal
    if (!this.lastTries[x][y]) return this.trainingStepTotal
    return this.trainingStepTotal - this.lastTries[x][y]
  }

  setLastTry(x, y) {
    if (!this.lastTries[x]) this.lastTries[x] = {}
    this.lastTries[x][y] = this.trainingStepTotal
  }
}
