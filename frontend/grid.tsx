import SudokuRow from './row'

export default function SudokuGrid() {
  const rows = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']

  return (
    <div className='w-full flex justify-center relative'>
      <table className='border-collapse relative mt-2 right-[.4rem] sm:right-[1rem]'>
        <tbody>
          {rows.map((row, i) => (
            <SudokuRow key={i} row={row} num={i} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
