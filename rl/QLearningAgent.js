import SarsaAgent from './SarsaAgent'

export default class QLearningAgent extends SarsaAgent {

  pickGreedyActionAtPos(x, y) {
    const actions = this.values[x] && this.values[x][y] || {}
    const values = Object.values(actions)
    const greedyIndex = values.indexOf(Math.max(...values))
    return Object.keys(actions)[greedyIndex]
  }

  performBackup(trajectory) {
    for (let i = trajectory.length - 1; i >= 0; i--) {
      const currStep = trajectory[i]
      const nextStep = trajectory[i + 1]
      let newValue = currStep.value
      if (nextStep) {
        newValue += this.getValue(nextStep.x, nextStep.y, this.pickGreedyActionAtPos(nextStep.x, nextStep.y)) * this.discount
      }
      this.updateValue(currStep.x, currStep.y, currStep.action, newValue)
    }
  }
}
