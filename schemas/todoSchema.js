const { body, query } = require('express-validator')

exports.createTodoSchema = [
    body('todo_title')
        .trim()
        .notEmpty()
        .withMessage('Please enter todo title')
        .isLength({ min: 4, max: 30 })
        .withMessage('Please enter todo title between 4 and 30 characters'),
    body('todo_description')
        .trim()
        .notEmpty()
        .withMessage('Please enter todo description')
        .isLength({ min: 10, max: 120 })
        .withMessage(
            'Please enter todo description between 10 and 120 characters'
        ),
    body('todo_color')
        .trim()
        .notEmpty()
        .withMessage('Please select todo color')
        .isHexColor()
        .withMessage('Provide a hex color formate')
        .custom((color) => {
            if (
                [
                    '#fcd34d',
                    '#fca5a5',
                    '#34d399',
                    '#4d7c0f',
                    '#6366f1',
                    '#7c3aed',
                    '#f97316',
                    '#ef4444'
                ].includes(color)
            ) {
                return true
            }
            throw Error()
        })
        .withMessage('Color is not match')
]

exports.removeTodoSchema = [
    query('id').isMongoId(),
    query('method').equals('delete')
]

exports.updateTodoSchema = [
    query('id').isMongoId(),
    query('method').equals('put')
]
