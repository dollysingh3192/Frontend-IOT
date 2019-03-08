const express = require('express');
// import db from './db';
const db = require("./db.js");

console.log(db);
// import bodyParser from 'body-parser';
const app = express();
const port = process.env.PORT || 5000;
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/api', function (req, res, next) {
//     console.log('one');
//     next();
// });

app.get('/api/iot', (req, res) => {
    res.send(db);
});

// app.get('/api/iot/:id', (req, res, next) => {
//     const id = parseInt(req.params.id, 10);
//     let finded = true;
//     db.map((todo) => {
//         if (parseInt(todo.station_id, 10) === id) {
//             finded = false;
//             res.setHeader('Content-Type', 'text/html');
//             res.send({
//                 success: 'true',
//                 message: 'todo retrieved successfully',
//                 todo,
//             });
//             next();
//         }
//     });
//     console.log(finded);
//     if (finded) {
//         return res.send({
//             success: 'false',
//             message: 'todo does not exist',
//         });
//     }
// });

app.post('/api/iot/:id/:state', (req, res) => {
    const id = parseInt(req.params.id, 10);
    let todoFound;
    let itemIndex;
    db.map((todo, index) => {
        if (parseInt(todo.station_id, 10) === id) {
            todoFound = todo;
            itemIndex = index;
        }
    });

    // console.log(todoFound);

    if (!todoFound) {
        return res.status(404).send({
            success: 'false',
            message: 'todo not found',
        });
    }

    // console.log("request", req.params);

    const updatedTodo = {
        station_id: todoFound.station_id,
        state: req.params.state || todoFound.state,
    };

    // console.log("itemIndex", itemIndex);

    db.splice(itemIndex, 1, updatedTodo);

    // console.log(db);
    return res.status(201).send({
        success: 'true',
        message: 'todo added successfully',
        updatedTodo,
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
