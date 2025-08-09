import { useState } from 'react'
import QRCode from 'react-qr-code'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface QRCodeDialogProps {
  value: string
}

const QRCodeDialog = ({ value }: QRCodeDialogProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">My QR</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Synqtra QR</DialogTitle>
          <DialogDescription>Let others scan to connect & complete challenges.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-6">
          <div className="rounded-lg p-4 bg-card border shadow-sm">
            <QRCode value={value} size={192} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QRCodeDialog
