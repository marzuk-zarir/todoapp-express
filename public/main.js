// Enable bootstrap 5 tooltip everywhere
const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
)
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
        template:
            '<div class="tooltip" role="tooltip"><div class="tooltip-inner bg-success"></div></div>',
        placement: 'right'
    })
})

const flash = document.querySelector('[role="flash"]')
const remember = document.querySelector('#remember')
const todoColors = document.querySelector('#todoColors')

window.addEventListener('load', () => {
    document.body.classList.remove('preload')
    if (flash) {
        setTimeout(() => {
            flash.classList.add('flash-hide')
        }, 4000)
    }
})
window.addEventListener('DOMContentLoaded', () => {
    const todoDescription = document.querySelector('#todo_description')
    if (todoDescription) {
        if (!todoDescription.innerHTML.trim()) {
            todoDescription.innerHTML = ''
        }
    }

    if (todoColors) selectTodoColor(todoColors)
    removeTodo()
})

function selectTodoColor(parent) {
    const colors = parent.querySelectorAll('span')
    const colorInput = document.querySelector('input[name="todo_color"]')

    if (colorInput.value) {
        const color = [...colors].filter(
            (color) => colorInput.value === rgb2hex(color.style.background)
        )
        if (color.length) {
            color[0].setAttribute('select', '')
        }
    }

    colors.forEach((color) => {
        color.addEventListener('click', () => {
            resetColors(colors)
            colorInput.value = rgb2hex(color.style.background)
            color.setAttribute('select', '')
        })
    })
}

// Utils
function rgb2hex(rbg) {
    return (
        '#' +
        rbg.match(/\d+/g).map((x) => (+x).toString(16).padStart(2, 0)).join``
    )
}

function resetColors(colors) {
    colors.forEach((color) => color.removeAttribute('select'))
}

// Set action on data remove modal form
function removeTodo() {
    const removeTodoModal = document.querySelector('#removeTodoModal')
    const removeTodoBtns = document.querySelectorAll('#removeTodoBtn')
    const removeTodoForm = document.querySelector('#removeTodoForm')

    if (removeTodoModal && removeTodoBtn) {
        const BsRmTodoModal = new bootstrap.Modal(removeTodoModal)
        removeTodoForm.method = 'POST'
        removeTodoBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                removeTodoForm.action = `/todo/remove?id=${btn.parentNode.getAttribute(
                    'data-todo-id'
                )}&method=delete`
                BsRmTodoModal.show()
            })
        })
    }

    // console.log(removeTodoBtn, removeTodoModal)
}
