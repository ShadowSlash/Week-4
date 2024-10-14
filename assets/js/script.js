// Waits for the document to load before running the function
document.addEventListener("DOMContentLoaded", function () {

    // These attach the following values by referencing them to a (DOM) variable to be used later on.
    const newTaskBtn = document.getElementById("btn-1"); // This is attaching the "Create New Task" ID button to the "newTaskBtn" variable.

    const taskInput = document.getElementById("taskInput"); // This attaches the "taskInput" ID, which will be whatever the user inputs as the new task in text to the "taskInput" variable.

    const taskTableBody = document.getElementById("taskTableBody"); // This attaches the "taskTableBody" ID, which will be used later on as a reference to where the new tasks will be placed. Linking it to the "taskTableBody" Variable.

    // This line Checks if all of the necessary elements are found across the document.
    if (newTaskBtn && taskInput && taskTableBody) {

        // This creates a variable that retrieves any stored tasks from localStorage, which is where data is saved across browser sessions. But theres a logical disjunction operator "OR" that initializes an empty array if none exist
        const storedTasks = JSON.parse(localStorage.getItem("tasks")) || []; // This allows the JSON string thats stored to be turned into an array or use an empty one if no pre existing tasks are stored.

        // This loops through all of the stored task and adds it to the table.
        storedTasks.forEach(task => addTaskToTable(task)); // This repeats over each task and calls "addTaskToTable" function to add it to the table.

        // This adds an "eventListener" of "click" which means that when the "Create New Task" ("newTaskBtn" class) button is clicked then the following function is activated.
        newTaskBtn.addEventListener("click", function () {

            // This gets the task input field value.
            const newTask = taskInput.value.trim(); // The "trim", removes any leading or trailing whitespace from the input value.

            // This checks whether the "newTask" has a value and also if its unique.
            if (newTask && uniqueEx(storedTasks, newTask)) {
                const date = new Date().toLocaleDateString(); // This gets the current date from your local timezone.
                const task = { // This creates a task object.
                    status: "Incomplete", // This sets the initial status value to "Incomplete" when a new task is created.
                    description: newTask, // This sets the task description to whatever the user inputs in the text field.
                    date: date // This sets the task date to the current date of its creation.
                };

                // This adds the new "task" to the table and for it to aslo be stored.
                addTaskToTable(task); // This calls "addTaskToTable" to insert the task in the table.
                storedTasks.push(task); // And this adds the new task to the stored tasks array.
                localStorage.setItem("tasks", JSON.stringify(storedTasks)); // This then saves  the updated tasks array to the localStorage on your browser.
            }
            taskInput.value = ""; // Clears the input field after adding a task.
        });
        // This function checks if any "newTask" is unique against the "storedTask" array.
        function uniqueEx(storedTasks, newTask) {
            for (let exTask of storedTasks) { // This iterates (repeats) over each task in the "storedTask" array.
                if (exTask.description === newTask) { // This is what checks if the task description value matches the the ones in the array.
                    console.log("Cannot add the same Task") // Adds a message to the console log of "Cannot add the same Task" if there is a match
                    return false; // This returns false to indicate that the task is not unique which pushes the console log message and stops you from adding the task.
                }
            }
            return true; // And this returns if the new task is unique allowing you to add a new task.
        };
        
        // This is the funtion that adds a new task to the "taskTableBody"
        function addTaskToTable(task) {
            const newTr = document.createElement("tr") // This creates a new "tr", table row element attaching it to the "newTr" variable.

            // This sets the "innerHTML" of the newly created "tr" with the task details and adds 3 new buttons which have class attached to a function.
            newTr.innerHTML = `
                <td class="taskStatus" style="color: ${task.status === "Complete" ? "green" : "red"}">${task.status}</td> 
                <td class="taskDesc">${task.description}</td>
                <td>${task.date}</td>
                <td>
                    <button class="complete-btn">Complete</button> 
                    <button class="editBtn">Edit</button>
                    <button class="deleteBtn">Delete Task</button>
                </td>
            `; // The 3 buttons are all grouped under 1 "td" so they all appear under 1 column. The rest are all structured with an individual "td" so they appear in individual columns. "?" acts as an if else statement, where if "Complete" is shown as green and if its something else then it will appear as red.
            
            // This adds the new row to the "taskTableBody" by appending it under the created "newTr".
            taskTableBody.appendChild(newTr);

            // Here it now adds a "eventListener", again of "click", to the "complete-Btn" class and a funtion to follow.
            newTr.querySelector(".complete-btn").addEventListener("click", function() {
                newTr.classList.toggle("completed"); // This toggles the "completed" class on the row where the task belong too.
                task.status = newTr.classList.contains("completed") ? "Complete" : "Incomplete"; // This updates the "task.status" based on the class.
                newTr.querySelector(".taskStatus").textContent = task.status; // This updates the displayed text for the new "taskStatus".
                newTr.querySelector(".taskStatus").style.color = task.status === "Complete" ? "green" : "red"; // This is what will change the color of the text from green to red or vice versa depending on the value.
                this.remove(); // This removes the button from the row when its pressed to be more user friendly.
                newTr.querySelector(".editBtn").remove(); // This uses a "querySelector" to grab the edit button for it to also be removed when the complete button is pressed.
                localStorage.setItem("tasks", JSON.stringify(storedTasks)); // This stores the updated task again showing it changed to "Completed" with the "complete-Btn" and "edit-Btn" removed from the row.
            });
            // This adds and "eventListener" to the "eventBtn" class and a funtion to follow.
            newTr.querySelector(".editBtn").addEventListener("click", function() {
                const taskDesc = newTr.querySelector(".taskDesc"); // This will select the task description cell which is a collection of all "td" or "th" elements in a table.
                const newDesc = taskDesc.textContent; // This stores the new description in the "newDesc" variable.

                // This replaces the "innerHTML" of the task description with a input field and 2 buttons (Save and Cancel).
                taskDesc.innerHTML = `
                    <input type="text" value="${newDesc}">
                    <button class="saveBtn">Save</button>
                    <button class="cancelBtn">Cancel</button>
                `;
                // This adds another "eventListener" to the "saveBtn" class and a funtion to follow.
                newTr.querySelector(".saveBtn").addEventListener("click", function() {
                    const updateDesc = taskDesc.querySelector("input").value.trim(); // This will grab the value of the input field using "trim" to remove any added whitespacing and attaching it to the "updateDesc" variable.

                    if (updateDesc) { // This checks if the "updateDesc" has a value.
                        taskDesc.innerHTML = updateDesc; // This will update the task description cell with the new value.
                        task.description = updateDesc; // This will update the task object with the new description.
                        localStorage.setItem("tasks", JSON.stringify(storedTasks)); // This then saves the updated tasks to localStorage again.
                    } 
                        else {
                            taskDesc.innerHTML = newDesc // This is will revert to the original description if the input has no value.
                        }
                });
                // This adds an "eventListener" to the "cancelBtn" class and a funtion to follow.
                newTr.querySelector(".cancelBtn").addEventListener("click", function() {
                    taskDesc.innerHTML = newDesc // This will restore the original description if the button is pressed which cancels the action.
                });
            });
            // This adds an "eventlistener" to the "deleteBtn" class and a funtion to follow.
            newTr.querySelector(".deleteBtn").addEventListener("click", function() {
                newTr.remove(); // This removes the entire task row from the table.
                const taskOrder = storedTasks.indexOf(task); // This will find the task's index in the "storedTasks" array.
                if (taskOrder > -1) {
                    storedTasks.splice(taskOrder, 1); // This will remove the task from the array.
                    localStorage.setItem("tasks", JSON.stringify(storedTasks)); // And finally this will now Save and Update the tasks to the "localStorage".
                }
            })
        }
    }
});