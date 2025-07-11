"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export const useGSAP = () => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    // Initialize floating orb animations
    const ctx = gsap.context(() => {
      animateFloatingOrbs()
      animatePulseDot()
    })

    return () => {
      ctx.revert()
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [])

  const animatePageLoad = () => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      
      // Header animations with new design
      tl.fromTo("#header h1", 
        { opacity: 0, y: -50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }
      )
      .fromTo("#header p", 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6"
      )
      .fromTo("#header div", 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }, "-=0.4"
      )
      
      // Chat area animation with glass morphism
      .fromTo("#chatArea", 
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }, "-=0.8"
      )

      timelineRef.current = tl
    })

    return () => ctx.revert()
  }

  const animateAgentCards = () => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".agent-card", 
        { opacity: 0, y: 30, scale: 0.9, rotationY: 15 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          rotationY: 0,
          duration: 0.8, 
          stagger: 0.1, 
          ease: "back.out(1.7)" 
        }
      )
    })

    return () => ctx.revert()
  }

  const animateAgentSelection = (element: HTMLElement, isSelected: boolean) => {
    gsap.to(element, {
      scale: isSelected ? 1.05 : 1,
      y: isSelected ? -5 : 0,
      rotationY: isSelected ? 5 : 0,
      duration: 0.4,
      ease: "power2.out"
    })

    // Animate the custom radio button
    const radio = element.querySelector('.radio-custom')
    if (radio) {
      gsap.to(radio, {
        scale: isSelected ? 1.1 : 1,
        duration: 0.3,
        ease: "back.out(1.7)"
      })
    }
  }

  const animateInputFocus = (element: HTMLElement, isFocused: boolean) => {
    gsap.to(element, {
      scale: isFocused ? 1.02 : 1,
      duration: 0.3,
      ease: "power2.out"
    })

    // Animate the gradient border effect
    const parent = element.closest('.chat-input-glass')
    if (parent) {
      gsap.to(parent, {
        boxShadow: isFocused 
          ? "0 0 0 2px rgba(96, 165, 250, 0.3), 0 8px 25px rgba(96, 165, 250, 0.1)"
          : "0 4px 6px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  const animateButtonPress = (element: HTMLElement) => {
    return gsap.to(element, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    })
  }

  const animateMessageEntry = (element: HTMLElement) => {
    return gsap.fromTo(element, 
      { opacity: 0, x: -30, scale: 0.9, rotationY: -10 },
      { 
        opacity: 1, 
        x: 0, 
        scale: 1, 
        rotationY: 0,
        duration: 0.6, 
        ease: "back.out(1.7)" 
      }
    )
  }

  const animateFloatingOrbs = () => {
    gsap.to(".floating-orb:nth-child(1)", {
      x: "random(-100, 100)",
      y: "random(-50, 50)",
      duration: "random(15, 25)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })

    gsap.to(".floating-orb:nth-child(2)", {
      x: "random(-150, 150)",
      y: "random(-100, 100)",
      duration: "random(20, 30)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })

    gsap.to(".floating-orb:nth-child(3)", {
      x: "random(-75, 75)",
      y: "random(-75, 75)",
      duration: "random(12, 18)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })
  }

  const animatePulseDot = () => {
    gsap.to(".pulse-dot", {
      scale: 1.3,
      opacity: 0.6,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    })
  }

  const animateShimmer = (element: HTMLElement) => {
    const shimmerDiv = document.createElement('div')
    shimmerDiv.className = 'absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent'
    element.appendChild(shimmerDiv)

    gsap.to(shimmerDiv, {
      x: "200%",
      duration: 2,
      repeat: -1,
      ease: "none"
    })
  }

  const animateTypingIndicator = (element: HTMLElement) => {
    const dots = element.querySelectorAll('.typing-dot')
    
    gsap.to(dots, {
      opacity: 1,
      scale: 1.2,
      duration: 0.6,
      stagger: 0.2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    })
  }

  const animateCardHover = (element: HTMLElement, isHover: boolean) => {
    gsap.to(element, {
      y: isHover ? -8 : 0,
      scale: isHover ? 1.02 : 1,
      rotationY: isHover ? 3 : 0,
      duration: 0.3,
      ease: "power2.out"
    })
  }

  return {
    animatePageLoad,
    animateAgentCards,
    animateAgentSelection,
    animateInputFocus,
    animateButtonPress,
    animateMessageEntry,
    animateFloatingOrbs,
    animatePulseDot,
    animateShimmer,
    animateTypingIndicator,
    animateCardHover
  }
}