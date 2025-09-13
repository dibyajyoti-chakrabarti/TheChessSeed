import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='bg-red-700 text-white border-solid border-20 border-black'>
        Greetings
      </div>
    </>
  )
}

export default App
