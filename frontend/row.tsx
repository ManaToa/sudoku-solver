import SudokuCell from './cell'

interface SudokuRowProps {
  row: string
  num: number
}

export default function SudokuRow({ row, num }: SudokuRowProps) {
  return (
    <tr className='flex'>
      <td className='w-[1.2rem] h-[1.2rem] sm:w-[2rem] sm:h-[2rem] text-xs sm:text-base grid place-items-center font-bold text-mainColor'>
        {row}
      </td>
      {Array(9)
        .fill('')
        .map((_, i) => (
          <SudokuCell key={i} row={row} col={i + 1} num={num * 9 - (9 - i)} />
        ))}
    </tr>
  )
}
