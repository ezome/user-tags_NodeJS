require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes')
const errorHandler = require('./middlewares/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 8080

process.on('uncaughtException', (err) => {
    console.log('Ошибка: ' + err.message);
    process.exit(1);
})

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
}) 