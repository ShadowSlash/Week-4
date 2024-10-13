document.addEventListener("DOMContentLoaded", function () {
    const newTaskBtn = document.getElementById("btn-1");
    const taskInput = document.getElementById("taskInput");
    const taskTableBody = document.getElementById("taskTableBody");

    if (newTaskBtn && taskInput && taskTableBody) {
        const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        storedTasks.forEach(task => addTaskToTable(task));

        newTaskBtn.addEventListener("click", function () {
            const newTask = taskInput.value.trim();
            if (newTask && uniqueEx(storedTasks, newTask)) {
                const date = new Date().toLocaleDateString();
                const task = { 
                    status: "Incomplete", 
                    description: newTask, 
                    date: date
                };
                addTaskToTable(task);
                storedTasks.push(task);
                localStorage.setItem("tasks", JSON.stringify(storedTasks));
            }
            taskInput.value = "";
        });

        function uniqueEx(storedTasks, newTask) {
            for (exTask of storedTasks) {
                if (exTask.description === newTask) {
                    console.log("Cannot add the same Task")
                    return false;
                }
            }
            return true;
        };
        

        function addTaskToTable(task) {
            const newTr = document.createElement("tr")

            newTr.innerHTML = `
                <td class="taskStatus" style="color ${task.status === "Complete" ? "green" : "red"}";>${task.status}</td> 
                <td class="taskDesc">${task.description}</td>
                <td>${task.date}
                <td>
                    <button class="complete-btn">Complete</button>
                    <button class="editBtn">Edit</button>
                    <button class="deleteBtn">Delete Task</button>
                </td>
            `;
            
            taskTableBody.appendChild(newTr);

            newTr.querySelector(".complete-btn").addEventListener("click", function() {
                newTr.classList.toggle("completed");
                task.status = newTr.classList.contains("completed") ? "Complete" : "Incomplete";
                newTr.querySelector(".taskStatus").textContent = task.status;
                newTr.querySelector(".taskStatus").style.color = task.staus === "Complete" ? "green" : "red";
                this.remove();
                newTr.querySelector(".editBtn").remove();
                localStorage.setItem("tasks", JSON.stringify(storedTasks));
            });

            newTr.querySelector(".editBtn").addEventListener("click", function() {
                const taskDesc = newTr.querySelector(".taskDesc");
                const newDesc = taskDesc.textContent;

                taskDesc.innerHTML = `
                    <input type="text" value="${newDesc}">
                    <button class="saveBtn">Save</button>
                    <button class="cancelBtn">Cancel</button>
                `;

                newTr.querySelector(".saveBtn").addEventListener("click", function() {
                    const updateDesc = taskDesc.querySelector("input").value.trim();
                    if (updateDesc) {
                        taskDesc.innerHTML = updateDesc;
                        task.description = updateDesc;
                        localStorage.setItem("task", JSON.stringify(storedTasks));
                    } 
                        else {
                            taskDesc.innerHTML = newDesc
                        }
                });

                newTr.querySelector(".cancelBtn").addEventListener("click", function() {
                    taskDesc.innerHTML = newDesc
                });
            });
        
            newTr.querySelector(".deleteBtn").addEventListener("click", function() {
                newTr.remove();
                const taskOrder = storedTasks.indexOf(task);
                if (taskOrder > -1) {
                    storedTasks.splice(taskOrder, 1);
                    localStorage.setItem("task", JSON.stringify(storedTasks));
                }
            })
        }
    }
});