const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const errorMessage = document.getElementById("errorMessage");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptyText = document.getElementById("emptyText");
const clearCompletedBtn = document.getElementById("clearCompleted");
const currentDate = document.getElementById("currentDate");
const filters = document.querySelector(".filters");

let tasks = [];
let activeFilter = "all";

function setDate() {
  currentDate.textContent = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date());
}

function showError(message = "") {
  errorMessage.textContent = message;
}

function addTask() {
  const text = taskInput.value.trim();

  if (!text) {
    showError("Please enter a task before adding it.");
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: Date.now(),
    text,
    completed: false
  });

  taskInput.value = "";
  showError("");
  activeFilter = "all";
  updateFilterButtons();
  renderTasks();
  taskInput.focus();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  renderTasks();
}

function getVisibleTasks() {
  if (activeFilter === "active") {
    return tasks.filter(task => !task.completed);
  }

  if (activeFilter === "completed") {
    return tasks.filter(task => task.completed);
  }

  return tasks;
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = `task-item${task.completed ? " completed" : ""}`;
  li.dataset.id = task.id;

  const checkButton = document.createElement("button");
  checkButton.className = "check-btn";
  checkButton.type = "button";
  checkButton.setAttribute("aria-label", task.completed ? "Mark task active" : "Mark task complete");
  checkButton.addEventListener("click", () => toggleTask(task.id));

  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = task.text;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.type = "button";
  deleteButton.innerHTML = "&#215;";
  deleteButton.setAttribute("aria-label", `Delete task: ${task.text}`);
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  li.append(checkButton, text, deleteButton);
  return li;
}

function updateEmptyState(visibleTasks) {
  if (visibleTasks.length > 0) {
    emptyState.hidden = true;
    return;
  }

  emptyState.hidden = false;

  if (tasks.length === 0) {
    emptyTitle.textContent = "No tasks yet";
    emptyText.textContent = "Add your first task above and get started.";
  } else if (activeFilter === "active") {
    emptyTitle.textContent = "All caught up";
    emptyText.textContent = "There are no active tasks right now.";
  } else if (activeFilter === "completed") {
    emptyTitle.textContent = "Nothing completed";
    emptyText.textContent = "Complete a task and it will appear here.";
  }
}

function updateFilterButtons() {
  document.querySelectorAll(".filter").forEach(button => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderTasks() {
  taskList.replaceChildren();

  const visibleTasks = getVisibleTasks();
  visibleTasks.forEach(task => {
    taskList.appendChild(createTaskElement(task));
  });

  const remaining = tasks.filter(task => !task.completed).length;
  taskCount.textContent = remaining;
  updateEmptyState(visibleTasks);
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    addTask();
  }
});

taskInput.addEventListener("input", () => {
  if (errorMessage.textContent) showError("");
});

filters.addEventListener("click", event => {
  const button = event.target.closest(".filter");
  if (!button) return;

  activeFilter = button.dataset.filter;
  updateFilterButtons();
  renderTasks();
});

clearCompletedBtn.addEventListener("click", clearCompleted);

setDate();
updateFilterButtons();
renderTasks();
