'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useStudent } from '@/lib/student-context'
import { streamChat } from '@/lib/api'
import type { ChatMessage } from '@/lib/types'
import { Send, Loader2, Trash2, Sparkles, X } from 'lucide-react'

interface AIMentorChatProps {
  onClose?: () => void
}

export function AIMentorChat({ onClose }: AIMentorChatProps) {
  const { studentId, profile, ecpResult } = useStudent()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Initial greeting
  useEffect(() => {
    if (profile && ecpResult) {
      setMessages([{
        role: 'assistant',
        content: `Hi ${profile.name.split(' ')[0]}! I've reviewed your ECP Score of ${ecpResult.score} and your ₹${ecpResult.fundingBandLower}L–₹${ecpResult.fundingBandUpper}L funding band. I see you're targeting ${profile.targetProgram} programs in ${profile.targetCountry}. What would you like to explore — university options, loan details, or your admission strategy?`
      }])
    } else {
      setMessages([{ role: 'assistant', content: "Hi! Complete your ECP assessment first so I can give you personalized advice about universities and funding." }])
    }
  }, [profile, ecpResult])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming || !studentId) return

    const userMsg: ChatMessage = { role: 'user', content: input }
    const updated = [...messages, userMsg]
    setMessages([...updated, { role: 'assistant', content: '' }])
    setInput('')
    setIsStreaming(true)

    abortRef.current = new AbortController()

    try {
      let accumulated = ''
      await streamChat(
        studentId,
        updated,
        (text) => {
          accumulated += text
          setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: accumulated }])
        },
        undefined,
        (errMsg) => {
          setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: `I'm having trouble connecting. ${errMsg}` }])
        },
        abortRef.current.signal
      )
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        const fallback = ecpResult
          ? `Based on your ECP Score of ${ecpResult.score} and funding band of ₹${ecpResult.fundingBandLower}L–₹${ecpResult.fundingBandUpper}L, I'd recommend focusing on programs where total cost stays within your band. Would you like me to detail the loan structure for any specific university?`
          : "I'm temporarily unavailable. Please try again in a moment."
        setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: fallback }])
      }
    } finally {
      setIsStreaming(false)
    }
  }, [input, isStreaming, studentId, messages, ecpResult])

  return (
    <Card className="bg-black border border-white/[0.08] flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-white/[0.06] p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">DISHA AI Mentor</h3>
            <p className="text-[10px] text-green-400/60">● Knows your ECP profile</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={() => setMessages([messages[0]])} className="w-7 h-7 hover:bg-white/5">
            <Trash2 className="w-3.5 h-3.5 text-white/40" />
          </Button>
          {onClose && (
            <Button size="icon" variant="ghost" onClick={onClose} className="w-7 h-7 hover:bg-white/5">
              <X className="w-3.5 h-3.5 text-white/40" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-white text-black rounded-br-sm'
                    : 'bg-white/[0.05] text-white/90 border border-white/[0.06] rounded-bl-sm'
                }`}>
                  {msg.content || <span className="text-white/30 animate-pulse">●●●</span>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isStreaming && messages[messages.length - 1]?.content === '' && (
            <div className="flex justify-start">
              <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin text-white/40" />
                <span className="text-xs text-white/40">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder={studentId ? "Ask about loans, universities, or your admission..." : "Complete ECP first..."}
            disabled={isStreaming || !studentId}
            className="bg-white/[0.03] border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:border-white/20"
          />
          <Button
            size="icon"
            onClick={sendMessage}
            disabled={isStreaming || !input.trim() || !studentId}
            className="bg-white text-black hover:bg-white/90 shrink-0"
          >
            {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Card>
  )
}
