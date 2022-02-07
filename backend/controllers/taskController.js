const Task = require('../models/Task');
const User = require('../models/User');
const response = require('express').response;
const restart = require('nodemon').restart;
const addTask = require('../controllers/userController').addTask;
//import { response } from 'express';
//import { restart } from 'nodemon';
//import addTask from '../controllers/userController';

const getTask = async (req, res) => {
    console.log("[taskController] getTask");
    let { taskID } = req.taskID;
    
    const task = await Task.findOne({ _id: taskID });
    if(!task) {
        console.error("\tgetTask: task not found")
        return res.status(400).json({ message: "task not found" });
    }

    return res.status(200).json(task);
};

const createTask = async (req, res) => {
    console.log("[taskController] createTask");
    let { userID, name, description, dateDeadline } = req.body;

    const userExists = await User.findOne({ _id: userID });
    if (!userExists) {
        console.error("\tcreateRoom: user not found");
        return res.status(400).json({ message: "user not found" });
    }

    //
    // create the room, add to map, and then return it
    Task.create({
        name: name,
        creator_id: userID,
        description: description,
        completed: false,
        dateCreated: Date.now(),
        dateDeadline: dateDeadline,
        dateCompleted: null,
    }).then((newTask) => {
        console.log(`\ttask created: ${newTask._id}`);
        return res.status(201).json({ message: `task created: ${newTask._id}`});
    });
}

const updateTask = async (req, res) => {
    console.log("[taskController] updateTask");
    let { taskID } = req.body;

    let task = Task.findOne({_id: taskID});
    if (!task) {
        console.error(`\t task ${taskID} not found`);
        return res.status(400).json({ message: "task not found" });
    }

    return res.status(200).json({ message: `task ${taskID} updated` });
}

const deleteTask = async (req, res) => {
    console.log("[taskController] deleteTask");
    let { taskID } = req.body;

    let task = Task.findOne({ _id: taskID });
    if (!task) {
        console.error(`\t task ${taskID} not found`);
        return res.status(400).json({ message: "task not found" });
    }

    let user = User.findOne({ _id: task.creator_id });
    if (!user) {
        console.error(`\tuser associated with task ${taskID} does not exist`);
        return res.status(400).json({ message: "user not found" });
    }

    let userTasks = user.tasks;
    if (!userTasks) {
        console.error("\tuser's tasks field does not exist");
        return res.status(404).json({ message: "user tasks not found" })
    }

    var filteredTasks = userTasks.filter(task => task._id !== taskID);
    if (filteredTasks.length !== userTasks.length) {
        return res.status(200).json({ message: "Tasks unchanged, no task with given ID found" });
    } else {
        userTasks = filteredTasks;
        user.archivedTasks.push(task);
        await user.save();
        return res.status(200).json({ message: "Task removed" });
    }
};

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getTask,
};