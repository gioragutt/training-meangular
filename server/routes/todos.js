const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');

const USERNAME = 'admin';
const PASSWORD = 'admin';

const db = mongojs(`mongodb://${USERNAME}:${PASSWORD}@ds161890.mlab.com:61890/training-meangular-giorag`, ['todos'])

const mongoOperationCallback = (res) => {
    return (error, result) => {
        if (error) {
            res.send(error)
        } else {
            res.json(result);
        }
    }
};

const idFromReq = (req) => {
    const id = { _id: mongojs.ObjectId(req.params.id) };
    return id;
}

router.get('/todos', (req, res, next) => {
    db.todos.find(mongoOperationCallback(res));
});

router.get('/todo/:id', (req, res, next) => {
    db.todos.findOne(idFromReq(req), mongoOperationCallback(res));
});

const parseTodo = (body) => {
    if (body === undefined) {
        console.error(`body is undefined`);
        return null;
    }

    if (body.todo === undefined || typeof body.todo !== 'string') {
        console.error(`body.todo(${body.todo}) is undefined or not a string`);
        return null;
    }

    if (body.completed === undefined || typeof body.completed !== 'boolean') {
        console.error(`body.completed(${body.completed}) is undefined or not a boolean`);
        return null;
    }

    return {
        todo: body.todo,
        completed: body.completed
    };
}

router.post('/todo', (req, res, next) => {
    const todo = parseTodo(req.body);
    if (todo === null) {
        res.status(400).json({
            "error": "request body is not a todo json"
        })
        return;
    }

    db.save(todo, mongoOperationCallback(res));
});

router.put('/todo/:id', (req, res, next) => {
    const todo = parseTodo(req.body);

    if (todo === null) {
        res.status(400).json({
            "error": "request body is not a todo json"
        })
        return;
    }

    db.todos.update(idFromReq(req), todo, {}, mongoOperationCallback(res));
});

router.delete('/todo/:id', (req, res, next) => {
    db.todos.update(idFromReq(req), {}, mongoOperationCallback(res));
});

module.exports = router;