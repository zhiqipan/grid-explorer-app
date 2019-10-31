import ActionBasedAgent from './base/ActionBasedAgent'

export default class SarsaMcAgent extends ActionBasedAgent {
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
