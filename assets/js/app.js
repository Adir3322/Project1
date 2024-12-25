
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
function generateHTML(data) {
    const newHTML = `
     <div class="task">
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
            const newHTML = generateHTML(task)
            renderHTML(newHTML)
        }
    }

    //needs to asure tasks time and to not show it if expired
}

function getNumberOfTasksInLocalStorage() {
    return JSON.parse(localStorage.getItem(`tasks`)).length
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem(`tasks`));
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem(`tasks`, JSON.stringify(tasks));

    // Re-render tasks
    document.getElementById(`tasksContainer`).innerHTML = '';
    loadTasksFromLocalStorage();
}

function addTask(event) {
    event.preventDefault()
    const data = collectData()
    const newHTML = generateHTML(data)
    renderHTML(newHTML)
    saveTaskToLocalStorage(data)
    clearForm()
}

initStorage()
loadTasksFromLocalStorage()
