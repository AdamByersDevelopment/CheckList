import { initializeApp } from 'firebase/app';
import { doc, getDocs, addDoc, updateDoc, getFirestore, collection } from
"firebase/firestore";
import log from "loglevel";

// Set the log level (trace, debug, info, warn, error)
log.setLevel("info");
// Example logs
log.info("Application started");
log.debug("Debugging information");
log.error("An error occurred");

function addTask(task) {
    try {
        // Log user action
        log.info(`Task added: ${task}`);
        // Add task to the list
        tasks.push(task);
        renderTasks();
    } catch (error) {
        // Log error
        log.error("Error adding task", error);
    }
}

const firebaseConfig = {
  apiKey: "AIzaSyDmRxpQK6dQS3BHgq2mEEvig3b2FpSWn1A",
  authDomain: "info5146-69ab2.firebaseapp.com",
  projectId: "info5146-69ab2",
  storageBucket: "info5146-69ab2.firebasestorage.app",
  messagingSenderId: "842639763455",
  appId: "1:842639763455:web:01bd3c16f53403e1b3a9ca",
  measurementId: "G-D41KHR2Q5X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Add Task
addTaskBtn.addEventListener('click', async () => {
    const task = taskInput.value.trim();
    if (task) {
        const taskInput = document.getElementById("taskInput");
        const taskText = sanitizeInput(taskInput.value.trim());
        addTask(taskText);

        if (taskText) {
            await addTaskToFirestore(taskText);
            renderTasks();
            taskInput.value = "";
        }
        renderTasks();
    }
});

async function addTaskToFirestore(taskText) {
    await addDoc(collection(db, "todos"), {
        text: taskText,
        completed: false
    });
}

// Retrieving the to-do list
async function renderTasks() {
    var tasks = await getTasksFromFirestore();
    taskList.innerHTML = "";
    
    tasks.forEach((task, index) => {
        if(!task.data().completed){
            const taskItem = document.createElement("li");
            taskItem.id = task.id;
            taskItem.textContent = task.data().text;
            taskList.appendChild(taskItem);
        }
    });
}

async function getTasksFromFirestore() {
    var data = await getDocs(collection(db, "todos"));
    let userData = [];
    data.forEach((doc) => {
        userData.push(doc);
    });
    return userData;
}

// Remove Task on Click
taskList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.remove();
    }
});

window.addEventListener('error', function (event) {
    console.error('Error occured: ', event.message);
});

const sw = new URL('service-worker.js', import.meta.url)
if ('serviceWorker' in navigator) {
const s = navigator.serviceWorker;
s.register(sw.href, {
scope: '/YOUR_REPOSITORY_NAME_HERE/'
})
.then(_ => console.log('Service Worker Registered for scope:', sw.href,
'with', import.meta.url))
.catch(err => console.error('Service Worker Error:', err));
}

function sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
}