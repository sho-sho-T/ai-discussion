import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const ChatInput = ({
  value,
  onChange,
  placeholder = "AIエージェントに相談したいことを入力してください...",
}: ChatInputProps) => {
  const inputContainerRef = useRef<HTMLDivElement>(null)

  const { contextSafe } = useGSAP(
    () => {
      gsap.set(".input-border", { scaleX: 0 })
    },
    { scope: inputContainerRef }
  )

  const handleFocus = contextSafe(() => {
    gsap.to(".chat-input-glass", {
      boxShadow: "0 8px 32px rgba(59, 130, 246, 0.2)",
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out",
    })
    gsap.to(".input-border", {
      scaleX: 1,
      duration: 0.3,
      ease: "power2.out",
    })
  })

  const handleBlur = contextSafe(() => {
    gsap.to(".chat-input-glass", {
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    })
    gsap.to(".input-border", {
      scaleX: 0,
      duration: 0.3,
      ease: "power2.out",
    })
  })

  return (
    <div
      ref={inputContainerRef}
      className="chat-input-glass rounded-3xl p-6 mb-10 shadow-lg relative"
    >
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none resize-none text-gray-700 placeholder-gray-400"
        rows={3}
      />
      <div className="input-border absolute bottom-0 left-0 h-0.5 bg-blue-500 w-full origin-left" />

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-400">{value.length} / 1000</span>
      </div>
    </div>
  )
}

export default ChatInput
