import { useContext, useEffect, useState } from 'react'
import SudokuButton from './buttons'
import SudokuInput from './input'
import { Context } from '.'
import { getRecaptchaToken, initRecaptcha } from '../../utils/reCaptcha'
import { POSTrequest } from '../../utils/requests'
import { getRandomSudoku } from './functions'

export default function SudokuInteractions() {
  const { sudoku, setSudoku, serverResponse, setServerResponse } = useContext(Context)

  const [cellCoordinate, setCellCoordinate] = useState<string>('')
  const [cellValue, setCellValue] = useState<string>('')

  async function solveSudoku() {
    setServerResponse('')
    const stuff = {
      puzzle: sudoku,
      gRecaptchaResponse: await getRecaptchaToken(),
    }

    try {
      const url = '/sudoku/solve'
      const result = await POSTrequest(url, stuff)

      if (result.error) return setServerResponse(JSON.stringify(result, null, 2))
      setSudoku(result.solution)
    } catch (error) {
      setServerResponse('Une erreur est survenue')
    }
  }

  async function checkPlacement() {
    const stuff = {
      puzzle: sudoku,
      coordinate: cellCoordinate,
      value: cellValue,
      gRecaptchaResponse: await getRecaptchaToken(),
    }

    try {
      const url = '/sudoku/check'
      const result = await POSTrequest(url, stuff)
      setServerResponse(JSON.stringify(result, null, 2))
    } catch (error) {
      setServerResponse('Une erreur est survenue')
    }
  }

  function changeSudoku() {
    setSudoku(getRandomSudoku())
    setServerResponse('')
  }

  useEffect(() => {
    initRecaptcha()
  }, [])

  return (
    <div className='mt-6'>
      <p className='mt-5 font-bold'>Vérifier un emplacement:</p>
      <div className='flex flex-col md:flex-row justify-between items-center mt-2 gap-3 md:gap-0'>
        <div className='flex flex-col sm:flex-row gap-3 md:gap-0 items-end md:items-center'>
          <SudokuInput label='Cellule' setValue={setCellCoordinate} />
          <SudokuInput label='Valeur' setValue={setCellValue} />
        </div>
        <SudokuButton label='Vérifier' executeAction={checkPlacement} />
      </div>
      <div className='mt-4'>
        <p className='font-bold'>Réponse du serveur:</p>
        <div className='w-full text-xs sm:text-sm md:text-base min-h-[5rem] bg-ligthColorHover p-2 my-4 rounded-md font-mono'>
          {serverResponse}
        </div>
      </div>
      <div className='flex flex-col sm:flex-row gap-3 md:gap-0 sh-[5rem] my-3  justify-between items-center'>
        <SudokuButton label='Résoudre' executeAction={solveSudoku} />
        <SudokuButton label='Changer de Sudoku' executeAction={changeSudoku} />
      </div>
    </div>
  )
}
