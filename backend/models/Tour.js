const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tour title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Tour must belong to a destination'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    duration: {
      type: Number, // in days
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 day'],
    },
    date: {
      type: Date,
      required: [true, 'Available date is required'],
    },
    seatsAvailable: {
      type: Number,
      required: [true, 'Number of available seats is required'],
      min: [0, 'Seats cannot be negative'],
    },
  },
  { timestamps: true }
);

// Auto-generate a unique-ish slug from the title.
// (Two tours can share a title, e.g. re-run the same tour on a new date,
// so we append a short random suffix to keep the slug unique.)
tourSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = `${slugify(this.title)}-${Math.random().toString(36).slice(2, 7)}`;
  }
});

module.exports = mongoose.model('Tour', tourSchema);
