// Elements
const inputBox = document.getElementById("task");
const timeBox = document.getElementById("time");
const dateBox = document.getElementById("date");
const addButton = document.getElementById("add");
const taskList = document.getElementById("taskList");
const removeBtn = document.getElementById("del");
const msg = document.getElementById("msg");

// Load from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Show on load
showTasks();

// Add Button
addButton.addEventListener("click", addTask);

// Enter Key
inputBox.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// Add Task
function addTask() {
  let text = inputBox.value.trim();
  let time = timeBox.value;
  let date = dateBox.value;

  if (text === "" || time === "" || date === "") {
    alert("Please fill all fields!");
    return;
  }

  let newTask = {
    text,
    time,
    date,
    completed: false
  };

  tasks.push(newTask);

  inputBox.value = "";
  timeBox.value = "";
  dateBox.value = "";

  saveAndUpdate();
}

// Show Tasks
function showTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {

    let li = document.createElement("li");

    if (task.completed) {
      li.classList.add("completed");
    }

    // Number + Text
    let span = document.createElement("span");
span.className="task-num";
span.innerText=index+1+". ";

let textspan = document.createElement("span");
textspan.innerText=
`${task.text} |⏱️${task.time} |🗓️${task.date}`;
    
    // Done Button
    let doneBtn = document.createElement("button");
    doneBtn.innerText = "✔️";

    doneBtn.onclick = () => toggleTask(index);

    // Edit Button
    let editBtn = document.createElement("button");
    editBtn.innerText = "✏️";

    editBtn.onclick = () => editTask(index);

    // Delete Button
    let delBtn = document.createElement("button");
    delBtn.innerText = "❌";

    delBtn.onclick = () => deleteTask(index);

    // Add in li
   
    li.appendChild(span);
     li.appendChild(textspan);
    li.appendChild(doneBtn);
    li.appendChild(editBtn);
    li.appendChild(delBtn);

    taskList.appendChild(li);
  });
}

// Toggle Complete
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveAndUpdate();
}

// Delete
function deleteTask(index) {
  tasks.splice(index, 1);
  saveAndUpdate();
}

// Edit
function editTask(index) {
  let task = tasks[index];

  let newText = prompt("Edit Task:", task.text);
  let newTime = prompt("Edit Time:", task.time);
  let newDate = prompt("Edit Date:", task.date);

  if (newText && newTime && newDate) {
    task.text = newText;
    task.time = newTime;
    task.date = newDate;

    saveAndUpdate();
  }
}

// Save + Refresh
function saveAndUpdate() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  showTasks();
}


// Remove Last Task Button
removeBtn.addEventListener("click", function () {

  if (tasks.length === 0) {
    alert("No task to remove!");
    return;
  }

  tasks.pop(); // Last task delete
  saveAndUpdate();
});

msg.innerText = "✅ Task Added Successfully!";

setTimeout(() => {
  msg.innerText = "";
}, 2000);