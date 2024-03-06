const captcha = require('../controllers/reCaptcha')
const SudokuSolver = require('../controllers/sudoku-solver.js')

module.exports = (app) => {
  const solver = new SudokuSolver()

  const rowCoor = new Map([
    ['a', 0],
    ['b', 1],
    ['c', 2],
    ['d', 3],
    ['e', 4],
    ['f', 5],
    ['g', 6],
    ['h', 7],
    ['i', 8],
  ])

  const translateCoordinate = (input) => {
    const values = input.split('')
    const error = { error: 'Invalid coordinate' }
    if (values.length > 2) return error
    if (!/[a-i]/gi.test(values[0])) return error
    if (!/[1-9]/g.test(values[1])) return error

    const row = rowCoor.get(values[0].toLowerCase())
    const col = parseInt(values[1]) - 1

    return { row: row, col: col }
  }

  const validateValue = (value) => {
    const error = { error: 'Invalid value' }
    if (!/[1-9]/g.test(value)) return error
    return parseInt(value)
  }

  const checkPlacement = (sudoku, row, col, value) => {
    const result = [
      solver.checkRowPlacement(sudoku, row, col, value),
      solver.checkColPlacement(sudoku, row, col, value),
      solver.checkRegionPlacement(sudoku, row, col, value),
    ]

    let valid = true
    let conflict = []

    for (let i = 0; i < result.length; i++) {
      valid = valid && result[i].valid
      if (result[i].error) return result[i]
      if (result[i].conflict) conflict.push(result[i].conflict)
    }

    return valid ? { valid: valid } : { valid: valid, conflict: conflict }
  }

  app.route('/sudoku/check').post(async (req, res) => {
    const isNotBot = await captcha.verify(req.body)
    if (!isNotBot.success)
      return res.json({
        error: `Désolé, nous n'avons pas pu vérifier que vous n'êtes pas un robot. Veuillez réessayer.`,
      })

    const sudoku = req.body.puzzle
    const coordinate = req.body.coordinate

    if (!sudoku || !coordinate || !req.body.value)
      return res.json({ error: 'Required field(s) missing' })

    const validSudoku = solver.validate(sudoku)
    const pos = translateCoordinate(coordinate)
    const value = validateValue(req.body.value)

    if (pos.error) return res.json(pos)
    if (value.error) return res.json(value)
    if (validSudoku.error) return res.json(validSudoku)

    const result = checkPlacement(sudoku, pos.row, pos.col, value)

    res.json(result)
  })

  app.route('/sudoku/solve').post(async (req, res) => {
    const isNotBot = await captcha.verify(req.body)
    if (!isNotBot.success)
      return res.json({
        error: `Désolé, nous n'avons pas pu vérifier que vous n'êtes pas un robot. Veuillez réessayer.`,
      })
    if (!req.body.puzzle) return res.json({ error: 'Required field missing' })
    res.json(solver.solve(req.body.puzzle))
  })
}
