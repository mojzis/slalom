import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the game title', () => {
    render(<App />)
    expect(screen.getByText('Word Reader Downhill')).toBeInTheDocument()
  })

  it('renders the game container', () => {
    render(<App />)
    expect(screen.getByTestId('phaser-game-mock')).toBeInTheDocument()
  })

  it('renders the app container', () => {
    render(<App />)
    const container = document.querySelector('.app-container')
    expect(container).toBeInTheDocument()
  })
})
