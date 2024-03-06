class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length !== 81)
      return { error: 'Expected puzzle to be 81 characters long' }
    if (!/^[0-9.]+$/g.test(puzzleString))
      return { error: 'Invalid characters in puzzle' }
    return true
  }

  checkRowPlacement(puzzleString, row, column, value) {
    if (!/^[0-8]{1}$/.test(row) || !/^[0-8]{1}$/.test(column))
      return { error: 'Invalid coordinate' }

    if (!/^[1-9]{1}$/.test(value)) return { error: 'Invalid value' }

    const targetRow = puzzleString.slice(row * 9, row * 9 + 9)

    if (targetRow.includes(value) && targetRow[column] !== value.toString())
      return { valid: false, conflict: 'row' }

    return { valid: true }
  }

  checkColPlacement(puzzleString, row, column, value) {
    if (!/^[0-8]{1}$/.test(row) || !/^[0-8]{1}$/.test(column))
      return { error: 'Invalid coordinate' }

    if (!/^[1-9]{1}$/.test(value)) return { error: 'Invalid value' }

    const targetCol = puzzleString
      .split('')
      .filter((x, i) => i % 9 === 0 + parseInt(column))
      .join('')

    if (targetCol.includes(value) && targetCol[row] !== value.toString())
      return { valid: false, conflict: 'column' }

    return { valid: true }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    if (!/^[0-8]{1}$/.test(row) || !/^[0-8]{1}$/.test(column))
      return { error: 'Invalid coordinate' }

    if (!/^[1-9]{1}$/.test(value)) return { error: 'Invalid value' }

    const cols = ['012', '345', '678']
    const targetCol = cols[Math.floor(column / 3)]
    const targetRow = Math.floor(row / 3) * 9
    const index = (row % 3) * 3 + (column % 3)

    const region = puzzleString
      .split('')
      .filter((x, i) => targetCol.includes(i % 9))
      .join('')
      .slice(targetRow, targetRow + 9)

    if (region.includes(value) && region[index] !== value.toString())
      return { valid: false, conflict: 'region' }

    return { valid: true }
  }

  getZones(sudoku) {
    const index = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    const colIndex = ['012', '345', '678']

    const rows = index
      .map((i) => sudoku.slice(i * 9, i * 9 + 9))
      .map((r) => ({
        row: r,
        empty: r.match(/[.]/g) ? r.match(/[.]/g).length : 100,
      }))

    const cols = index
      .map((k) =>
        sudoku
          .split('')
          .filter((x, i) => i % 9 === 0 + k)
          .join('')
      )
      .map((c) => ({
        col: c,
        empty: c.match(/[.]/g) ? c.match(/[.]/g).length : 100,
      }))

    const regions = index
      .map((f) =>
        sudoku
          .split('')
          .filter((x, i) => colIndex[Math.floor(f / 3)].includes(i % 9))
          .join('')
          .slice((f % 3) * 9, (f % 3) * 9 + 9)
      )
      .map((r) => ({
        region: r,
        empty: r.match(/[.]/g) ? r.match(/[.]/g).length : 100,
      }))

    return { rows: rows, cols: cols, regions: regions }
  }

  getMinBlanks(list, skipList) {
    const skipValues = skipList.map((x) => x.list)
    const name = Object.keys(list[0])[0]
    const targetList = list.map((x) => {
      return !skipValues.includes(x[name])
        ? { name: x[name], empty: x.empty }
        : { name: x[name], empty: 50 }
    })

    const blankList = targetList.map((x) => x.empty)
    const minBlank = Math.min(...blankList)
    const blankIndex = blankList.indexOf(minBlank)

    return { min: minBlank, index: blankIndex }
  }

  checkPlacement(sudoku, row, col, value) {
    const result = [
      this.checkRowPlacement(sudoku, row, col, value).valid,
      this.checkColPlacement(sudoku, row, col, value).valid,
      this.checkRegionPlacement(sudoku, row, col, value).valid,
    ]

    return !result.includes(false)
  }

  getCoordinatesFromType(l, i, type) {
    if (type === 'row') return { row: l, col: i }
    if (type === 'col') return { row: i, col: l }

    const zones = ['012', '345', '678']
    const rows = l % 3
    const row = Math.floor(i / 3)

    const cols = Math.floor((l % 9) / 3)
    const col = i % 3

    return { row: zones[rows][row], col: zones[cols][col] }
  }

  updateSudoku(sudoku, change) {
    const arraySudoku = sudoku.split('')
    arraySudoku[parseInt(change.row) * 9 + parseInt(change.col)] = parseInt(
      change.value
    )
    const updatedSudoku = arraySudoku.join('')

    return updatedSudoku
  }

  fillBlanks(sudoku, list, index, type) {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const missingValues = values.filter((v) => !list.includes(v))

    const blankIndex = []
    for (let i = 0; i < list.length; i++) {
      if (list[i] === '.') blankIndex.push(i)
    }

    for (const val in missingValues) {
      const value = missingValues[val]
      const res = blankIndex.map((i) => {
        const { row, col } = this.getCoordinatesFromType(index, i, type)

        return {
          value: value,
          row: row,
          col: col,
          valid: this.checkPlacement(sudoku, row, col, value),
        }
      })

      const change = res.filter((x) => x.valid === true)
      if (change.length === 1) {
        return {
          sudoku: this.updateSudoku(sudoku, change[0]),
          blocked: false,
        }
      } else {
        continue
      }
    }
    return {
      sudoku: sudoku,
      blocked: true,
      list: list,
    }
  }

  updateSkipList(skipList) {
    return skipList
      .map((x) => ({ list: x.list, count: x.count + 1 }))
      .filter((x) => x.count < 10)
  }

  solve(puzzleString) {
    const validSudoku = this.validate(puzzleString)
    if (validSudoku.error) return validSudoku

    let sudoku = puzzleString
    let blocked = false
    let skipList = []
    let i = 0

    while (sudoku.includes('.') && i < 200) {
      const { rows, cols, regions } = this.getZones(sudoku)

      skipList = this.updateSkipList(skipList)

      const minRow = this.getMinBlanks(rows, skipList)
      const minCol = this.getMinBlanks(cols, skipList)
      const minRegion = this.getMinBlanks(regions, skipList)

      const sortedMins = [minRow.min, minCol.min, minRegion.min].sort(
        (a, b) => a - b
      )

      const minValue = sortedMins[0]

      if (minRow.min === minValue) {
        const result = this.fillBlanks(
          sudoku,
          rows[minRow.index].row,
          minRow.index,
          'row'
        )
        sudoku = result.sudoku
        blocked = result.blocked
        if (blocked) skipList.push({ list: result.list, count: 0 })
      } else if (minCol.min === minValue) {
        const result = this.fillBlanks(
          sudoku,
          cols[minCol.index].col,
          minCol.index,
          'col'
        )
        sudoku = result.sudoku
        blocked = result.blocked
        if (blocked) skipList.push({ list: result.list, count: 0 })
      } else if (minRegion.min === minValue) {
        const result = this.fillBlanks(
          sudoku,
          regions[minRegion.index].region,
          minRegion.index,
          'region'
        )
        sudoku = result.sudoku
        blocked = result.blocked
        if (blocked) skipList.push({ list: result.list, count: 0 })
      }
      i++
    }

    if (i === 200) return { error: 'Puzzle cannot be solved' }

    return { solution: sudoku }
  }
}

module.exports = SudokuSolver
