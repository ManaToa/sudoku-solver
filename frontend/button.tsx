interface SudokuButtonProps {
  label: string
  executeAction: () => void
}

export default function SudokuButton({ label, executeAction }: SudokuButtonProps) {
  return (
    <button
      className='uppercase bg-darkColor text-lightColor p-2 rounded-sm font-bold hover:bg-mainColor'
      onClick={() => executeAction()}
    >
      {label}
    </button>
  )
}
