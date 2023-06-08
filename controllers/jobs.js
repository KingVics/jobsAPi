const JobSchema = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
  const jobs = await JobSchema.find({ createdBy: req.user.userId }).sort(
    'createdAt'
  );

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;

  const job = await JobSchema.findOne({ _id: id, createdBy: userId });

  if (!job) {
    throw new NotFoundError(` Job with ${id} is not found`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const job = await JobSchema.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id },
  } = req;


  if (!company || !position) {
    throw new BadRequestError('Provide Company and Position fields');
  }

  const job = await JobSchema.findByIdAndUpdate(
    { _id: id, createdBy: userId },
    req.body,
    { new: true, runValidator: true }
  );

  if (!job) {
    throw new NotFoundError(` Job with ${id} is not found`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;

  const job = await JobSchema.findOneAndDelete({
    _id: id,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(` Job with ${id} is not found`);
  }



  res.status(StatusCodes.OK).json(`job with ${id} deleted` );
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
