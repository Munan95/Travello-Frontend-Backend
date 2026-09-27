const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Travello (Toy Clone) API',
      version: '1.0.0',
      description:
        'Backend API for a toy Travello clone — Destinations, Tours, and Bookings, with JWT auth and OTP email verification on registration.',
    },
    servers: [{ url: '/api', description: 'Base API path' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'fail' },
            message: { type: 'string', example: 'Something went wrong' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Test User' },
            email: { type: 'string', format: 'email', example: 'test@example.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
          },
        },
        VerifyOtpInput: {
          type: 'object',
          required: ['email', 'otp'],
          properties: {
            email: { type: 'string', format: 'email', example: 'test@example.com' },
            otp: { type: 'string', example: '123456' },
          },
        },
        ResendOtpInput: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email', example: 'test@example.com' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'test@example.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            isVerified: { type: 'boolean' },
          },
        },
        Destination: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'Sylhet Hills' },
            slug: { type: 'string', example: 'sylhet-hills' },
            description: { type: 'string', example: 'Tea gardens and hills' },
            image: { type: 'string' },
            region: { type: 'string', example: 'Sylhet' },
          },
        },
        DestinationInput: {
          type: 'object',
          required: ['name', 'description', 'region'],
          properties: {
            name: { type: 'string', example: 'Sylhet Hills' },
            description: { type: 'string', example: 'Tea gardens and hills' },
            region: { type: 'string', example: 'Sylhet' },
            image: { type: 'string', example: 'https://example.com/sylhet.jpg' },
          },
        },
        Tour: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string', example: '3-Day Sylhet Adventure' },
            slug: { type: 'string' },
            destination: {
              oneOf: [{ type: 'string' }, { $ref: '#/components/schemas/Destination' }],
            },
            description: { type: 'string' },
            image: { type: 'string' },
            price: { type: 'number', example: 175 },
            duration: { type: 'number', example: 3, description: 'Duration in days' },
            date: { type: 'string', format: 'date', example: '2026-10-15' },
            seatsAvailable: { type: 'number', example: 10 },
          },
        },
        TourInput: {
          type: 'object',
          required: ['title', 'destination', 'description', 'price', 'duration', 'date', 'seatsAvailable'],
          properties: {
            title: { type: 'string', example: '3-Day Sylhet Adventure' },
            destination: { type: 'string', description: 'Destination ObjectId' },
            description: { type: 'string' },
            price: { type: 'number', example: 175 },
            duration: { type: 'number', example: 3 },
            date: { type: 'string', format: 'date', example: '2026-10-15' },
            seatsAvailable: { type: 'number', example: 10 },
            image: { type: 'string' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: {
              oneOf: [{ type: 'string' }, { $ref: '#/components/schemas/User' }],
            },
            tour: {
              oneOf: [{ type: 'string' }, { $ref: '#/components/schemas/Tour' }],
            },
            numGuests: { type: 'number', example: 2 },
            totalPrice: { type: 'number', example: 350 },
            status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled'] },
          },
        },
        CreateBookingInput: {
          type: 'object',
          required: ['tourId', 'numGuests'],
          properties: {
            tourId: { type: 'string', description: 'Tour ObjectId' },
            numGuests: { type: 'number', example: 2 },
          },
        },
        UpdateBookingStatusInput: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['confirmed', 'cancelled'] },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

module.exports = swaggerJsdoc(options);
