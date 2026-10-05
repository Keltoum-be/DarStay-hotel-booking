import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
// هاد اللينك غادي نجيبوه من n8n فـ Railway - غادي يكون ثابت
const CHAT_URL = import.meta.env.VITE_N8N_CHAT_URL

const ROOM_MARKER = /\[\[room:([\w-]+)\]\]/g

const WELCOME = {
  role: "bot",
  text: "Hi! Ask me about our hotels, prices or amenities.",
  roomIds: []
}

const getSessionId = () => {
  let id = sessionStorage.getItem("chatSessionId")
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem("chatSessionId", id)
  }
  return id
}

const parseReply = (raw) => ({
  text: raw.replace(ROOM_MARKER, "").replace(/\n{3,}/g, "\n\n").trim(),
  roomIds: [...new Set([...raw.matchAll(ROOM_MARKER)].map((m) => m[1]))]
})

const AIChatbot = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [rooms, setRooms] = useState([])
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    // حيدنا ngrok - دابا خدام مباشر
    fetch(`${API}/rooms`)
     .then((res) => res.json())
     .then((data) => {
        const list = data.rooms || data
        setRooms(Array.isArray(list)? list : [])
      })
     .catch(console.error)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const send = async () => {
    const chatInput = input.trim()
    if (!chatInput || loading) return

    setMessages((prev) => [...prev, { role: "user", text: chatInput }])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendMessage",
          sessionId: getSessionId(),
          chatInput
        })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const output = (Array.isArray(data)? data[0] : data)?.output?? data.output?? ""
      setMessages((prev) => [...prev, { role: "bot",...parseReply(output) }])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
       ...prev,
        { role: "bot", text: "The assistant is unavailable right now. Please try again in a moment.", roomIds: [] }
      ])
    } finally {
      setLoading(false)
    }
  }

  const openRoom = (id) => {
    navigate(`/rooms/${id}`)
    scrollTo(0, 0)
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen((open) =>!open)}
        className="fixed bottom-5 right-5 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-2xl text-white shadow-lg hover:bg-orange-700"
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-5 z-[9999] flex h-[480px] w-80 flex-col rounded-2xl border bg-white shadow-2xl md:w-[380px]">
          <div className="flex items-center justify-between rounded-t-2xl bg-orange-600 p-3 font-bold text-white">
            <span>DarStay Assistant</span>
            <button onClick={() => setIsOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              ×
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex max-w-[90%] flex-col gap-2 ${m.role === "user"? "ml-auto items-end" : "mr-auto items-start"}`}>
                <div className={`whitespace-pre-line rounded-2xl p-3 text-[13px] leading-5 ${m.role === "user"? "rounded-br-sm bg-orange-600 text-white" : "rounded-bl-sm border bg-white shadow-sm"}`}>
                  {m.text}
                </div>
                {m.roomIds?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {m.roomIds.map((id) => {
                      const room = rooms.find((r) => r._id === id)
                      return room && (
                        <button key={id} onClick={() => openRoom(id)} className="rounded-full bg-orange-600 px-3 py-1.5 text-[11px] text-white hover:bg-orange-700">
                          Book {room.roomType} · ${room.pricePerNight}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="mr-auto animate-pulse rounded-2xl rounded-bl-sm border bg-white p-3 text-[13px]">Thinking...</div>}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 rounded-b-2xl border-t bg-white p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about rooms, prices, amenities..."
              className="flex-1 rounded-full border px-4 py-2.5 text-sm outline-none focus:border-orange-600"
            />
            <button onClick={send} disabled={loading} className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50">
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AIChatbot