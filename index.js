const express = require('express')
const app = express()

const PORT = 8080

app.get('/', (req, res) => {
    res.send("좀비 테스트 서버입니다.")
})

app.listen(PORT, () => {
    console.log(PORT + ' is listening...')
})