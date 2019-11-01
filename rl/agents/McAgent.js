import StateBasedAgent from './base/StateBasedAgent'

//todo: fix naming issue: value -> reward

// Monte Carlo: on-policy model-based MC for state value function
export default class McAgent extends StateBasedAgent {
  agentName = 'mc'

  goNextStep(onStepComplete, onTrajectoryComplete, options = {}) {
    const { alwaysGreedy = false, training = true } = options
    if (!this.runningTrajectory) {
      this.start(0, 0)
      const { x, y } = this.grid.getCurrPos()
      this.runningTrajectory = []
      this.runningTrajectory.push({ x, y, reward: this.grid.getCurrReward() })
      if (typeof onStepComplete === 'function') onStepComplete()
      if (training) {
        this.trainingStepTotal += 1
        this.setLastTry(x, y)
      }
      return
    }

    if (!this.grid.hasEnded()) {
      const greedy = Math.random() > this.epsilon || alwaysGreedy
      const action = greedy ? this.pickGreedyAction() : this.pickRandomAction()
      const { x, y } = this.grid.getCurrPos()
      const reward = this.grid.move(action)
      this.runningTrajectory.push({ x, y, reward })
      if (typeof onStepComplete === 'function') onStepComplete()
      if (training) {
        this.trainingStepTotal += 1
        this.setLastTry(x, y)
      }
    }

    if (this.grid.hasEnded()) {
      if (typeof onTrajectoryComplete === 'function') onTrajectoryComplete()
      if (training) {
        this.performMcBackup(this.runningTrajectory)
      }
      this.runningTrajectory = null
    }
  }

  performMcBackup(trajectory) {
    for (let i = trajectory.length - 1; i >= 0; i--) {
      const currStep = trajectory[i]
      const nextStep = trajectory[i + 1]
      let newValue = currStep.reward
      newValue += Math.sqrt(this.getLongTimeNoTryCount(currStep.x, currStep.y)) * this.longTimeNoTryRewardBonusFactor
      if (nextStep) {
        newValue += this.getValue(nextStep.x, nextStep.y) * this.discount
      }
      this.updateValue(currStep.x, currStep.y, newValue)
    }
  }
}
