import SarsaMcAgent from './SarsaMcAgent'

// Q Learning Monte Carlo: off-policy model-free MC for action value function
export default class QLearningMcAgent extends SarsaMcAgent {
  agentName = 'q-learning-mc'

  pickGreedyActionAtPos(x, y) {
    const actions = this.values[x] && this.values[x][y] || {}
    const values = Object.values(actions)
    const greedyIndex = values.indexOf(Math.max(...values))
    return Object.keys(actions)[greedyIndex]
  }

  performMcBackup(trajectory) {
    for (let i = trajectory.length - 1; i >= 0; i--) {
      const currStep = trajectory[i]
      const nextStep = trajectory[i + 1]
      let newValue = currStep.reward
      newValue += Math.sqrt(this.getLongTimeNoTryCount(currStep.x, currStep.y, currStep.action)) * this.longTimeNoTryRewardBonusFactor
      if (nextStep) {
        newValue += this.getValue(nextStep.x, nextStep.y, this.pickGreedyActionAtPos(nextStep.x, nextStep.y)) * this.discount
      }
      this.updateValue(currStep.x, currStep.y, currStep.action, newValue)
    }
  }
}
