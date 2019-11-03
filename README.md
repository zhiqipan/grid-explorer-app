# Reinforcement Learning in Grid World

Visualizing reinforcement learning when exploring the grid world.

> **Warning**: All algorithms run live on your browser. If you use '1000 times' to train 1000 times in a row in a complex world,
the browser may crash (taking too long to complete the training). However, based on my experiments, Monte-Carlo Q-learning
agent usually won't disappoint you and converges quite fast.

### How to build and run this app:
1. Git clone this project
2. Go to the directory and run `yarn install`
3. Run `yarn dev` to start the app on localhost:3000

Or, you may just use the one I deployed on Heroku [here](https://grid-explorer.herokuapp.com/)

### How to play around:

#### 1. Use preset world

There are several panels. The bottom-right one is for choosing some preset world I defined.

- `cliff` world is used to demo epsilon-greedy algorithm comes up with a policy to detour.

- State-based agents kinda fail in `luck windy cliff`, while action-based agents know to **take the risk**

- State-based agents kinda fail in `jumping point`, while action-based agents know to **avoid the risk**

> In the above two worlds, state-based agents fail because they hold a wrong version of model (failing to consider wind),
while action-based agents (e.g. Sarsa Monte-Carlo and Q-learning Monte-Carlo) don't rely on a pre-known model.

- `changing maze` world needs yourself to chance the world, this is a typical demo for changing environment.
Refer to textbook *Reinforcement Learning: An Introduction Chapter 8.3* to understand more

#### 2. Construct your own world

- Pick a tool
- Click on a cell in the grid world to make change
- Click the tool again to cancel selection

##### Available tools:

- `reward`: Set the reward of a cell (stochastic reward not supported for now)
- `block`: Set a block on a cell, a block blocks agent's way
- `wind`: Blow agent away. Set direction first, `left`, `right`, `up`, `down`
and then strength, e.g 2, and lastly the possibility the wind occurs, e.g 0.3 (yes, wind
could be stochastic). Setting a wind on a block makes no sense, such wind won't be triggered
- `terminal`: Set the terminal state. You may want to set the reward for terminal state as well with
`reward` tool
- `clear`: Clear a cell, making it zero reward with no wind and block, and no longer a terminal state

> There must be one and only one terminal state (multiple terminal states not supported yet) in each world you customize,
and usually the terminal state is the only state
that has positive reward (most of time, don't make non-terminal states have positive rewards, unless you actually know what you are doing)

#### 3. Choose and modify an agent

By default, it's state-based Monte-carlo, with discount factor 0.9, epsilon greedy 0.6

Select another one to see the difference between agents

**If you change any parameters, click the green button to apply the change.**

> The `exploration bonus` is an experiment feature, it deals with changing environment and uses a heuristic method to
forget old learning result and weight more on new learning result.
Refer to textbook *Reinforcement Learning: An Introduction Chapter 8.3 and Exercise 8.4*

#### 4. Create a new empty world

Max size: 10 x 10

Min size: 3 x 3

**Click the green button to apply your change.**

#### 4. Train the agent

Do it as many times as you want. You can do at most 1000 times in a row, it will be done automatically on your browser.
Hopefully it does not crash... (Q-learning agent usually won't disappoint you, but others, no guarantee...)

You can run a trajectory step by step, or you can run a whole episode with a time interval between each step (100ms by default),
this helps you understand what's going on.

Greedy step always pick the greedy action possible, according to the learnt value function; non-greedy step is actually doing epsilon-greedy (so it may detour sometimes)

`Reset an agent`: Reset the position of the agent. Hints: this is useful when you run the agent but your value function has not converged,
in such case the agent may go back and forth in two states.

`Reset training progress`: Reset the learnt value function. Note that changing agent will reset training progress automatically,
but if you just change agent params (discount, epsilon, exploration bonus), learning progress won't be lost


### Technical details:

Core RL algorithms are in `/rl` directory.

`Agent`: abstract class, any RL agent extends it

`StateBasedAgent`: abstract class, it extends `Agent` and learns state value function. Any state-based agent (e.g. State-based Monte-Carlo) extend it

`ActionBasedAgent`: abstract class, it extends `Agent` and learns action value function. Any action-based agent (e.g. Sarsa Monte-Carlo) extend it

`McAgent`: on-policy Monte-Carlo agent, learning state value function

`TdAgent`: on-policy TD(0) agent, learning state value function

`QLearningMcAgent`: model-free off-policy Monte-Carlo, learning action value function

`SarsaMcAgent`: model-free on-policy Monte-Carlo, learning action value function

`GridWorld`: The 'real' world where agents play in
