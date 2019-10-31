import StateBasedAgent from './base/StateBasedAgent'

// on-policy model-free Monte-Carlo learning for state value function
export default class McAgent extends StateBasedAgent {
  agentName = 'mc'

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
}
