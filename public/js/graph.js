async function getGrades() {
    const response = await fetch('/grades')
    const data = await response.json()
    makeGraph(data)
    makeGraph2(calculateMedian(data),calculateMedian(data),calculateMode(data))
    makeGraph3(data)
}

getGrades()

function calculateMedian(students) {
    const marks = students.map(student => parseInt(student.score))
    const sortedMarks = marks.sort((a, b) => a - b)
    const length = sortedMarks.length
    if (length % 2 == 0) {
        const median = (sortedMarks[length / 2] + sortedMarks[(length / 2) - 1]) / 2
        return median
    }
    else {
        const median = sortedMarks[(length - 1) / 2]
        return median
    }
}

function calculateAverage(students) {
    const marks = students.map(student => parseInt(student.score))
    const sum = marks.reduce((total, curr) => total + curr)
    const length = marks.length
    const avg = sum / length
    return avg
}

function calculateMode(students) {
    const data = students.map(student => parseInt(student.score))
    let frequency = {};
    let maxFrequency = 0;
    let mode;
    data.forEach((elem)=>{
        frequency[elem] = (frequency[elem] || 0) + 1;
        if (frequency[elem] > maxFrequency) {
            maxFrequency = frequency[elem];
            mode = elem;
        }
    });
    return mode;
}

function makeGraph(students) {
    const labels = students.map(student => student.name)
    const data = students.map(student => student.score)
    const green = "#006b57"
    const yellow = "#fdd55a"
    const barColors = []
    for (let i = 0; i < data.length; i++) {
        (i + 1) % 2 == 0 ? barColors.push(yellow) : barColors.push(green)
    }
    new Chart("chart", {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: barColors,
                data: data
            }]
        },
        options: {
            legend: { display: false },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
            },
            title: {
                display: true,
                text: "Student Score",
            }
        }
    });
}

function makeGraph2(mean,median,mode) {
    const data = [mean,median,mode]
    const barColors = ["#006b57","#fdd55a","#000000"]
    const labels = ["Mean", "Median", "Mode"]
    new Chart("chart2", {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: barColors,
                data: data
            }]
        },
        options: {
            legend: { display: false },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
            },
            title: {
                display: true,
                text: "Data analysis",
            }
        }
    });
}


function makeGraph3(students) {
    const labels = students.map(student => student.name)
    const score = students.map(student => student.score)
    new Chart("chart3", {
        type: "line",
        data:{
            labels: labels,
            datasets: [{
            //   backgroundColor: 'rgb(250,0,0)',
            //   borderColor: '#000',
              borderWidth: 1,
              data: score,
            }]
        },
        options: {
            legend: { display: false },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
            },
            title: {
                display: true,
                text: "Student Score",
            }
        }
    });
}