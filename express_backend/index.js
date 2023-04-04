require('dotenv').config()
const express = require('express')
const cors = require('cors')
const {sequelize} = require('./src/models/init-models')
const routes = require('./src/routes/index')

const app = express()
const port = process.env.PORT || 4100

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended :true}))

app.listen(port, ()=> console.log(`Server Start on : http://localhost:${port}`))

const dropDatabaseSync = false
sequelize.sync({force : dropDatabaseSync})
.then(()=>{
    if (!dropDatabaseSync){
        console.log('Database dont Drop')
    }
})

app.use(routes)