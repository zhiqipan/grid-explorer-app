export function basic(createWorld) {
  const gridRewards = [
    [+0, +0, -1, +0],
    [+0, +0, +0, +0],
    [+0, -1, +0, +1],
    [+0, +0, +0, +0],
  ]

  const grid = createWorld(4, 4)
  grid.setRewards(gridRewards)
  grid.setTerminal(3, 2)

  return grid
}

export function basicBlock(createWorld) {
  const gridRewards = [
    [+0, +0, -1, +0],
    [+0, +0, +0, +0],
    [+0, -1, +0, +1],
    [+0, +0, +0, +0],
  ]

  const grid = createWorld(4, 4)
  grid.setRewards(gridRewards)
  grid.setTerminal(3, 2)
  grid.addBlock(2, 1)

  return grid
}

export function basicWind(createWorld) {
  const gridRewards = [
    [+0, +0, -1, +0],
    [+0, +0, +0, +0],
    [+0, -1, +0, +1],
    [+0, +0, +0, +0],
  ]

  const grid = createWorld(4, 4)
  grid.setRewards(gridRewards)
  grid.setTerminal(3, 2)
  grid.addWind(2, 1, { direction: 'left', strength: 2, chance: 1 })

  return grid
}

export function basicBlockAndWind(createWorld) {
  const gridRewards = [
    [+0, +0, -1, +0, -1],
    [+0, +0, +0, +0, +0],
    [+0, -1, +0, -1, +0],
    [+0, +0, +0, +0, -1],
    [+0, -1, +3, +0, -1],
    [+0, +0, +0, +0, -1],
  ]

  const grid = createWorld(5, 6)
  grid.setRewards(gridRewards)
  grid.setTerminal(2, 4)
  grid.addBlock(0, 1)
  grid.addWind(1, 1, { strength: 2, direction: 'right', chance: .3 })

  return grid
}

export function cliff(createWorld) {
  const n = 100
  const gridRewards = [
    [+0, -n, -n, -n, -n, -n, +n],
    [+0, +0, +0, +0, +0, +0, +0],
    [+0, +0, +0, +0, +0, +0, +0],
    [+0, +0, +0, +0, +0, +0, +0],
    [+0, +0, +0, +0, +0, +0, +0],
    [+0, +0, +0, +0, +0, +0, +0],
    [+0, +0, +0, +0, +0, +0, +0],
  ]

  const grid = createWorld(7, 7)
  grid.setRewards(gridRewards)
  grid.setTerminal(6, 0)

  return grid
}

export function badWindyCliff(createWorld) {
  const n = 100
  const gridRewards = [
    [+0, -n, -n, -n, -n, -n, +n],
    [+0, +0, +0, +0, +0, +0, +0],
    [+0, +0, +0, +0, +0, +0, +0],
    [+0, +0, +0, +0, +0, +0, +0],
    [+0, +0, +0, +0, +0, +0, +0],
    [+0, +0, +0, +0, +0, +0, +0],
    [+0, +0, +0, +0, +0, +0, +0],
  ]

  const grid = createWorld(7, 7)
  grid.setRewards(gridRewards)
  grid.addWind(5, 2, { direction: 'left', strength: 3, chance: 0.8 })
  grid.addWind(5, 3, { direction: 'left', strength: 3, chance: 0.8 })
  grid.addWind(5, 4, { direction: 'left', strength: 3, chance: 0.8 })

  grid.setTerminal(6, 0)

  return grid
}

export function goodWindyCliff(createWorld) {
  const n = 100
  const gridRewards = [
    [+0, -n, -n, -n, -n, -n, +n],
    [+0, +0, +0, +0, +0, +0, +0],
    [+0, +0, +0, +0, +0, +0, +0],
    [+0, +0, +0, +0, +0, +0, +0],
    [+0, +0, +0, +0, +0, +0, +0],
    [+0, +0, +0, +0, +0, +0, +0],
    [+0, +0, +0, +0, +0, +0, +0],
  ]

  const grid = createWorld(7, 7)
  grid.setRewards(gridRewards)
  grid.addWind(0, 2, { direction: 'down', strength: 4, chance: 0.8 })
  grid.addWind(2, 6, { direction: 'right', strength: 3, chance: 0.8 })
  grid.addWind(6, 6, { direction: 'up', strength: 5, chance: 0.3 })

  grid.setTerminal(6, 0)

  return grid
}

export function luckyWindyCliff(createWorld) { // state-based agents fail in this case (action-based agents know to take the risk)
  const n = 100
  const m = 11
  const gridRewards = [
    [+0, -n, -n, -n, -n, -n, +n],
    [+0, +m, +m, +m, +m, +m, +0],
    [+0, +0, +0, +0, +0, +0, +0],
  ]

  const grid = createWorld(7, 3)
  grid.setRewards(gridRewards)
  grid.addWind(1, 1, { direction: 'up', strength: 1, chance: 0.1 })
  grid.addWind(2, 1, { direction: 'up', strength: 1, chance: 0.1 })
  grid.addWind(3, 1, { direction: 'up', strength: 1, chance: 0.1 })
  grid.addWind(4, 1, { direction: 'up', strength: 1, chance: 0.1 })
  grid.addWind(5, 1, { direction: 'up', strength: 1, chance: 0.1 })

  grid.setTerminal(6, 0)

  return grid
}

export function jumpingPoint(createWorld) { // state-based agents fail in this case (action-based agents know to avoid the risk)
  const n = 5
  const gridRewards = [
    [+0, +0, +1, +0, +0, -n],
    [+0, +0, +0, +0, +0, +0],
  ]

  const grid = createWorld(6, 2)
  grid.setRewards(gridRewards)
  grid.addWind(1, 0, { direction: 'right', strength: 4, chance: 0.9 })

  grid.setTerminal(2, 0)

  return grid
}

export function changingMaze(createWorld) {
  const grid = createWorld(8, 5)
  grid.addBlock(0, 3)
  grid.addBlock(1, 3)
  grid.addBlock(2, 3)
  grid.addBlock(3, 3)
  grid.addBlock(4, 3)
  grid.addBlock(5, 3)
  grid.addBlock(6, 3)

  grid.setReward(1, 4, 10)
  grid.setTerminal(1, 4)
  return grid
}
