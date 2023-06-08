require('dotenv').config();
require('express-async-errors');
const connectDb = require('./db/connect');
const express = require('express');
const auth = require('./middleware/authentication');
const cors = require('cors')
const xss = require('xss-clean')
const helment = require('helmet')
const rateLimiter = require('express-rate-limit')
const app = express();

const authRoute = require('./routes/auth');
const jobRoute = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


const limiter = rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(express.json());
app.use(limiter)
app.use(helment())
app.use(cors())
app.use(xss())
// extra packages

// routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/jobs', auth, jobRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
