import express from 'express'
import cors from 'cors'
import Routes from './routes/index.js';

const app = express()

app.use(express.json());
app.use(cors())

app.use("/api", Routes)

app.listen("4000", () => {
    console.log(`Server running at port 4000`)
})