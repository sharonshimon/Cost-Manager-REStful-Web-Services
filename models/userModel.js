/**
 * Schema representing a user in the system.
 * @typedef {Object} User
 * @property {string} id - The unique ID of the user.
 * @property {string} first_name - The first name of the user.
 * @property {string} last_name - The last name of the user.
 * @property {Date} birthday - The birthday of the user.
 * @property {string} marital_status - The marital status of the user (e.g., single, married).
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  birthday: { type: Date, required: true },
  marital_status: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);