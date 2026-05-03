'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, Database, Globe } from 'lucide-react'
import { Input } from './ui/input'
import { autocompleteSearch, ingestEntity, AutocompleteResult } from '@/lib/api'

export function DynamicSearchBar({ onSelect }: { onSelect: (entity: any) => void }) {
  const [query, setQuery] = useState('')
  const [localResults, setLocalResults] = useState<AutocompleteResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isIngesting, setIsIngesting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Fetch autocomplete on debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setLocalResults([])
      return
    }
    
    const handler = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await autocompleteSearch(query)
        setLocalResults(res || [])
      } catch (err) {
        console.error(err)
      } finally {
        setIsSearching(false)
      }
    }, 400)
    
    return () => clearTimeout(handler)
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleIngest = async (entityName: string) => {
    setIsIngesting(true)
    setIsOpen(false)
    try {
      const response = await ingestEntity(entityName, 'university')
      // Successfully ingested new university, trigger onSelect
      onSelect(response.college)
      setQuery('')
    } catch (err) {
      console.error(err)
      alert("Failed to scrape and extract data for this university. Try another one.")
    } finally {
      setIsIngesting(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for a university (e.g. Stanford University)"
          className="pl-10 h-14 bg-white/[0.03] border-white/10 text-base"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 animate-spin" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 right-0 mt-2 bg-black border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
          >
            <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto">
              {localResults.length > 0 && (
                <div className="text-xs font-semibold text-white/30 uppercase tracking-wider px-3 pb-2 pt-2">
                  Database Matches
                </div>
              )}
              
              {localResults.map(res => (
                <button
                  key={res.id}
                  onClick={() => {
                    onSelect(res)
                    setIsOpen(false)
                    setQuery('')
                  }}
                  className="w-full text-left px-3 py-3 hover:bg-white/[0.05] rounded-lg transition-colors flex items-center justify-between group"
                >
                  <div>
                    <div className="font-semibold">{res.name}</div>
                    <div className="text-xs text-white/40">{res.country}</div>
                  </div>
                  <Database className="w-4 h-4 text-white/20 group-hover:text-emerald-400" />
                </button>
              ))}

              <div className="border-t border-white/[0.04] mt-2 pt-2">
                <button
                  onClick={() => handleIngest(query)}
                  disabled={isIngesting}
                  className="w-full text-left px-3 py-3 hover:bg-white/[0.05] rounded-lg transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-400" />
                    <div>
                      <div className="font-semibold text-indigo-100 placeholder">Search the Web</div>
                      <div className="text-xs text-indigo-400/60">Scrape & extract "{query}"</div>
                    </div>
                  </div>
                  <Search className="w-4 h-4 text-white/20 group-hover:text-indigo-400" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen Loading Overlay for Extraction phase */}
      <AnimatePresence>
        {isIngesting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                Discovering University
              </h3>
              <p className="text-white/40 text-sm mt-2 max-w-xs mx-auto">
                Our AI agents are scraping official portals and extracting program fees, admissions, and ROI signals...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}