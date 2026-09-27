const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      default: '',
    },
    region: {
      type: String,
      required: [true, 'Region is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

// Auto-generate the slug from the name whenever the name changes.
destinationSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
});

module.exports = mongoose.model('Destination', destinationSchema);
