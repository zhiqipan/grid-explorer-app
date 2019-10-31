import GridWorld from './GridWorld'

// on-policy model-free Monte-Carlo learning for state value function
export default class Agent {
  constructor(grid, { epsilon = 0.6, discount = 1 }) {
    if (!grid instanceof GridWorld) throw new Error('Grid agent must work on a grid instance')

    this.grid = grid
    this.values = {}
    this.counters = {}
    this.epsilon = epsilon
    this.discount = discount
    this.observers = []
    this.runningTrajectory = null
  }

  addObserver(ob) {
    if (ob) {
      this.observers.push(ob)
      this.notifyValuesUpdate()
    }
  }

  removeObserver(ob) {
    this.observers = this.observers.filter(o => o !== ob)
  }

  notifyValuesUpdate() {
    this.observers.forEach(ob => {
      if (typeof ob.notifyValuesUpdate === 'function') {
        ob.notifyValuesUpdate(this.values)
      }
    })
  }

  start(x, y) {
    this.grid.init(x, y)
    this.runningTrajectory = null
  }

  setDiscount(discount) {
    this.discount = discount
  }

  setEpsilon(epsilon) {
    this.epsilon = epsilon
  }

  resetLearningProgress() {
    this.values = {}
    this.counters = {}
    this.notifyValuesUpdate()
  }

  getValue(x, y) {
    if (!this.values[x]) return 0
    if (!this.values[x][y]) return 0
    return this.values[x][y]
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

  pickRandomAction() {
    const actions = Object.keys(this.grid.getAvailableActions())
    return actions[Math.floor(Math.random() * actions.length)]
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

  performBackup(trajectory) {
    for (let i = trajectory.length - 1; i >= 0; i--) {
      const currStep = trajectory[i]
      const nextStep = trajectory[i + 1]
      let newValue = currStep.value
      if (nextStep) {
        newValue += this.getValue(nextStep.x, nextStep.y) * this.discount
      }
      this.updateValue(currStep.x, currStep.y, newValue)
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

  startTrajectory(options = {}) {
    this.start(0, 0)
    while (!this.grid.hasEnded()) {
      this.goNextStep(null, null, options)
    }
  }
}
