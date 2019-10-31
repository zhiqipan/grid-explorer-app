const LEFT = 'left'
const RIGHT = 'right'
const UP = 'up'
const DOWN = 'down'

export default class GridWorld {
  constructor(width, height) {
    this.MIN_X = 0
    this.MAX_X = width - 1
    this.MIN_Y = 0
    this.MAX_Y = height - 1
    this.rewards = {}
    this.blocks = {}
    this.winds = {}
    this.observers = []
    this.observersPaused = false
  }

  addObserver(ob) {
    if (ob) {
      this.observers.push(ob)
      this.notifyGridConfigChange()
    }
  }

  removeObserver(ob) {
    this.observers = this.observers.filter(o => o !== ob)
  }

  removeAllObservers() {
    this.observers.length = 0
  }

  pauseObservers() {
    this.observersPaused = true
  }

  resumeObservers() {
    this.observersPaused = false
    this.notifyGridConfigChange()
    this.notifyAgentMove()
  }

  notifyGameInit(x, y) {
    if (this.observersPaused) return
    this.observers.forEach(ob => {
      if (typeof ob.notifyGameInit === 'function') {
        ob.notifyGameInit(x, y)
      }
    })
  }

  notifyGridConfigChange() {
    if (this.observersPaused) return
    const { rewards, blocks, winds } = this
    this.observers.forEach(ob => {
      if (typeof ob.notifyGridConfigChange === 'function') {
        ob.notifyGridConfigChange({ rewards, blocks, winds, terminal: { x: this.END_X, y: this.END_Y } })
      }
    })
  }

  notifyAgentMove() {
    if (this.observersPaused) return
    const { x, y } = this.getCurrPos()
    const reward = this.getCurrReward()
    this.observers.forEach(ob => {
      if (typeof ob.notifyAgentMove === 'function') {
        ob.notifyAgentMove(x, y, reward)
      }
    })
  }

  notifyWindTriggered(windX, windY, wind) {
    if (this.observersPaused) return
    this.observers.forEach(ob => {
      if (typeof ob.notifyWindTriggered === 'function') {
        ob.notifyWindTriggered(windX, windY, wind)
      }
    })
  }

  getSize() {
    return { width: this.MAX_X + 1, height: this.MAX_Y + 1 }
  }

  init(x, y) {
    if (!this.isPosAvailable(x, y)) throw new Error('Invalid start position')
    if (!this.isPosAvailable(this.END_X, this.END_Y)) throw new Error('Invalid terminal position')

    this.currX = x
    this.currY = y

    this.notifyGameInit(x, y)
  }

  setTerminal(x, y) {
    if (!this.isWithinGrid(x, y)) throw new Error('Invalid position')

    this.END_X = x
    this.END_Y = y

    this.notifyGridConfigChange()
  }

  setReward(x, y, value) {
    if (!this.isWithinGrid(x, y)) throw new Error('Invalid position')

    if (!this.rewards[x]) this.rewards[x] = {}
    this.rewards[x][y] = value

    this.notifyGridConfigChange()
  }

  addBlock(x, y) {
    if (!this.isWithinGrid(x, y)) throw new Error('Invalid position')

    if (!this.blocks[x]) this.blocks[x] = {}
    this.blocks[x][y] = true

    this.notifyGridConfigChange()
  }

  removeBlock(x, y) {
    if (this.blocks[x] && this.blocks[x][y]) this.blocks[x][y] = false

    this.notifyGridConfigChange()
  }

  addWind(x, y, options = { strength: 0, direction: 'left', chance: .0 }) {
    if (!this.isWithinGrid(x, y)) throw new Error('Invalid position')

    if (!this.winds[x]) this.winds[x] = {}
    this.winds[x][y] = options

    this.notifyGridConfigChange()
  }

  removeWind(x, y) {
    if (this.winds[x] && this.winds[x][y]) this.winds[x][y] = { strength: 0, direction: 'h', chance: .0 }

    this.notifyGridConfigChange()
  }

