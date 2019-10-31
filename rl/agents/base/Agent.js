import GridWorld from '../../GridWorld'

// on-policy model-free Monte-Carlo learning for state value function
export default class Agent {
  constructor(grid, { epsilon = 0.6, discount = 1 }) {
    if (!grid instanceof GridWorld) throw new Error('Grid agent must work on a grid instance')

    const consName = this.constructor.name
    if (['Agent', 'StateBasedAgent', 'ActionBasedAgent'].includes(consName)) throw new Error('Abstract class not instantiable')

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

  removeAllObservers() {
    this.observers.length = 0
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

  switchGrid(grid) {
    if (!grid instanceof GridWorld) throw new Error('Grid agent must work on a grid instance')

    this.grid = grid
    this.runningTrajectory = null
    this.resetLearningProgress()
  }

  startTrajectory(options = {}) {
    this.start(0, 0)
    while (!this.grid.hasEnded()) {
      this.goNextStep(null, null, options)
    }
  }

  getValue(x, y) {
    throw new Error('Not implemented yet')
  }

  updateValue(x, y, value) {
    throw new Error('Not implemented yet')
  }

  pickGreedyAction() {
    throw new Error('Not implemented yet')
  }

  pickRandomAction() {
    const actions = Object.keys(this.grid.getAvailableActions())
    return actions[Math.floor(Math.random() * actions.length)]
  }

  goNextStep(onStepComplete, onTrajectoryComplete, options = {}) {
    throw new Error('Not implemented yet')
  }
}
