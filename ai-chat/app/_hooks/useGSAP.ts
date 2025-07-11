"use client"

import { gsap } from "gsap"
import { useEffect, useRef } from "react"

export const useGSAP = () => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const animationsRef = useRef<gsap.core.Tween[]>([])

  useEffect(() => {
    // Initialize floating orb animations
    const ctx = gsap.context(() => {
      animateFloatingOrbs()
      animatePulseDot()
    })

    return () => {
      ctx.revert()

      // 全てのアニメーションをクリーンアップ
      if (timelineRef.current) {
        timelineRef.current.kill()
        timelineRef.current = null
      }

      // 個別のアニメーションもクリーンアップ
      animationsRef.current.forEach(anim => {
        if (anim?.isActive()) {
          anim.kill()
        }
      })
      animationsRef.current = []

      // will-changeプロパティをリセット
      gsap.set(".floating-orb", { willChange: "auto" })
    }
  }, [])

  const animatePageLoad = () => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Header animations with new design
      tl.fromTo(
        "#header h1",
        { opacity: 0, y: -50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }
      )
        .fromTo(
          "#header p",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(
          "#header div",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
          "-=0.4"
        )

        // Chat area animation with glass morphism
        .fromTo(
          "#chatArea",
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" },
          "-=0.8"
        )

      timelineRef.current = tl
    })

    return () => ctx.revert()
  }

  const animateAgentCards = () => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".agent-card",
        { opacity: 0, y: 30, scale: 0.9, rotationY: 15 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
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
      ease: "power2.out",
    })

    // Animate the custom radio button
    const radio = element.querySelector(".radio-custom")
    if (radio) {
      gsap.to(radio, {
        scale: isSelected ? 1.1 : 1,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
    }
  }

  const animateInputFocus = (element: HTMLElement, isFocused: boolean) => {
    gsap.to(element, {
      scale: isFocused ? 1.02 : 1,
      duration: 0.3,
      ease: "power2.out",
    })

    // Animate the gradient border effect
    const parent = element.closest(".chat-input-glass")
    if (parent) {
      gsap.to(parent, {
        boxShadow: isFocused
          ? "0 0 0 2px rgba(96, 165, 250, 0.3), 0 8px 25px rgba(96, 165, 250, 0.1)"
          : "0 4px 6px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }

  const animateButtonPress = (element: HTMLElement) => {
    return gsap.to(element, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    })
  }

  const animateMessageEntry = (element: HTMLElement) => {
    return gsap.fromTo(
      element,
      { opacity: 0, x: -30, scale: 0.9, rotationY: -10 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        rotationY: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      }
    )
  }

  const animateFloatingOrbs = () => {
    // GPU最適化のためwill-changeを設定
    gsap.set(".floating-orb", {
      willChange: "transform",
    })

    // より軽量なアニメーション（頻度を下げ、範囲を縮小）
    gsap.to(".floating-orb:nth-child(1)", {
      x: "random(-50, 50)",
      y: "random(-25, 25)",
      duration: "random(20, 30)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })

    gsap.to(".floating-orb:nth-child(2)", {
      x: "random(-75, 75)",
      y: "random(-50, 50)",
      duration: "random(25, 35)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })

    gsap.to(".floating-orb:nth-child(3)", {
      x: "random(-40, 40)",
      y: "random(-40, 40)",
      duration: "random(18, 25)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })
  }

  const animatePulseDot = () => {
    // CSS animationに移行したため、GSAPアニメーションは削除
    // .pulse-dotクラスにCSS animationが適用されている
  }

  const animateShimmer = (element: HTMLElement) => {
    // シマーエフェクトをCSS animationに変更し、動的DOM操作を削除
    element.classList.add("shimmer-effect")
  }

  const animateTypingIndicator = (element: HTMLElement) => {
    const dots = element.querySelectorAll(".typing-dot")

    gsap.to(dots, {
      opacity: 1,
      scale: 1.2,
      duration: 0.6,
      stagger: 0.2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })
  }

  const animateCardHover = (element: HTMLElement, isHover: boolean) => {
    gsap.to(element, {
      y: isHover ? -8 : 0,
      scale: isHover ? 1.02 : 1,
      rotationY: isHover ? 3 : 0,
      duration: 0.3,
      ease: "power2.out",
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
    animateCardHover,
  }
}
