import { sudokuList } from './data'

export function handleCellBorder(cellNum: number) {
  const borders = []
  const array = Array(81)
    .fill(0)
    .map((_, i) => i + 1)

  function getColCells(index: number) {
    return array.filter(i => i % 9 === index).includes(cellNum)
  }

  function getRowCells(index: number) {
    return array.slice(0 + 9 * index, 9 + 9 * index).includes(cellNum)
  }

  if (cellNum < 10) borders.push('border-t-4')
  if (cellNum > 72) borders.push('border-b-4')
  if (getColCells(1)) borders.push('border-l-4')
  if (getColCells(0) || getColCells(3) || getColCells(6))
    borders.push('border-r-4')
  if (getRowCells(2) || getRowCells(5)) borders.push('border-b-4')

  return borders.join(' ')
}

export function getRandomSudoku() {
  return sudokuList[Math.floor(Math.random() * sudokuList.length)]
}
