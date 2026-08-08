import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/test/')
      .then(response => {
        setMessage(response.data.message)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
        setMessage('Error connecting to backend')
      })
  }, [])

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>NearNow Project Setup</h1>
      <p>Backend Connection Status: <strong>{message}</strong></p>
    </div>
  )
}

export default App
