import ActionBasedAgent from './base/ActionBasedAgent'

// Sarsa Monte Carlo: on-policy model-free MC for action value function
export default class SarsaMcAgent extends ActionBasedAgent {
  agentName = 'sarsa-mc'

  performMcBackup(trajectory) {
    for (let i = trajectory.length - 1; i >= 0; i--) {
      const currStep = trajectory[i]
      const nextStep = trajectory[i + 1]
      let newValue = currStep.reward
      newValue += Math.sqrt(this.getLongTimeNoTryCount(currStep.x, currStep.y, currStep.action)) * this.longTimeNoTryRewardBonusFactor
      if (nextStep) {
        newValue += this.getValue(nextStep.x, nextStep.y, nextStep.action) * this.discount
      }
      this.updateValue(currStep.x, currStep.y, currStep.action, newValue)
    }
  }

  goNextStep(onStepComplete, onTrajectoryComplete, options = {}) {
    const { alwaysGreedy = false, training = true } = options
    if (!this.runningTrajectory) {
      this.start(0, 0)
      const { x, y } = this.grid.getCurrPos()
      this.runningTrajectory = []
      this.runningTrajectory.push({ x, y, reward: this.grid.getCurrReward() })
      if (typeof onStepComplete === 'function') onStepComplete()
      return
    }

    if (!this.grid.hasEnded()) {
      const prevPos = this.grid.getCurrPos()
      const greedy = Math.random() > this.epsilon || alwaysGreedy
      const action = greedy ? this.pickGreedyAction() : this.pickRandomAction()
      this.runningTrajectory[this.runningTrajectory.length - 1].action = action
      const reward = this.grid.move(action)
      this.runningTrajectory.push({ ...this.grid.getCurrPos(), reward })
      if (typeof onStepComplete === 'function') onStepComplete()
      if (training) {
        this.trainingStepTotal += 1
        this.setLastTry(prevPos.x, prevPos.y, action)
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
}
