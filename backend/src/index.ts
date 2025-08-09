import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import qrRoutes from './routes/qr.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => res.json({ status: 'ok', name: 'Synqtra backend' }))
app.use('/qr', qrRoutes)

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Synqtra backend running on :${port}`))
