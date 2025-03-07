"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, User, MessageSquare, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface PixelMenuProps {
  isLoggedIn: boolean
  onLogout: () => void
}

export default function PixelMenu({ isLoggedIn, onLogout }: PixelMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleMenuItemClick = (path: string) => {
    setIsOpen(false)
    router.push(path)
  }

  const handleLogout = () => {
    setIsOpen(false)
    onLogout()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 border-2 border-pixel-primary dark:border-pixel-secondary bg-pixel-dark dark:bg-pixel-surface text-pixel-secondary dark:text-pixel-light hover:brightness-110 active:brightness-90 transition-all"
        aria-label="Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 border-2 border-pixel-primary dark:border-pixel-secondary bg-pixel-dark dark:bg-pixel-surface shadow-[4px_4px_0px_rgba(0,0,0,0.3)] z-50">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => handleMenuItemClick("/profile")}
                className="flex items-center w-full px-4 py-2 text-left text-pixel-light dark:text-pixel-light hover:bg-pixel-surface dark:hover:bg-pixel-dark pixel-text"
              >
                <User className="w-4 h-4 mr-2" />
                <span>PROFILE</span>
              </button>

              <button
                onClick={() => handleMenuItemClick("/")}
                className="flex items-center w-full px-4 py-2 text-left text-pixel-light dark:text-pixel-light hover:bg-pixel-surface dark:hover:bg-pixel-dark pixel-text"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                <span>CHATS</span>
              </button>

              <button
                onClick={() => handleMenuItemClick("/settings")}
                className="flex items-center w-full px-4 py-2 text-left text-pixel-light dark:text-pixel-light hover:bg-pixel-surface dark:hover:bg-pixel-dark pixel-text"
              >
                <Settings className="w-4 h-4 mr-2" />
                <span>SETTINGS</span>
              </button>

              <div className="border-t border-pixel-primary dark:border-pixel-secondary my-1"></div>

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-left text-pixel-primary dark:text-pixel-secondary hover:bg-pixel-surface dark:hover:bg-pixel-dark pixel-text"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>LOGOUT</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleMenuItemClick("/auth/login")}
                className="flex items-center w-full px-4 py-2 text-left text-pixel-light dark:text-pixel-light hover:bg-pixel-surface dark:hover:bg-pixel-dark pixel-text"
              >
                <User className="w-4 h-4 mr-2" />
                <span>LOGIN</span>
              </button>

              <button
                onClick={() => handleMenuItemClick("/auth/signup")}
                className="flex items-center w-full px-4 py-2 text-left text-pixel-light dark:text-pixel-light hover:bg-pixel-surface dark:hover:bg-pixel-dark pixel-text"
              >
                <User className="w-4 h-4 mr-2" />
                <span>SIGN UP</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

