import Agent from './Agent'

const ANY = 'any'

export default class SarsaAgent extends Agent {
  getValue(x, y, action) {
    if (!this.values[x]) return 0
    if (!this.values[x][y]) return 0
    if (!this.values[x][y][action]) return 0
    if (this.grid.isTerminal(x, y)) {
      return this.values[x][y][ANY]
    }
    return this.values[x][y][action]
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

  performBackup(trajectory) {
    for (let i = trajectory.length - 1; i >= 0; i--) {
      const currStep = trajectory[i]
      const nextStep = trajectory[i + 1]
      let newValue = currStep.value
      if (nextStep) {
        newValue += this.getValue(nextStep.x, nextStep.y, nextStep.action) * this.discount
      }
      this.updateValue(currStep.x, currStep.y, currStep.action, newValue)
    }
  }

  goNextStep(onStepComplete, onTrajectoryComplete, options = {}) {
    const { alwaysGreedy = false, shouldUpdate = true } = options
    if (!this.runningTrajectory) {
      this.start(0, 0)
      const currPos = this.grid.getCurrPos()
      this.runningTrajectory = []
      this.runningTrajectory.push({ ...currPos, value: this.getValue(currPos.x, currPos.y) })
      if (typeof onStepComplete === 'function') onStepComplete()
      return
    }

    if (!this.grid.hasEnded()) {
      const greedy = Math.random() > this.epsilon || alwaysGreedy
      const action = greedy ? this.pickGreedyAction() : this.pickRandomAction()
      this.runningTrajectory[this.runningTrajectory.length - 1].action = action
      const reward = this.grid.move(action)
      this.runningTrajectory.push({ ...this.grid.getCurrPos(), value: reward })
      if (typeof onStepComplete === 'function') onStepComplete()
    }

    if (this.grid.hasEnded()) {
      if (typeof onTrajectoryComplete === 'function') onTrajectoryComplete()
      if (shouldUpdate) {
        this.performBackup(this.runningTrajectory)
      }
      this.runningTrajectory = null
    }
  }
}
