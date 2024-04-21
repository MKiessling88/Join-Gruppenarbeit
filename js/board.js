let finishedSubTasks = [];
let currentDraggedElement;
async function init_board() {
  await loadTasksKaloyan();
  //await loadTasks();
  includeHTML();
  loadNewTasks();
  loadContacts();
}

async function loadTasksKaloyan() {
  try {
    tasks = JSON.parse(await getItem("tasksKaloyan"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

function returnHtmlShowToDos(singleTask, i, id) {
  return /*html*/ `
    <div class="task-card" draggable="true" ondragstart='startDragging(${id})' onclick="showCurrentTask(${i})">
        <div class="task-card-category">
            <span id="categoryField${i}" class="which-category">
                ${singleTask["category"]}
            </span>
        </div>
        
        <div class="header-area-card">
            <div class="ft-weight-700">
                ${singleTask["title"]}
            </div>
            <div class="">
                ${singleTask["description"]}
            </div>
        </div>

        <div class="subtasks-contacts">
            <div class="subtasks-loadbar-number">
                <span><i>loadbar must to do</i></span>
                <div class="number-done-subtasks">
                    <span>${finishedSubTasks.length}/</span>
                    <span>${singleTask["subTasks"].length} Subtasks</span>
                </div>
            </div>

            <div class="contacts-area">
                <div id="contactsFieldBoard(${i})" class="contacts-board"></div>
                <div id="prioField${i}" class="prio-field">
                    ${singleTask["prio"]}
                </div>
            </div>
        </div>
        `;
}

async function loadNewTasks() {
  checkedUsers = JSON.parse(await getItem("checkedUsers"));
  let toDoField = document.getElementById("categoryToDo");
  let inProgressField = document.getElementById("categoryInProgress");
  let awaitFeedbackField = document.getElementById("categoryAwaitFeedback");
  let doneField = document.getElementById("categoryDone");

  toDoField.innerHTML = "";
  inProgressField.innerHTML = "";
  awaitFeedbackField.innerHTML = "";
  doneField.innerHTML = "";
  for (i = 0; i < tasks.length; i++) {
    let singleTask = tasks[i];
    let id = tasks[i]["id"];
    let category = tasks[i]["statement"];
    if (category == "toDo") {
      toDoField.innerHTML += returnHtmlShowToDos(singleTask, i, id);
    } else if (category == "inProgress") {
      inProgressField.innerHTML += returnHtmlShowToDos(singleTask, i, id);
    } else if (category == "awaitFeedback") {
      awaitFeedbackField.innerHTML += returnHtmlShowToDos(singleTask, i, id);
    } else if (category == "done") {
      doneField.innerHTML += returnHtmlShowToDos(singleTask, i, id);
    }
    chooseCategoryColor(i);
  }
}

function chooseCategoryColor(i) {
  let categoryField = document.getElementById(`categoryField${i}`);
  let singleTaskCategory = tasks[i]["category"];

  if (singleTaskCategory == "Technical Task") {
    categoryField.classList.add("bg-color-technical-task");
  } else {
    categoryField.classList.add("bg-color-user-story");
  }
  whichPriorityTaskCard(i);
}

function whichPriorityTaskCard(i) {
  let prioField = document.getElementById(`prioField${i}`);
  let singleTaskPrio = tasks[i]["prio"];

  prioField.innerHTML = "";

  if (singleTaskPrio == "Low") {
    prioField.innerHTML =
      '<img src="' + "/img/low_green.png" + '" alt="Bildbeschreibung">';
  } else if (singleTaskPrio == "medium") {
    prioField.innerHTML =
      '<img src="' + "/img/medium_orange.png" + '" alt="Bildbeschreibung">';
  } else {
    prioField.innerHTML =
      '<img src="' + "/img/urgent_red.png" + '" alt="Bildbeschreibung">';
  }
  renderContactsBoard(i);
}

function showCurrentTask(i) {
  let backgroundDialog = document.getElementById("backgroundDialog");
  let dialogField = document.getElementById("taskOverlay");
  let currentTask = tasks[i];

  backgroundDialog.classList.toggle("background-dialog");
  dialogField.innerHTML = "";
  dialogField.innerHTML = returnHtmlCurrentTask(currentTask, i);
  chooseCategoryColor(i);
  whichPriorityTaskCard(i);
  renderContactsBoard(i);
  renderSubTasksBoard(i);
}

function renderSubTasksBoard(i) {
  let subTasksField = document.getElementById(`subTasksField${i}`);
  let subTasks = tasks[i]["subTasks"];
  subTasksField.innerHTML = "";

  for (j = 0; j < subTasks.length; j++) {
    let subTask = subTasks[j];
    subTasksField.innerHTML += returnHtmlSubtasks(subTask);
  }
  renderContactsBoard(i);
}
function renderContactsBoard(i) {
  let contactsFieldBoard = document.getElementById(`contactsFieldBoard(${i})`);
  let contactsForTask = tasks[i]["assignedTo"];
  contactsFieldBoard.innerHTML = "";
}
function renderContactsBoard(i) {
  let contactsFieldBoard = document.getElementById(`contactsFieldBoard(${i})`);
  let contactsForTask = tasks[i]["assignedTo"];
  contactsFieldBoard.innerHTML = "";

  for (j = 0; j < contactsForTask.length; j++) {
    let contactForTask = contactsForTask[j];
    contactsFieldBoard.innerHTML += returnHtmlContacts(contactForTask, j);
    //backgroundColorInitialsBoard(i, j);
  }
}

function backgroundColorInitialsBoard(i, j) {
  let initialArea = document.getElementById(`initialArea${j}`);
  let colorNumber = tasks[i]["checkedUsers"][j]["color"];
  let bgColor = contactColor[colorNumber];
  initialArea.style.backgroundColor = bgColor;
  initialArea.removeAttribute("id");
}

function returnHtmlCurrentTask(overlayTask, i) {
  return `
    <div class="overlay-first-row">
        <div class="overlay-category" id="categoryField${i}">${overlayTask["category"]}</div>
        <a onclick="showCurrentTask()">X</a>
    </div>
    <div class="overlay-title">
        ${overlayTask["title"]}
    </div>
    <div class="overlay-description font-overlay">
        ${overlayTask["description"]}
    </div>
    <div class="overlay-date font-overlay">
        <span>Due Date:</span>
        <span>${overlayTask["dueDate"]}</span>
    </div>
    <div class="overlay-prio font-overlay">
        <span>Priority:</span>
        <div class="prio-name-image">
            <span>${overlayTask["prio"]}</span>
            <div id="prioField${i}"></div>
        </div>
    </div>
    <div class="overlay-assigned font-overlay">
        <span>Assigned To:</span>
        <div id="contactsFieldBoard(${i})" class="overlay-assigned-contacts"></div>
    </div>
    <div class="overlay-subtasks font-overlay">
    <span>Subtasks</span>
    <div id="subTasksField${i}" class="input-subtasks-overlay"></div>
</div>
    </div>`;
}

function returnHtmlSubtasks(subTask) {
  return `
    <label class="style-sub-tasks font-overlay-subtasks" for="box${i}">
    <input type="checkbox">${subTask}</label>`;
}

function returnHtmlContacts(contactForTask, j) {
  return `
    <div id="initialArea${j}" class="contact-board">${contactForTask["nameInitials"]}</div>`;
}

//###################################################################################
//*********************Kaloyan's Code fängt hier an!!!*******************************
//###################################################################################

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(event) {
  event.preventDefault();
}

function moveElementTo(newCategory) {
  tasks[getIndexOfElement(currentDraggedElement)].statement = newCategory;
  loadNewTasks();
  setItem("tasksKaloyan", JSON.stringify(tasks));
}

function getIndexOfElement(id) {
  let index = 0;
  for (i = 0; i < tasks.length; i++) {
    if (tasks[i]["id"] == id) {
      index = i;
    }
  }
  return index;
}
