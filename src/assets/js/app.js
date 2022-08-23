'use strict';
let $ = document;
const startBtn = $.querySelector('#start_btn');
const addTask = $.querySelector('#addTaskBtn');
const clearTasks = $.querySelector('#clearStorageBtn');
const taskList = $.querySelector('#tasks_list');
const taskInput = $.querySelector('#taskInput');
const changeContentWindow = $.querySelector('#changeTaskContent');
const newContent = $.querySelector('#newContent');
const tasks = JSON.parse(localStorage.getItem('tasks')) ?? JSON.parse('[]');
const noTaskSection = $.querySelector('.noTaskSection');
// animate__zoomOut
startBtn.addEventListener('click', function () {
  $.querySelector('#intro_page').classList.add('animate__zoomOut');
  $.querySelector('#main_page').hidden = false;
  $.body.style.overflowY = 'auto';
});
// close change task content window
changeContentWindow.firstElementChild.addEventListener('click', function () {
  this.parentElement.style.top = '-300px';
  newContent.value = null;
});
// fetch tasks from local storage
window.addEventListener('load', () => {
  if (tasks.length !== 0) {
    noTaskSection.hidden = true;
    tasks.forEach((task) => {
      taskList.appendChild(createTaskElement(task.content, task.status));
    });
  } else {
    noTaskSection.hidden = false;
  }
});
//
// create task
addTask.addEventListener('click', () => {
  noTaskSection.hidden = true;
  createTask(taskInput.value);
  taskInput.value = null;
  taskInput.focus();
});

function createTask(content) {
  if (content.trim() !== '') {
    if (isDuplicateTask(content)) {
      alert('the task is already defined');
    } else {
      taskList.appendChild(createTaskElement(content));
      addToLocalStorage(content);
    }
  } else {
    alert('task value should not be empty');
    noTaskSection.hidden = false;
  }
}

// check for duplicate value
function isDuplicateTask(taskContent) {
  let selectedTaskIndex = tasks.findIndex((task) => {
    return task.content === taskContent;
  });
  return selectedTaskIndex !== -1;
}

function createTaskElement(content, status = 'UnCompleted') {
  let taskElement = $.createElement('li');
  taskElement.className = `task_item ${status}`;
  let taskTitle = $.createElement('span');
  taskTitle.classList.add('task_title');
  taskTitle.innerHTML = content;
  // buttons
  //   change status btn
  let changeStatusBtn = $.createElement('input');
  changeStatusBtn.setAttribute('type', 'checkbox');
  changeStatusBtn.className = 'TaskStatus';
  changeStatusBtn.checked = status === 'completed' ? true : false;
  changeStatusBtn.addEventListener('click', function () {
    if (this.parentElement.classList.contains('completed')) {
      this.checked = false;
      this.parentElement.className = 'task_item';
      updateLocalStorage(this.previousElementSibling.innerHTML, 'uncompleted');
    } else {
      this.checked = true;
      this.parentElement.className = 'task_item completed';
      updateLocalStorage(this.previousElementSibling.innerHTML, 'completed');
    }
  });
  //   remove button
  let removeTaskBtn = $.createElement('button');
  removeTaskBtn.classList.add('removeTask_btn');
  let removeIcon = $.createElement('i');
  removeIcon.className = 'fa-solid fa-trash';
  removeTaskBtn.append(removeIcon);
  removeTaskBtn.addEventListener('click', function () {
    if (confirm('Are you sure ? ')) {
      this.parentElement.remove();
      removeTask(this.parentElement.firstElementChild.innerHTML);
      if (JSON.parse(localStorage.getItem('tasks')).length === 0) {
        noTaskSection.hidden = false;
      }
    }
  });
  //   edit button
  let editBtn = $.createElement('button');
  editBtn.classList.add('editTask_btn');
  let editIcon = $.createElement('i');
  editIcon.className = 'fa-solid fa-pen-to-square';
  editBtn.append(editIcon);
  editBtn.addEventListener('click', function () {
    changeContentWindow.style.top = '0';
    changeContentWindow.lastElementChild.addEventListener('click', function () {
      changeContentWindow.style.top = '-300px';
      if (newContent.value.trim() !== '') {
        updateLocalStorageContent(taskTitle.innerHTML, newContent.value);
        taskTitle.innerHTML = newContent.value;
      } else {
        alert('the input should not be empty');
      }
    });
  });
  //
  taskElement.append(taskTitle, changeStatusBtn, removeTaskBtn, editBtn);
  return taskElement;
}

function addToLocalStorage(content) {
  tasks.push({
    content: content,
    status: 'uncompleted',
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalStorage(taskContent, newStatus) {
  let selectedTaskIndex = tasks.findIndex((task) => {
    return task.content === taskContent;
  });
  let updatedTask = tasks[selectedTaskIndex];
  updatedTask.status = newStatus;
  tasks.fill(updatedTask, selectedTaskIndex, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(taskContent) {
  let selectedTaskIndex = tasks.findIndex((task) => {
    return task.content === taskContent;
  });
  tasks.splice(selectedTaskIndex, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalStorageContent(taskContent, newContent) {
  let selectedTaskIndex = tasks.findIndex((task) => {
    return task.content === taskContent;
  });
  let updatedTask = tasks[selectedTaskIndex];
  updatedTask.content = newContent;
  tasks.fill(updatedTask, selectedTaskIndex, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
// clear tasks
clearTasks.addEventListener('click', () => {
  taskList.innerHTML = null;
  localStorage.clear();
});
