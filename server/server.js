import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import userRoutes from './routes/user.js'
import serviceRoutes from './routes/services.js'
import testRoutes from './routes/test.js'
import reviewRoutes from './routes/review.js'
import appointmentRoutes from './routes/appointments.js'
import requestRoutes from './routes/requests.js'

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' })
} else {
  dotenv.config()
}

const app = express()
const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV === 'test') {
  app.use('/api/test', testRoutes)
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

app.use(cors({
  origin: 'https://delightful-flower-08c627f1e.6.azurestaticapps.net/',
  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', userRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/requests', requestRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
