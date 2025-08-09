import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

interface QRScannerDialogProps {
  onScan: (value: string) => void
}

const QRScannerDialog = ({ onScan }: QRScannerDialogProps) => {
  const [open, setOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (!open) return

    let cancelled = false
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        streamRef.current = stream
        const video = videoRef.current!
        video.srcObject = stream
        await video.play()

        const scan = () => {
          if (cancelled) return
          const v = videoRef.current
          const c = canvasRef.current
          if (!v || !c) {
            rafRef.current = requestAnimationFrame(scan)
            return
          }
          const w = v.videoWidth
          const h = v.videoHeight
          if (w === 0 || h === 0) {
            rafRef.current = requestAnimationFrame(scan)
            return
          }
          c.width = w
          c.height = h
          const ctx = c.getContext('2d')!
          ctx.drawImage(v, 0, 0, w, h)
          const imageData = ctx.getImageData(0, 0, w, h)
          const code = jsQR(imageData.data, w, h)
          if (code?.data) {
            try {
              onScan(code.data)
              toast({ title: 'QR scanned', description: 'Interaction captured.' })
            } finally {
              setOpen(false)
            }
          } else {
            rafRef.current = requestAnimationFrame(scan)
          }
        }

        rafRef.current = requestAnimationFrame(scan)
      } catch (err: any) {
        toast({ title: 'Camera error', description: err?.message ?? 'Unable to access camera', variant: 'destructive' })
      }
    }

    start()

    return () => {
      cancelled = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [open, onScan])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Scan QR</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Scan someone’s QR</DialogTitle>
          <DialogDescription>Point your camera at the QR code to verify an interaction.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <video ref={videoRef} className="w-full rounded-md border" muted playsInline />
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QRScannerDialog
