import React, { useState, useEffect } from 'react'
import { BugForm } from './components/BugForm'
import { BugList } from './components/BugList'
import { ErrorBoundary } from './components/ErrorBoundary'
import './App.css'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

const App = () => {
  const [bugs, setBugs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBugs()
  }, [])

  const fetchBugs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/bugs`)
      if (!response.ok) throw new Error('Failed to fetch bugs')
      const data = await response.json()
      setBugs(data.data || [])
    } catch (err) {
      console.error('Error fetching bugs:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBug = async (formData) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/bugs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to create bug')
      const data = await response.json()
      setBugs([data.data, ...bugs])
    } catch (err) {
      console.error('Error creating bug:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBug = async (bugId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bugs/${bugId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete bug')
      setBugs(bugs.filter((bug) => bug._id !== bugId))
    } catch (err) {
      console.error('Error deleting bug:', err)
      setError(err.message)
    }
  }

  const handleStatusChange = async (bugId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bugs/${bugId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update bug status')
      const data = await response.json()
      setBugs(bugs.map((bug) => (bug._id === bugId ? data.data : bug)))
    } catch (err) {
      console.error('Error updating bug:', err)
      setError(err.message)
    }
  }

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <h1>🐛 Bug Tracker</h1>
          <p>Report and track bugs efficiently</p>
        </header>

        <main className="app-main">
          {error && (
            <div className="error-alert" role="alert">
              <p>{error}</p>
              <button onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}

          <section className="form-section">
            <h2>Report a Bug</h2>
            <BugForm onSubmit={handleCreateBug} isLoading={isLoading} />
          </section>

          <section className="list-section">
            <h2>Bug Reports ({bugs.length})</h2>
            <BugList
              bugs={bugs}
              onDelete={handleDeleteBug}
              onStatusChange={handleStatusChange}
              isLoading={isLoading}
            />
          </section>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App
