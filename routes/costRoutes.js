/**
 * Router for handling cost-related operations.
 */
const express = require("express");
const Cost = require("../models/costModel");
const User = require("../models/userModel");

const router = express.Router();

/**
 * Add a new cost item to the database.
 * @route POST /api/add
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing cost data.
 * @param {string} req.body.description - The description of the cost item.
 * @param {string} req.body.category - The category of the cost item.
 * @param {string} req.body.userid - The ID of the user associated with the cost.
 * @param {number} req.body.sum - The sum of the cost item.
 * @param {Date} [req.body.created_at] - The creation date of the cost item. Defaults to the current date.
 * @param {Object} res - The response object.
 * @returns {Object} The saved cost item or an error message.
 */
router.post("/add", async (req, res) => {
  try {
    const { description, category, userid, sum, created_at } = req.body;

    //Validate required fields
    if (!description || !category || !userid || !sum) {
      return res.status(400).json({ error: "All fields are required" });
    }

    //Validate category value
    if (
      !["food", "health", "housing", "sport", "education"].includes(category)
    ) {
      return res.status(400).json({ error: "Invalid category" });
    }

    //Validate sum is a positive number
    if (typeof sum !== "number" || sum <= 0) {
      return res.status(400).json({ error: "Sum must be a positive number" });
    }

    //Before saving the cost, validate user existence
    const userExists = await User.exists({ id: userid });
    if (!userExists) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const cost = new Cost({
      description,
      category,
      userid,
      sum,
      created_at: created_at || new Date(),
    });

    const savedCost = await cost.save();
    res.status(201).json(savedCost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get a monthly report of costs for a specific user.
 * @route GET /api/report
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters.
 * @param {string} req.query.id - The ID of the user.
 * @param {string} req.query.year - The year for the report.
 * @param {string} req.query.month - The month for the report.
 * @param {Object} res - The response object.
 * @returns {Object} An object containing the user ID, year, month, and a categorized list of cost items.
 */

router.get("/report", async (req, res) => {
  try {
    const { id, year, month } = req.query;

    //Validate year and month values
    const parsedYear = parseInt(year);
    const parsedMonth = parseInt(month);

    if (
        isNaN(parsedYear) ||
        isNaN(parsedMonth) ||
        parsedMonth < 1 ||
        parsedMonth > 12
    ) {
      return res.status(400).json({ error: "Invalid year or month" });
    }

    //Validate user existence
    const userExists = await User.exists({ id });
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    //Set the date range for the given month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    //Fetch costs for the user in the specified date range
    const costs = await Cost.aggregate([
      {
        $match: {
          userid: id,
          created_at: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          items: {
            $push: {
              sum: "$sum",
              description: "$description",
              day: { $dayOfMonth: "$created_at" },
            },
          },
        },
      },
    ]);

    //Ensure all predefined categories are included in the response
    const categories = ["food", "health", "housing", "sport", "education"];
    const formattedCosts = categories.reduce((acc, category) => {
      acc[category] = costs.find((c) => c._id === category)?.items || [];
      return acc;
    }, {});

    //Return the report
    res.json({ userid: id, year, month, costs: formattedCosts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;