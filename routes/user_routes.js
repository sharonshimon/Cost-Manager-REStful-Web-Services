const express = require("express");
const User = require("../models/user_model");
const Cost = require("../models/cost_model");

const router = express.Router();

/**
 * Get the details of a specific user.
 * @route GET /api/users/:id
 * @param {Object} req
 * @param {string} req.params.id - The ID of the user.
 * @param {Object} res
 * @returns {Object} The user's details and their total costs or an error message.
 */
router.get("/users/:id", async (req, res) => {
  try {
    //Find user by ID
    const { id } = req.params;
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //Calculate total costs for the user
    const totalCosts = await Cost.aggregate([
      { $match: { userid: id } },
      { $group: { _id: null, total: { $sum: "$sum" } } }
    ]);

    //If no costs found, total will be 0
    const total = totalCosts[0]?.total || 0;

    //Return user details and total costs
    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create a new user.
 * @route POST /api/users/add
 * @param {Object} req
 * @param {Object} req.body
 * @param {string} req.body.id - The unique user id.
 * @param {string} req.body.first_name - The user's first name.
 * @param {string} req.body.last_name - The user's last name.
 * @param {Date} req.body.birthday - The user's birthday.
 * @param {string} req.body.marital_status - The user's marital status.
 * @param {Object} res
 * @returns {Object} The created user or an error message.
 */
router.post("/users/add", async (req, res) => {
  try {
    const { id, first_name, last_name, birthday, marital_status } = req.body;

    //Validate required fields
    if (!id || !first_name || !last_name || !birthday || !marital_status) {
      return res.status(400).json({ error: "All fields are required" });
    }

    //Check if the user already exists
    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    //Create and save new user
    const newUser = new User({ id, first_name, last_name, birthday, marital_status });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get the list of team members who developed the project.
 * @route GET /api/about
 * @param {Object} req
 * @param {Object} res
 * @returns {Object[]} An array of team member details.
 */
router.get("/about", (req, res) => {
  res.json([
    {
      first_name: "Sharon",
      last_name: "Shimon",
      id: "316440601",
      email: "psnsharon@gmail.com"
    },
    {
      first_name: "Mai",
      last_name: "Ludrik",
      id: "314652348",
      email: "mailu2276@gmail.com"
    }
  ]);
});

module.exports = router;