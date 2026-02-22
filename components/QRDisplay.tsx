'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Download, Link2, Check } from 'lucide-react'

interface QRDisplayProps {
  url: string
  profileName?: string
}

export default function QRDisplay({ url, profileName }: QRDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, url, {
      width: 220,
      margin: 2,
      color: {
        dark: '#0d1b2a',
        light: '#ffffff',
      },
    })
  }, [url])

  const downloadQR = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `emergency-id-${profileName?.toLowerCase().replace(/\s/g, '-') || 'qr'}.png`
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{
        background: 'white',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <canvas ref={canvasRef} />
        {/* Corner marks */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => {
          const [v, h] = pos.split('-')
          return (
            <div key={pos} style={{
              position: 'absolute',
              [v]: 8, [h]: 8,
              width: 16, height: 16,
              borderTop: v === 'top' ? '2px solid var(--coral)' : 'none',
              borderBottom: v === 'bottom' ? '2px solid var(--coral)' : 'none',
              borderLeft: h === 'left' ? '2px solid var(--coral)' : 'none',
              borderRight: h === 'right' ? '2px solid var(--coral)' : 'none',
            }} />
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={downloadQR} className="btn-secondary" style={{ padding: '9px 16px', fontSize: '0.82rem' }}>
          <Download size={14} />
          Download
        </button>
        <button onClick={copyLink} className="btn-secondary" style={{ padding: '9px 16px', fontSize: '0.82rem' }}>
          {copied ? <Check size={14} color="var(--green)" /> : <Link2 size={14} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 240 }}>
        Print this and keep it in your wallet, or save it to your phone's lock screen
      </p>
    </div>
  )
}
