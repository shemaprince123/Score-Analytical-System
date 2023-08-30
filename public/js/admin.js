//This functions is used in order to get the list of students and grades
async function getGrades(){
    const response = await fetch('/grades')
    const data = await response.json()
    console.log(data)
    populateTable(data)
}

getGrades()

//This functions creates the table with all the students 
function populateTable(students){
    let table = document.getElementById('table')
    for (let i = 0; i < students.length; i++) {
        // console.log(students[i])
        var row = document.createElement('tr')
        
        let ID = document.createElement('td')
        let textID = document.createTextNode(students[i].id)
        ID.appendChild(textID)

        let Name = document.createElement('td')
        let textName = document.createTextNode(students[i].name)
        Name.appendChild(textName)

        let score = document.createElement('td')
        let textScore = document.createTextNode(students[i].score)
        score.appendChild(textScore)

        let actions = document.createElement('td')

        //The edit button is been created
        let editButton = document.createElement('button')
        editButton.innerText = 'EDIT'

        // When the button is clickd it triggers the editAcion function and gives it the student details as arguments
        editButton.setAttribute('onclick', `editAction("${students[i].id}","${students[i].name}","${students[i].score}")`)

        //It also triggers a modal box which contains the student details
        editButton.setAttribute('data-toggle', 'modal')
        editButton.setAttribute('data-target','#editScore')

        let deleteButton = document.createElement('button')
        deleteButton.innerText = 'DELETE'
        
        // When the button is clickd it triggers the deleteAction function and gives it the student ID as arguments
        deleteButton.setAttribute('onclick', `deleteAction("${students[i].id}")`)

        //It also triggers a modal box which contains the student ID and asks for confirmation
        deleteButton.setAttribute('data-toggle', 'modal')
        deleteButton.setAttribute('data-target','#confirmBox')

        actions.appendChild(editButton)
        actions.appendChild(deleteButton)

        row.appendChild(ID)
        row.appendChild(Name)
        row.appendChild(score)
        row.appendChild(actions)
        table.appendChild(row)    
    }

}

//This function is responsible for setting the student details into the modal box for editing
function editAction(id,name,score){
    console.log(id,score)
    document.getElementById('studID').value = id
    document.getElementById('studName').value = name
    document.getElementById('studScore').value = score
}

// This function is responsible to insert the student id in the confirmation Box
function deleteAction(id){
    console.log(id)
    document.getElementById('stud').innerText =  id
}

// This function is called when the user confrims the delete of the student
// This function hits the backend server and gives it the ID of the student as a query
// Refer to index.js and look for the delete method that uses the same url
async function deleteStudent(){
    const id = document.getElementById('stud').innerText
    const response = await fetch(`/deleteStudent?id=${id}`,{method:'DELETE'})
    const data = await response.json()
    if(response.status == 200){
        document.getElementById('close').click()
        document.getElementById('table').innerHTML = ''
        getGrades()
    }
    if(response.status == 400){
        alert(data.message)
    }
}

//This function is called when the form is submitted and will hit the /updateStudent url and gives it the id and score of the student as query
// The ID and score and been picked but the student ID can't be changed
async function updateStudent(){
    const id = document.getElementById('studID').value
    const score = document.getElementById('studScore').value
    const name = document.getElementById('studName').value
    const response = await fetch(`/updateStudent?id=${id}&name=${name}&score=${score}`,{method:'PUT'})
    const data = await response.json()
    if(response.status == 200){
        document.getElementById('close3').click()
        alert(data.message)
        document.getElementById('table').innerHTML = ''
        getGrades()
    }
    if(response.status == 400){
        alert(data.message)
    }
}

async function addStudent(){
    const student = {
        id:document.getElementById('Student_ID').value,
        score: document.getElementById('Student_Score').value
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(student)
    }
    const response = await fetch('/student', options);
    const data =await response.json()
    if(response.status == 200){
        alert(data.message)
        document.getElementById('close2').click()
        document.getElementById('table').innerHTML = ''
        getGrades()
    }
    // fetchStudents();
}

document.getElementById('insert-form').addEventListener('submit', e=>{
    e.preventDefault()
    addStudent()
})
        
// This is an event listenenr that waits for the update form to be submited and calls the updateStudent function
document.getElementById('updateForm').addEventListener('submit',e=>{
    e.preventDefault()
    updateStudent()
})