
// A function to collect the data from the task form
// returns the data + an id of the task
function collectData() {
    const description = document.getElementById(`description`).value
    const date = document.getElementById(`date`).value
    const time = document.getElementById(`time`).value

    return {
        id: Date.now(),
        description,
        date,
        time,
    }
}

// A function for generating a new HTML with the current data input
// returns a string HTML
function generateHTML(data, isNewTask = false) {
    // The "isNewTask" flag is to make sure if its a new task added or is it an old one being loaded
    // The "data-id" us so that the delete function could identify the DOM needed to be deleted
    const newHTML = `
        <div class="task ${isNewTask ? 'fadeIn' : ''}" ${isNewTask ? 'onanimationend="this.classList.remove(\'fadeIn\')"' : ''}  data-id="${data.id}">
                <div id="closeButtonContainer">
                    <img src="/assets/images/X.png" onclick="deleteTask(${data.id})">
                </div>
                <div>${data.description}</div>
                <div>${data.date}</div>
                <div>${data.time}</div>
            </div>
    `
    return newHTML
}

// A function that adds a new HTML to the task container
function renderHTML(newHTML) {
    const tasks = document.getElementById(`tasksContainer`)
    tasks.innerHTML += newHTML
}

// A function for clearing the form after we add a new task
function clearForm() {
    // Clears it
    const taskForm = document.getElementById(`tasksForm`)
    taskForm.reset()

    //Set it on the textarea 
    const descriptionInput = document.getElementById(`description`)
    descriptionInput.focus()
}

// A function to save a task i gets(taskObject) to the local storage
function saveTaskToLocalStorage(taskObject) {
    //Get JSON from local storage
    const currentTasksInStorageJSON = localStorage.getItem(`tasks`)

    //Converts JSON to JavaScript object
    const currentTasksInStorage = JSON.parse(currentTasksInStorageJSON)

    //The object we got is an array, push another item to the array
    currentTasksInStorage.push(taskObject)

    //Converts it back to JSON and saves it back to the local storage
    localStorage.setItem(`tasks`, JSON.stringify(currentTasksInStorage))
}

// A function for the first time we run the program that creates an empty array for us to add tasks into
function initStorage() {
    const currentTaskJSON = localStorage.getItem(`tasks`)
    if (!currentTaskJSON) {
        localStorage.setItem(`tasks`, JSON.stringify([]))
    }
}

// The function that loads the tasks and discards the expired ones
function loadTasksFromLocalStorage() {
    const taskJSON = localStorage.getItem(`tasks`)

    if (taskJSON) {
        const tasks = JSON.parse(taskJSON)
        //A for loop that filters the expired tasks
        for (const task of tasks) {
            if (!isExpired(task.date, task.time)) {
                const newHTML = generateHTML(task)
                renderHTML(newHTML)
            }
        }
    }

}

function isExpired(date, time) {
    // Get the current date and time
    const now = new Date();

    // Combine the date and time from the task
    const dueDateTime = new Date(`${date}T${time}`);

    // Check if the due date and time are earlier than now
    return dueDateTime < now;
}

function getNumberOfTasksInLocalStorage() {
    return JSON.parse(localStorage.getItem(`tasks`)).length
}

// Deletes the task the user press X on from the local storage & the DOM
function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem(`tasks`));
    const newTasks = []

    // The discardation of the deleted task
    for (const task of tasks) {
        if (id !== task.id) {
            newTasks.push(task)
        }
    }
    localStorage.setItem(`tasks`, JSON.stringify(newTasks));

    // The discardation of the DOM
    const taskElement = document.querySelector(`.task[data-id="${id}"]`);
    if (taskElement) {
        taskElement.remove();
    }
}

// A function that adds a new task and validates if the time&date are currect
function addTask(event) {
    event.preventDefault()
    const data = collectData()
    if (!isExpired(data.date, data.time)) {
        const newHTML = generateHTML(data, true)
        renderHTML(newHTML)
        saveTaskToLocalStorage(data)
        clearForm()
    } else {
        alert(`The time is past due date`)
    }
}

// The start of the program 
initStorage()
loadTasksFromLocalStorage()
