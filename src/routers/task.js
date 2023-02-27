const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Task = require("../models/task");

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET /tasks?completed=boolean
// GET /tasks?limit=10&skip=20  //This link would show me page 2 broken into 10 items per page
// GET /tasks?sortBy=createdAt:desc       //(completed?timestamps?)and order
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  const query = req.query;

  if (query.completed) {
    match.completed = query.completed === "true"; // The value of query.completed is a string, hence the 'conversion
  }
  if (query.sortBy) {
    const parts = query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    // const tasks = await Task.find({ owner: req.user.id });
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(query.limit),
        skip: parseInt(query.skip),
        sort,
      },
    });
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send();
  }

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidUpdate = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid update" });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).send();
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).send();
  }
  try {
    let task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
