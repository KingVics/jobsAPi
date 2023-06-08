const mongoose = require('mongoose');

const JobSchma = mongoose.Schema(
  {
    company: {
      type: String,
      require: [true, 'Please provide a company name'],
      maxlength: 30,
    },
    position: {
      type: String,
      require: [true, 'Please provide position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'pending', 'declined'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      require: [true, 'Please provide a user'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchma);
