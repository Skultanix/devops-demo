const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

app.use(express.json())
app.use(cors())

var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '192aa468e5094f0f891873d38827f9a5',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

rollbar.log('Hello world!')

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    rollbar.info("HTML has served successfully")
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/students', (req, res) => {
    rollbar.info("It would seem that the list of students has loaded.")
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           rollbar.log("Student added successfully.",{author: "Caleb", type: "manual entry"})
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
           rollbar.error("No name was provided")
           res.status(400).send('You must enter a name.')
       } else {
           rollbar.error("Student already exists.")
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    res.status(200).send(students)
})

app.use(rollbar.errorHandler())

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
