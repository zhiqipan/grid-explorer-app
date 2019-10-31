import StateBasedAgent from './base/StateBasedAgent'

export default class TdAgent extends StateBasedAgent {
  goNextStep(onStepComplete, onTrajectoryComplete, options = {}) {
    const { alwaysGreedy = false, shouldUpdate = true } = options
    if (!this.runningTrajectory) {
      this.start(0, 0)
      this.runningTrajectory = true
      if (typeof onStepComplete === 'function') onStepComplete()
      return
    }

    if (!this.grid.hasEnded()) {
      const greedy = Math.random() > this.epsilon || alwaysGreedy
      const action = greedy ? this.pickGreedyAction() : this.pickRandomAction()
      const prevPos = this.grid.getCurrPos()
      const reward = this.grid.move(action)
      if (typeof onStepComplete === 'function') onStepComplete()
      if (shouldUpdate) {
        const currPos = this.grid.getCurrPos()
        const newValue = reward + this.discount * this.getValue(currPos.x, currPos.y)
        this.updateValue(prevPos.x, prevPos.y, newValue)
      }
    }

    if (this.grid.hasEnded()) {
      if (typeof onTrajectoryComplete === 'function') onTrajectoryComplete()
      if (shouldUpdate) {
        this.updateValue(this.grid.currX, this.grid.currY, this.grid.getCurrReward())
      }
      this.runningTrajectory = false
    }
  }
}
