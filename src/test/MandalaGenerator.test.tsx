import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import MandalaGenerator from '../components/MandalaGenerator'

// Mock canvas context
const mockGetContext = vi.fn(() => ({
  clearRect: vi.fn(),
  save: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  quadraticCurveTo: vi.fn(),
}))

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLCanvasElement.prototype.getContext = mockGetContext as any
})

describe('MandalaGenerator', () => {
  it('renders correctly', () => {
    render(<MandalaGenerator />)
    expect(screen.getAllByText(/Pétalas/i)[0]).toBeInTheDocument()
    expect(screen.getByText(/Gerar Aleatória/i)).toBeInTheDocument()
  })

  it('toggles Fibonacci mode', () => {
    render(<MandalaGenerator />)

    // Open the accordion first
    const accordionBtn = screen.getByText(/Geometria & Fractais/i)
    fireEvent.click(accordionBtn)

    const toggle = screen.getByText(/Pétalas em Fibonacci/i).previousSibling as HTMLInputElement
    expect(toggle).toBeInTheDocument()
    expect(toggle.checked).toBe(false)

    fireEvent.click(toggle)
    expect(toggle.checked).toBe(true)
  })

  it('toggles Fractal Mode', () => {
    render(<MandalaGenerator />)

    // Open the accordion first
    const accordionBtn = screen.getByText(/Geometria & Fractais/i)
    fireEvent.click(accordionBtn)

    const toggle = screen.getByText(/Modo Fractal/i).previousSibling as HTMLInputElement
    expect(toggle).toBeInTheDocument()
    expect(toggle.checked).toBe(false)

    fireEvent.click(toggle)
    expect(toggle.checked).toBe(true)
  })

  it('snaps petal count to Fibonacci numbers when mode is enabled', () => {
    render(<MandalaGenerator />)

    // Get input (already visible in default open accordion)
    const petalInput = screen.getByLabelText(/Pétalas/i)

    // Set petals to 10 (not Fibonacci)
    fireEvent.change(petalInput, { target: { value: '10' } })

    // Open the geometry accordion
    const accordionBtn = screen.getByText(/Geometria & Fractais/i)
    fireEvent.click(accordionBtn)

    // Enable Fibonacci mode
    const toggle = screen.getByText(/Pétalas em Fibonacci/i).previousSibling as HTMLInputElement
    fireEvent.click(toggle)

    // Should snap to 8 or 13 (nearest). 8 is closer to 10.
    // The value 8 should be shown in the span inside the div.

    // We need to switch back to the "estrutura" accordion to see the value
    const accordionEstrutura = screen.getByText(/Estrutura Geral/i)
    fireEvent.click(accordionEstrutura)

    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('toggles Golden Spiral', () => {
    render(<MandalaGenerator />)

    // Open the accordion first
    const accordionBtn = screen.getByText(/Geometria & Fractais/i)
    fireEvent.click(accordionBtn)

    const toggle = screen.getByText(/Espiral Áurea/i).previousSibling as HTMLInputElement
    expect(toggle).toBeInTheDocument()
    expect(toggle.checked).toBe(false)

    fireEvent.click(toggle)
    expect(toggle.checked).toBe(true)
  })
})
