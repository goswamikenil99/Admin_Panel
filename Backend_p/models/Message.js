const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
