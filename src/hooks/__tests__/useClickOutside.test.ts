import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRef } from 'react'
import useClickOutside from '../useClickOutside'

describe('useClickOutside', () => {
  it('calls handler when clicking outside the element', () => {
    const handler = vi.fn()
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement | null>(null)
      useClickOutside(ref, handler)
      return ref
    })

    const div = document.createElement('div')
    Object.defineProperty(result.current, 'current', {
      value: div,
      writable: true,
    })

    const outsideElement = document.createElement('button')
    document.body.appendChild(outsideElement)

    outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)

    document.body.removeChild(outsideElement)
  })

  it('does not call handler when clicking inside the element', () => {
    const handler = vi.fn()
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement | null>(null)
      useClickOutside(ref, handler)
      return ref
    })

    const div = document.createElement('div')
    const insideElement = document.createElement('button')
    div.appendChild(insideElement)

    Object.defineProperty(result.current, 'current', {
      value: div,
      writable: true,
    })

    insideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

    expect(handler).not.toHaveBeenCalled()
  })

  it('cleans up event listener on unmount', () => {
    const handler = vi.fn()
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement | null>(null)
      useClickOutside(ref, handler)
      return ref
    })

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })
})
