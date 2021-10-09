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

window.addEventListener('load', () => {
    document.body.classList.remove('preload')
    if (flash) {
        setTimeout(() => {
            flash.classList.add('flash-hide')
        }, 4000)
    }
})
window.addEventListener('DOMContentLoaded', () => {})
