import './style.css'
import { getRandomSudoku } from './functions'
import { useState, createContext } from 'react'
import SudokuInteractions from './interactions'
import SudokuGrid from './grid'

interface ContextType {
  sudoku: string
  setSudoku: React.Dispatch<React.SetStateAction<string>>
  serverResponse: string
  setServerResponse: React.Dispatch<React.SetStateAction<string>>
}

export const Context = createContext<ContextType>({} as ContextType)

export default function Sudoku() {
  const [sudoku, setSudoku] = useState<string>(getRandomSudoku())
  const [serverResponse, setServerResponse] = useState<string>('')

  return (
    <Context.Provider
      value={{ sudoku, setSudoku, serverResponse, setServerResponse }}
    >
      <div className='bg-lightColor shadow-xl p-3 lg:p-6 rounded-md w-[13.5rem] sm:w-[24rem] md:w-[28rem] md:min-h-[26rem]'>
        <SudokuGrid />
        <SudokuInteractions />
      </div>
    </Context.Provider>
  )
}
