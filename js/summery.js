let tasks;

function init() {
    includeHTML();
    setTimeout(loadFirstLettersFromSessionStorage, 20);
    loadTasks();
    writeNumberOfAllTasks();
    filterHighestPrio();
    countStatements('toDo');
    countStatements('done');
    countStatements('inProgress');
    countStatements('awaitFeedback');
}

function loadTasks() {
    tasks = JSON.parse(sessionStorage.getItem('tasks'));
}

function writeNumberOfAllTasks() {
    document.getElementById('numberOfTasksInBoard').innerHTML = tasks.length;
}

function filterHighestPrio() {
    let highestPrio = "Urgent";
    let count = tasks.reduce(function (acc, tasks) {
        return tasks.prio === highestPrio ? acc + 1 : acc;
    }, 0);
    document.getElementById('highestPrio').innerHTML = count;
}

function countStatements(index) {
    let statementCounts = 0;
    tasks.forEach(task => {
        if (task.statement === index) {
            statementCounts++;
        }
    });
    document.getElementById(`count${index}`).innerHTML = statementCounts;
}