/**
 * Schema representing a cost item in the system.
 * @typedef {Object} Cost
 * @property {string} description - The description of the cost item.
 * @property {string} category - The category of the cost item (e.g., food, health).
 * @property {string} userid - The ID of the user associated with the cost.
 * @property {number} sum - The sum of the cost item.
 * @property {Date} created_at - The date and time when the cost was created. Defaults to the current date and time.
 */

const mongoose = require("mongoose");

const costSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: { type: String, required: true },
  userid: { type: String, required: true, ref: "User" },
  sum: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cost", costSchema);