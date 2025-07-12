import { useRef } from "react"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  onPress?: () => void
  variant?: "primary" | "secondary"
}

const AnimatedButton = ({ 
  children, 
  onPress, 
  disabled,
  variant = "primary",
  className = "",
  ...props 
}: AnimatedButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  const { contextSafe } = useGSAP(() => {
    gsap.set(".button-bg", { scale: 1 })
    gsap.set(".button-ripple", { scale: 0, opacity: 0 })
  }, { scope: buttonRef })
  
  const handleClick = contextSafe(async () => {
    if (disabled) return
    
    // クリックアニメーション
    await gsap.to(buttonRef.current, { 
      scale: 0.95, 
      duration: 0.1,
      ease: "power2.inOut"
    })
    gsap.to(buttonRef.current, { 
      scale: 1, 
      duration: 0.2,
      ease: "back.out(1.7)"
    })
    
    // 背景波紋効果
    gsap.fromTo(".button-ripple", 
      { scale: 0, opacity: 1 },
      { scale: 4, opacity: 0, duration: 0.6, ease: "power2.out" }
    )
    
    onPress?.()
  })
  
  const baseClasses = `
    relative overflow-hidden font-bold rounded-full shadow-lg 
    hover:shadow-xl transform transition-all duration-300 
    disabled:opacity-50 disabled:cursor-not-allowed
  `
  
  const variantClasses = {
    primary: "px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white",
    secondary: "px-8 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200"
  }
  
  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <div className="button-bg absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0" />
      <div className="button-ripple absolute inset-0 bg-white rounded-full" />
      <span className="relative z-10 flex items-center justify-center gap-3">
        {children}
      </span>
    </button>
  )
}

export default AnimatedButton