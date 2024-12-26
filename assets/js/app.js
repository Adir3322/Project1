
function collectData(index) {
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

function generateHTML(data, isNewTask = false) {
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

function renderHTML(newHTML) {
    const tasks = document.getElementById(`tasksContainer`)
    tasks.innerHTML += newHTML
}

function clearForm() {
    const taskForm = document.getElementById(`tasksForm`)
    taskForm.reset()

    const descriptionInput = document.getElementById(`description`)
    descriptionInput.focus()
}

function saveTaskToLocalStorage(taskObject) {
    // get JSON from local storage
    const currentTasksInStorageJSON = localStorage.getItem(`tasks`)

    //converst JSON to JavaScript object
    const currentTasksInStorage = JSON.parse(currentTasksInStorageJSON)

    //the object i got is an array, push another item to the array
    currentTasksInStorage.push(taskObject)

    //save it back to the local storage
    localStorage.setItem(`tasks`, JSON.stringify(currentTasksInStorage))
}

function initStorage() {
    const currentTaskJSON = localStorage.getItem(`tasks`)
    if (!currentTaskJSON) {
        localStorage.setItem(`tasks`, JSON.stringify([]))
    }
}

function loadTasksFromLocalStorage() {
    const taskJSON = localStorage.getItem(`tasks`)

    if (taskJSON) {
        const tasks = JSON.parse(taskJSON)
        for (const task of tasks) {
            if (!isExpired(task.date, task.time)) {
                const newHTML = generateHTML(task)
                renderHTML(newHTML)
            }
        }
    }

    //needs to asure tasks time and to not show it if expired
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

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem(`tasks`));
    const newTasks = []
    // tasks = tasks.filter(task => task.id !== id);
    for (const task of tasks) {
        if (id !== task.id) {
            newTasks.push(task)
        }
    }
    localStorage.setItem(`tasks`, JSON.stringify(newTasks));

    // deletes tasks

    const taskElement = document.querySelector(`.task[data-id="${id}"]`);
    if (taskElement) {
        taskElement.remove();
    }
}


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

initStorage()
loadTasksFromLocalStorage()
