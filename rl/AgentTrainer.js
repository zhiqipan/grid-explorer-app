import Agent from './agents/base/Agent'

export default class AgentTrainer {
  constructor() {
    throw new Error('Not instantiable')
  }

  static train(agent, times = 1) {
    if (!agent instanceof Agent) throw new Error('Agent trainer must work with an agent instance')

    for (let i = 0; i < times; i++) {
      agent.startTrajectory()
    }
  }

  static test(agent) {
    if (!agent instanceof Agent) throw new Error('Agent trainer must work with an agent instance')

    agent.startTrajectory({ alwaysGreedy: true, shouldUpdate: false })
  }
}
