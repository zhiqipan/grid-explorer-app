import StateBasedAgent from './base/StateBasedAgent'

// Temporal difference: on-policy model-based TD for state value function
export default class TdAgent extends StateBasedAgent {
  agentName = 'td'

  goNextStep(onStepComplete, onTrajectoryComplete, options = {}) {
    const { alwaysGreedy = false, training = true } = options
    if (!this.runningTrajectory) {
      this.start(0, 0)
      this.runningTrajectory = true
      if (typeof onStepComplete === 'function') onStepComplete()
      if (training) this.trainingStepTotal += 1
      return
    }

    if (!this.grid.hasEnded()) {
      const greedy = Math.random() > this.epsilon || alwaysGreedy
      const action = greedy ? this.pickGreedyAction() : this.pickRandomAction()
      const prevPos = this.grid.getCurrPos()
      const reward = this.grid.move(action)
      if (typeof onStepComplete === 'function') onStepComplete()
      if (training) {
        this.trainingStepTotal += 1
        this.setLastTry(prevPos.x, prevPos.y)
        const currPos = this.grid.getCurrPos()
        const newValue = reward + this.discount * this.getValue(currPos.x, currPos.y)
        this.updateValue(prevPos.x, prevPos.y, newValue)
      }
    }

    if (this.grid.hasEnded()) {
      if (typeof onTrajectoryComplete === 'function') onTrajectoryComplete()
      if (training) {
        this.updateValue(this.grid.currX, this.grid.currY, this.grid.getCurrReward())
      }
      this.runningTrajectory = false
    }
  }
}
