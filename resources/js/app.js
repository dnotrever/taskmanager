$(document).ready(function () {

    // List Tasks
    var userId = $('.tasksList').data('user')
    $.ajax({
        url: '/controllers/task/tasks_list.php',
        method: 'GET',
        data: { user_id: userId },
        dataType: 'json',
        success: function(tasks) {
            var showTasks = $('.showTasks')
            var tasksList = $('.tasksList')
            var completedTasks = $('.completedTasks')
            if (tasks.length > 0) {
                tasks.forEach(function(task) {
                    var taskElement = $('<div class="task"></div>').attr('data-task', task.id)
                    var taskInfos = $('<div class="taskInfos"></div>')
                    task.status === 'pending' ?
                        taskElement.addClass('pending') :
                        taskElement.addClass('completed')
                    var checkElement = $('<div class="markTask"></div>')
                    var titleElement = $('<h3></h3>').text(task.title)
                    var descriptionElement = $('<p></p>').text(task.description)
                    var updateElement = $('<span class="updateTask">✎</span>')
                    var deleteElement = $('<span class="deleteTask">✖</span>')
                    taskElement.hasClass('completed') ?
                        checkElement.text('✓') :
                        checkElement.text('')
                    taskInfos.append(titleElement)
                    taskInfos.append(descriptionElement)
                    taskElement.append(checkElement)
                    taskElement.append(taskInfos)
                    taskElement.append(updateElement)
                    taskElement.append(deleteElement)
                    if (task.status == 'completed') {
                        completedTasks.append(taskElement)
                        taskInfos.append(`<div class="completedDate">Finalizada em: ${task.completed_at}</div>`)
                    } else {
                        tasksList.prepend(taskElement)
                        taskInfos.append(`<div class="completedDate">Criada em: ${task.created_at}</div>`)
                    }
                    completedTasks.find('#quantity').text(`(${completedTasks.children().length - 1})`)
                })
            } else {
                showTasks.html('<h5>Nenhuma tarefa criada!</h5>')
            }
        }
    })

    // Store Task
    $('.taskInsertForm').submit(function (event) {
        event.preventDefault()
        const url = '/controllers/task/task_store.php'
        const user_id = $('#user_id').val()
        const title = $('#title').val()
        const description = $('#description').val()
        $.post(
            url,
            {
                user_id: user_id,
                title: title,
                description: description
            },
            function(response) {
                if (response.status === 'success') {
                    window.location.href = '/resources/views/app/tasks.php'
                }
            },
        'json')
    })

    // Check Task
    $('.showTasks').on('click', '.markTask', function () {
        var taskElement = $(this).closest('.task')
        var taskId = taskElement.data('task')
        var status = taskElement.hasClass('pending') ? 'completed' : 'pending'
        $.ajax({
            url: '/controllers/task/task_check.php',
            method: 'POST',
            data: {
                taskId: taskId,
                status: status
            },
            success: function() {
                window.location.href = '/resources/views/app/tasks.php'
            }
        })
    })

    // Update Task
    $('.showTasks').on('click', '.updateTask', function () {
        var taskElement = $(this).closest('.task')
        var title = taskElement.find('h3').text()
        var description = taskElement.find('p').text()
        taskElement.find('.markTask').remove()
        taskElement.find('h3').html('<input type="text" class="titleInput" value="' + title + '">')
        taskElement.find('p').html('<textarea class="descriptionInput" placeholder="Opcional">' + description + '</textarea>')
        taskElement.find('.updateTask').replaceWith('<button class="saveUpdate">Salvar</button>')
        taskElement.on('click', '.saveUpdate', function () {
            var updatedTitle = taskElement.find('.titleInput').val()
            var updatedDesc = taskElement.find('.descriptionInput').val()
            if (updatedTitle) {
                const url = '/controllers/task/task_update.php'
                $.post(url,
                    {
                        task_id: taskElement.data('task'),
                        title: updatedTitle,
                        description: updatedDesc
                    },
                    function(response) {
                        if (response.status === 'success') {
                            window.location.href = '/resources/views/app/tasks.php'
                        }
                    }, 
                'json')
            }
        })
    })

    // Delete Task
    $('.showTasks').on('click', '.deleteTask', function () {
        var taskElement = $(this).closest('.task')
        var taskId = taskElement.data('task')
        $.ajax({
            url: '/controllers/task/task_delete.php',
            method: 'POST',
            data: { task_id: taskId },
            success: function() {
                window.location.href = '/resources/views/app/tasks.php'
            }
        })
    })
})