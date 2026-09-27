import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../api.js'

export default function ChatBox() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || sending) return

    setError('')
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setInput('')
    setSending(true)

    try {
      const res = await sendChatMessage(trimmed)
      setMessages((prev) => [...prev, { role: 'assistant', text: res.data.response }])
    } catch (err) {
      setError('The assistant is unavailable right now. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="chat-section">
      <h2>Ask the Assistant</h2>

      <div className="chat-messages">
        {messages.length === 0 && !sending && (
          <p className="status-message">
            Ask about students, courses, or how many are enrolled.
          </p>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble chat-bubble-${msg.role}`}>
            {msg.text}
          </div>
        ))}

        {sending && (
          <div className="chat-bubble chat-bubble-assistant chat-bubble-pending">
            Thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && <p className="form-error server-error">{error}</p>}

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question..."
          disabled={sending}
        />
        <button type="submit" className="btn btn-primary" disabled={sending || !input.trim()}>
          Send
        </button>
      </form>
    </section>
  )
}
