const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/auth.routes');
const destinationRoutes = require('./routes/destination.routes');
const tourRoutes = require('./routes/tour.routes');
const bookingRoutes = require('./routes/booking.routes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'travello-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../frontend/dist');
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (req, res, next) => {
    if (req.method !== 'GET') return next();
    res.sendFile(path.join(clientDist, 'index.html'), (err) => {
      if (err) next(err);
    });
  });
}

app.all('/api/{*splat}', (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
