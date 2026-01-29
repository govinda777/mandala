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
  scale: vi.fn(),
}))

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLCanvasElement.prototype.getContext = mockGetContext as any
})

describe('MandalaGenerator', () => {
  it('renders correctly', () => {
    render(<MandalaGenerator />)
    expect(screen.getByText(/Pétalas/i)).toBeInTheDocument()
    expect(screen.getByText(/Gerar Mandala Aleatória/i)).toBeInTheDocument()
  })

  it('toggles Fibonacci mode', () => {
    render(<MandalaGenerator />)
    const toggle = screen.getByLabelText(/Modo Fibonacci/i)
    expect(toggle).toBeInTheDocument()
    expect(toggle).not.toBeChecked()

    fireEvent.click(toggle)
    expect(toggle).toBeChecked()
  })

  it('toggles Breathing Animation', () => {
    render(<MandalaGenerator />)
    const toggle = screen.getByLabelText(/Animação de Respiração/i)
    expect(toggle).toBeInTheDocument()
    expect(toggle).not.toBeChecked()

    fireEvent.click(toggle)
    expect(toggle).toBeChecked()
  })

  it('toggles Fractal Mode', () => {
    render(<MandalaGenerator />)
    const toggle = screen.getByLabelText(/Modo Fractal/i)
    expect(toggle).toBeInTheDocument()
    expect(toggle).not.toBeChecked()

    fireEvent.click(toggle)
    expect(toggle).toBeChecked()
  })

  it('snaps petal count to Fibonacci numbers when mode is enabled', () => {
    render(<MandalaGenerator />)
    const toggle = screen.getByLabelText(/Modo Fibonacci/i)
    const petalInput = screen.getByLabelText(/Pétalas:/i)

    // Set petals to 10 (not Fibonacci)
    fireEvent.change(petalInput, { target: { value: '10' } })

    // Enable Fibonacci mode
    fireEvent.click(toggle)

    // Should snap to 8 or 13 (nearest). 8 is closer to 10.
    // However, the implementation might force update immediately.
    // Let's check if the displayed value updates.

    // We expect the display to show a Fibonacci number.
    // 3, 5, 8, 13, 21.
    // 10 is between 8 and 13.

    // Let's assume we implement it to snap to nearest.
    expect(screen.getByText(/Pétalas: 8/i)).toBeInTheDocument() // or 13
  })

  it('toggles Golden Spiral', () => {
    render(<MandalaGenerator />)
    const toggle = screen.getByLabelText(/Espiral Áurea/i)
    expect(toggle).toBeInTheDocument()
    expect(toggle).not.toBeChecked()

    fireEvent.click(toggle)
    expect(toggle).toBeChecked()
  })
})
