const express = require('express')
const app = express()
const fs = require('fs')
const port = 3000
const bodyParser = require('body-parser')
const urlEncoded = bodyParser.urlencoded({ extended: false })

app.set('views', 'views')
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(urlEncoded)
app.use(bodyParser.json())

var rawData = fs.readFileSync('students.json')
var data = JSON.parse(rawData)

app.get('/', (request, response) => {
    response.render('admin')
})

app.get('/graph', (request, response) => {
    response.render('graph')
})

app.get('/grades', (request, response) => {
    response.send(data)
})

app.delete('/deleteStudent', (request, response) => {
    // console.log(request.query)
    const { id } = request.query
    const found = data.filter(student => student.id == id)
    if (found.length) {
        data = data.filter(student => student != found[0])
        fs.writeFileSync('students.json', JSON.stringify(data, null, 2));
        return response.status(200).json({
            message: 'Student Successfully deleted'
        })
    }
    return response.status(404).json({
        message: 'Cannot find the user'
    })
})

app.put('/updateStudent', (request, response) => {
    const { id, name,score } = request.query
    const found = data.filter(student => student.id == id)
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (found[0] == element) {
            element.score = score
            element.name = name
            fs.writeFileSync('students.json', JSON.stringify(data, null, 2));
            return response.status(200).json({
                message: 'User updated successfully'
            })
        }
    }
    return response.status(404).json({
        message: 'User not found'
    })
})

app.post('/student', (request, response) => {
    console.log(request.body)
    const {id} = request.body
    try {
        const found = data.filter(student => student.id == id)
        if (found.length) {
            return response.status(403).json({
                message: ' User already exists'
            })
        }
        data.push(request.body);
        fs.writeFileSync('students.json', JSON.stringify(data, null, 2));
        return response.status(200).json({
            message: 'Successful insertion'
        })
    } catch (error) {
        console.log(error)
        return response.status(500).json({
            message: 'error while inserting'
        })
    }
})

app.listen(port, () => console.log(`Server is listening on port ${port}`))