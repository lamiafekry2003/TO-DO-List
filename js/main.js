let input = document.querySelector(".input");
let submit = document.querySelector(".add");
let tasks = document.querySelector(".tasks");
//
// empty arrey
let arrayOfTasks = [];

// Check if Theres Tasks In Local Storage
if (localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
}
getDataFromLocal();

// add task 
submit.onclick = function () {
  if (input.value !== "") {
    addTaskToArray(input.value); // Add Task To Array Of Tasks
    input.value = "";
    showAlert("Task added successfully!", "success"); // Show success alert
  } else {
    showAlert("Please enter a task!", "error");
  }
};
// fun to add tasks in array of task
function addTaskToArray(taskText) {
  // task info
  const task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  };
  // push task to array of task
  arrayOfTasks.push(task);
  // Add tasks to page
  addTaskToPage(arrayOfTasks);
  // add to localstorage
  addToLocalStorage(arrayOfTasks);
}

// fun clik on task
tasks.addEventListener("click", (e) => {
    // to delete
  if (e.target.classList.contains("fa-trash")) {
    const taskDiv = e.target.parentElement.parentElement; // Get the task div
    const taskId = taskDiv.getAttribute("data_id"); // Get the task id
    deletTask(taskId);
  }
  // to completed state 
  if (e.target.classList.contains("task")) {
    toggleCompletedTask(e.target.getAttribute("data_id"));
    e.target.classList.toggle("done"); 
  }

  // Handle the edit icon click
  if (e.target.classList.contains("fa-edit")) {
    const taskDiv = e.target.parentElement.parentElement; 
    const taskId = taskDiv.getAttribute("data_id");
    const taskText = taskDiv.firstChild.textContent; // Get the current task text

    // Create an input field to edit the task
    const input = document.createElement("input");
    input.type = "text";
    input.value = taskText;
    input.className = "edit-input";
    input.style.borderColor='#FFF8F3'
    input.style.outline='none'
    input.style.borderRadius='6px'

    // Replace the task text with the input field
    taskDiv.firstChild.replaceWith(input);

    // Add a save button for updating the task
    let saveBtn = document.createElement("button");
    saveBtn.className = "save-btn";
    saveBtn.textContent = "Save";
    taskDiv.appendChild(saveBtn);

    // Handle save button click
    saveBtn.addEventListener("click", () => {
      const newTaskText = input.value;
      if (newTaskText.trim() !== "") {
        updateTask(taskId, newTaskText); // Call update function
      }
    });
  }
});
// update
function updateTask(id, newText) {
  // Find the task by id and update its text
  arrayOfTasks = arrayOfTasks.map((task) => {
    if (task.id == id) {
      task.title = newText;
      showAlert("Task updated successfully!", "success");
    }
    return task;
  });
  addToLocalStorage(arrayOfTasks); // Update local storage
  addTaskToPage(arrayOfTasks); // Re-render the task list
}
// Function to toggle task completion status
function toggleCompletedTask(id) {
  arrayOfTasks = arrayOfTasks.map((task) => {
    if (task.id == id) {
      task.completed = !task.completed;
      showAlert("Task updated successfully!", "success");
    }
    return task;
  });
  addToLocalStorage(arrayOfTasks); // Save updated tasks to local storage
}

// dele task
function deletTask(id) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != id);
  addToLocalStorage(arrayOfTasks); //overridding on local storage'
  addTaskToPage(arrayOfTasks);
  showAlert("Task removed successfully!", "success");
}

// fun to Add tasks to page
function addTaskToPage(arrayOfTasks) {
  // empty tasks div in page to add new tasks
  tasks.innerHTML = "";

  // do looping in array to show
  arrayOfTasks.forEach((task) => {
    let div = document.createElement("div");
    div.className = "task";

    // task is done
    if (task.completed) {
      div.className = "task done";
    }

    // to identify each div by id
    div.setAttribute("data_id", task.id);
    div.appendChild(document.createTextNode(task.title));

    // Create Delete icon
    let span = document.createElement("span");
    span.className = "del";
    let icon = document.createElement("i");
    icon.className = "fa-solid fa-trash";
    let iconUp = document.createElement("i");
    span.className = "edit";
    iconUp.className = "fa-solid fa-edit";

    span.appendChild(icon);
    span.appendChild(iconUp);
    div.appendChild(span);

    // Append the div to the parent tasks
    tasks.appendChild(div);
  });
  
}

// Add Task To Localstorage
function addToLocalStorage(arrayOfTasks) {
  window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}
// get all data from localstorage
function getDataFromLocal() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addTaskToPage(tasks);
  }
}

// Alert

function showAlert(message, type = "success") {
  // Create alert div
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert ${type}`;
  alertDiv.textContent = message;

  // Append alert to the alert container
  const alertContainer = document.querySelector(".alert-container");
  alertContainer.appendChild(alertDiv);

  // Slide the alert in by adding the 'show' class
  setTimeout(() => {
    alertDiv.classList.add("show");
  }, 100);

  setTimeout(() => {
    alertDiv.classList.remove("show");
    setTimeout(() => {
      alertDiv.remove();
    }, 500);
  }, 3000);
}
