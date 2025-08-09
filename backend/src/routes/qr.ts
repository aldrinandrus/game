import { Router } from 'express'

const router = Router()

router.post('/verify', (req, res) => {
  const { from, to, challengeId, signature } = (req.body ?? {}) as any
  if (!from || !to || !challengeId) {
    return res.status(400).json({ ok: false, error: 'Missing fields' })
  }
  // TODO: Implement proper verification (EIP-712 or server-signed tokens)
  return res.json({ ok: true, message: 'Verified (stub)' })
})

export default router
