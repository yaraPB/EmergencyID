'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Download, Copy, Check } from 'lucide-react'

interface QRDisplayProps {
  url: string
  profileName?: string
}

export default function QRDisplay({ url, profileName }: QRDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 240,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
    }
  }, [url])

  const downloadQR = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `emergency-qr-${profileName?.toLowerCase().replace(/\s+/g, '-') || 'id'}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{
        background: 'white',
        padding: '16px',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        position: 'relative',
        border: '4px solid var(--surface-border)'
      }}>
        <canvas ref={canvasRef} style={{ borderRadius: '12px' }} />
        <div style={{
          position: 'absolute', top: -10, right: -10,
          background: 'var(--coral)', color: 'white',
          padding: '4px 10px', borderRadius: '100px',
          fontSize: '0.65rem', fontWeight: 800,
          boxShadow: '0 4px 10px rgba(232,83,58,0.3)'
        }}>
          LIVE QR
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={downloadQR} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <Download size={14} />
          Save Image
        </button>
        <button onClick={copyUrl} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          {copied ? <Check size={14} color="var(--green)" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>


    </div>
  )
}
