'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ChatMessage, StudentProfile, ECPResult } from '@/lib/types'
import { Send, Loader2, Trash2, MessageCircle } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AIMentorChatProps {
  studentProfile?: StudentProfile
  ecpResult?: ECPResult
  onClose?: () => void
}

export function AIMentorChat({ studentProfile, ecpResult, onClose }: AIMentorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Initial greeting
  useEffect(() => {
    const greeting: ChatMessage = {
      role: 'assistant',
      content: `Hi! I'm your DISHA AI mentor. I'm here to help you with your international education journey. ${
        studentProfile
          ? `I can see you have an ECP score of ${ecpResult?.score}. What would you like to know about universities, funding, or your education path?`
          : "Tell me about your academic background and I'll help you find the perfect university."
      }`,
    }
    setMessages([greeting])
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setError(null)

    try {
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          studentProfile,
          ecpResult,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      // Add error message to chat
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content:
          "I'm sorry, I encountered an issue. Please try again or check if your API key is properly configured.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat cleared. How can I help you with your education journey?",
      },
    ])
  }

  return (
    <Card className="bg-card border border-border flex flex-col h-full max-h-96 md:max-h-full">
      {/* Header */}
      <div className="border-b border-border/30 p-4 flex justify-between items-center bg-muted/20">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">AI Mentor</h3>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClearChat}
            className="hover:bg-muted/50"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button size="sm" variant="ghost" onClick={onClose} className="hover:bg-muted/50">
              ✕
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="space-y-4" ref={scrollRef}>
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary/20 border border-primary/30 text-foreground'
                      : 'bg-muted/30 border border-muted/50 text-foreground/90'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-muted/30 border border-muted/50 px-4 py-2 rounded-lg flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-foreground/60">Thinking...</span>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-destructive/10 border border-destructive/30 text-destructive text-sm p-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border/30 p-4 bg-muted/10">
        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading}
            className="bg-input border-border/50 text-foreground placeholder:text-foreground/50"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Card>
  )
}
