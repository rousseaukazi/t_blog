'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchableDropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option..."
}: SearchableDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  )

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-24 md:h-28 w-full items-center border-b-4 border-gray-900 bg-transparent px-6 md:px-8 text-2xl placeholder:text-gray-500 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          !value && "text-gray-500"
        )}
      >
        <span className="truncate">{value || placeholder}</span>
      </button>
      
      {open && (
        <div className="absolute z-50 left-0 top-full w-full border-x-4 border-b-4 border-gray-900 bg-white rounded-b-md shadow-lg">
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-gray-400 focus:outline-none"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No results found</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option)
                    setOpen(false)
                    setSearch('')
                  }}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center px-3 py-2 text-sm hover:bg-gray-100",
                    value === option && "bg-gray-100"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{option}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
} 