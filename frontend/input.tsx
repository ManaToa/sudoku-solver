interface SudokuInputProps {
  label: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}

export default function SudokuInput({ label, setValue }: SudokuInputProps) {
  return (
    <div className='flex mx-2'>
      <p className='text-md font-bold uppercase'>{label} :</p>
      <input
        type='text'
        onChange={e => setValue(e.target.value)}
        className='w-[2rem] md:w-[2.5rem] ml-3 rounded-sm border-2 border-black px-1 bg-ligthColorHover'
      />
    </div>
  )
}