  setRewards(matrix) {
    for (let x = 0; x < matrix[0].length; x++) {
      for (let y = 0; y < matrix.length; y++) {
        const reward = matrix[y][x]
        if (!this.isWithinGrid(x, y)) throw new Error('Invalid position')

        if (!this.rewards[x]) this.rewards[x] = {}
        this.rewards[x][y] = reward
      }
    }

    this.notifyGridConfigChange()
  }

  getCurrReward() {
    const x = this.currX
    const y = this.currY
    if (!this.rewards[x]) return 0
    if (!this.rewards[x][y]) return 0
    return this.rewards[x][y]
  }

  isTerminal(x, y) {
    if (!this.isWithinGrid(x, y)) throw new Error('Invalid position')

    return x === this.END_X && y === this.END_Y
  }

  hasEnded() {
    return this.currX === this.END_X && this.currY === this.END_Y
  }

  isWithinGrid(x, y) {
    return x >= this.MIN_X && x <= this.MAX_X && y >= this.MIN_Y && y <= this.MAX_Y
  }

  isPosAvailable(x, y) {
    const isBlock = this.blocks[x] && this.blocks[x][y]
    return this.isWithinGrid(x, y) && !isBlock
  }

  move(action) {
    if (this.hasEnded(this.currX, this.currY)) throw new Error('The game has ended, already at terminal position')
    if (!Object.keys(this.getAvailableActions()).includes(action)) throw new Error('This action is not available: ' + action)

    switch (action) {
    case LEFT:
      this.currX -= 1
      break
    case RIGHT:
      this.currX += 1
      break
    case UP:
      this.currY -= 1
      break
    case DOWN:
      this.currY += 1
      break
    default:
      throw new Error('Invalid action: ' + action)
    }

    this.notifyAgentMove()

    if (this.winds[this.currX] && this.winds[this.currX][this.currY]) {
      const { strength = 0, direction, chance } = this.winds[this.currX][this.currY]
      const shouldBlow = Math.random() < chance && strength > 0
      if (shouldBlow) {
        this.notifyWindTriggered(this.currX, this.currY, { strength, direction, chance })
        switch (direction) {
        case LEFT:
          for (let i = 0; i < strength; i++) {
            if (!this.isPosAvailable(this.currX - 1, this.currY)) break
            this.currX -= 1
          }
          break
        case RIGHT:
          for (let i = 0; i < strength; i++) {
            if (!this.isPosAvailable(this.currX + 1, this.currY)) break
            this.currX += 1
          }
          break
        case UP:
          for (let i = 0; i < strength; i++) {
            if (!this.isPosAvailable(this.currX, this.currY - 1)) break
            this.currY -= 1
          }
          break
        case DOWN:
          for (let i = 0; i < strength; i++) {
            if (!this.isPosAvailable(this.currX, this.currY + 1)) break
            this.currY += 1
          }
          break
        default:
          throw new Error('Invalid wind direction: ' + direction)
        }

        this.notifyAgentMove()
      }
    }

    return this.getCurrReward()
  }

  getAvailableActions() {
    const actions = {}
    const left = [this.currX - 1, this.currY]
    const right = [this.currX + 1, this.currY]
    const up = [this.currX, this.currY - 1]
    const down = [this.currX, this.currY + 1]
    if (this.isPosAvailable(...left)) {
      actions[LEFT] = { x: left[0], y: left[1] }
    }
    if (this.isPosAvailable(...right)) {
      actions[RIGHT] = { x: right[0], y: right[1] }
    }
    if (this.isPosAvailable(...up)) {
      actions[UP] = { x: up[0], y: up[1] }
    }
    if (this.isPosAvailable(...down)) {
      actions[DOWN] = { x: down[0], y: down[1] }
    }
    return actions
  }

  getCurrPos() {
    return { x: this.currX, y: this.currY }
  }
}
