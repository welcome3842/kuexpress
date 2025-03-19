const db = require('../models');
const Task = db.Task;
const Joi = require('joi');

class TaskController {
  
  static async createTask(req, res) {
    try {
      const task = await Task.create(req.body);
      return res.status(200).json({ message: "Task created successfully", task });
    } catch (error) {
      console.error("Error creating task:", error);
      return res.status(500).json({ message: "Error creating task", error });
    }
  }
 
  static async getAllTasks(req, res) {
    try {
      const tasks = await Task.findAll();
      return res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return res.status(500).json({ message: "Error fetching tasks", error });
    }
  }

  
  static async getTaskById(req, res) {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.status(200).json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      return res.status(500).json({ message: "Error fetching task", error });
    }
  }

  
  static async updateTask(req, res) {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      await task.update(req.body);
      return res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
      console.error("Error updating task:", error);
      return res.status(500).json({ message: "Error updating task", error });
    }
  }

  
  static async deleteTask(req, res) {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      await task.destroy();
      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      return res.status(500).json({ message: "Error deleting task", error });
    }
  }
}
module.exports = TaskController;
