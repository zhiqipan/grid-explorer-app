import GridWorld from '../../GridWorld'

// abstract class for any agent
export default class Agent {
  constructor(grid, { epsilon = 0.6, discount = 1, longTimeNoTryRewardBonusFactor = 0 }) {
    if (!grid instanceof GridWorld) throw new Error('Grid agent must work on a grid instance')

    const consName = this.constructor.name
    if (['Agent', 'StateBasedAgent', 'ActionBasedAgent'].includes(consName)) throw new Error('Abstract class not instantiable')

    this.grid = grid
    this.values = {}
    this.counters = {}
    this.lastTries = {}
    this.trainingStepTotal = 0
    this.longTimeNoTryRewardBonusFactor = longTimeNoTryRewardBonusFactor
    this.epsilon = epsilon
    this.discount = discount
    this.observers = []
    this.observersPaused = false
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

  pauseObservers() {
    this.observersPaused = true
  }

  resumeObservers() {
    this.observersPaused = false
    this.notifyValuesUpdate()
  }

  notifyValuesUpdate() {
    if (this.observersPaused) return
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

  setLongTimeNoTryRewardBonusFactor(factor) {
    this.longTimeNoTryRewardBonusFactor = factor
  }

  resetLearningProgress() {
    this.values = {}
    this.counters = {}
    this.lastTries = {}
    this.trainingStepTotal = 0
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

  train(times = 1) {
    for (let i = 0; i < times; i++) {
      this.trainingStepTotal += 1
      this.startTrajectory()
    }
  }

  test() {
    this.startTrajectory({ alwaysGreedy: true, training: false })
  }
}
