import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import route from './routes/posts_routes.js'
import userRoute from './routes/user_routes.js'
import dotenv from 'dotenv'

const port = process.env.PORT || 5000
const app = express()
dotenv.config()
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(cors())
app.use('/posts', route)
app.use('/user', userRoute)
app.get('/', (req, res) => {
  res.send('Hey There!!')
})


mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(port, () => {
      console.log(`server is running on port ${port}`)
    }),
  )
  .catch((error) => console.log(error))
