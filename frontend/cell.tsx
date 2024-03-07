import { useContext, useEffect, useState } from 'react'
import { Context } from '.'
import { handleCellBorder } from './functions'

interface SudokuCellProps {
  row: string
  col: number
  num: number
}

export default function SudokuCell({ row, col, num }: SudokuCellProps) {
  const { sudoku, setSudoku, setServerResponse } = useContext(Context)

  const [cell, setCell] = useState<string>(sudoku[num] !== '.' ? sudoku[num] : '')

  function handleInput(value: string) {
    if (!/^[0-9]$|^$/.test(value) || value.length > 1) return

    setServerResponse('')

    const newValue = value === '' ? '.' : value
    const cpySudoku = sudoku.split('')
    cpySudoku[num] = newValue
    setSudoku(cpySudoku.join(''))
  }

  useEffect(() => {
    setCell(sudoku[num] !== '.' ? sudoku[num] : '')
  }, [sudoku, num])

  return (
    <td
      className={`p-0 w-[1.2rem] h-[1.2rem] sm:w-[2rem] sm:h-[2rem] text-xs sm:text-base grid  ${
        row === ''
          ? 'text-mainColor font-bold justify-center items-start'
          : `border border-darkColor place-items-center 
            ${handleCellBorder(num + 1)}`
      }`}
    >
      {row === '' ? (
        col
      ) : (
        <input
          className='sudoku-input w-full h-full block text-center border-none outline-none m-0 bg-ligthColorHover'
          type='number'
          maxLength={1}
          min={1}
          max={9}
          value={cell}
          onChange={e => handleInput(e.target.value)}
        />
      )}
    </td>
  )
}
import { useContext, useEffect, useState } from 'react'
import { Context } from '.'
import { handleCellBorder } from './functions'

interface SudokuCellProps {
  row: string
  col: number
  num: number
}

export default function SudokuCell({ row, col, num }: SudokuCellProps) {
  const { sudoku, setSudoku, setServerResponse } = useContext(Context)

  const [cell, setCell] = useState<string>(sudoku[num] !== '.' ? sudoku[num] : '')

  function handleInput(value: string) {
    if (!/^[0-9]$|^$/.test(value) || value.length > 1) return

    setServerResponse('')

    const newValue = value === '' ? '.' : value
    const cpySudoku = sudoku.split('')
    cpySudoku[num] = newValue
    setSudoku(cpySudoku.join(''))
  }

  useEffect(() => {
    setCell(sudoku[num] !== '.' ? sudoku[num] : '')
  }, [sudoku, num])

  return (
    <td
      className={`p-0 w-[1.2rem] h-[1.2rem] sm:w-[2rem] sm:h-[2rem] text-xs sm:text-base grid  ${
        row === ''
          ? 'text-mainColor font-bold justify-center items-start'
          : `border border-darkColor place-items-center 
            ${handleCellBorder(num + 1)}`
      }`}
    >
      {row === '' ? (
        col
      ) : (
        <input
          className='sudoku-input w-full h-full block text-center border-none outline-none m-0 bg-ligthColorHover'
          type='number'
          maxLength={1}
          min={1}
          max={9}
          value={cell}
          onChange={e => handleInput(e.target.value)}
        />
      )}
    </td>
  )
}
