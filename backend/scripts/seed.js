require('../config/mongoDns');

const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const { getMongoUri } = require('../config/connectMongo');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');

const ADMIN = {
  name: 'Travello Admin',
  email: 'admin@travello.dev',
  password: 'admin123',
};

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not set. Configure backend/.env first.');
    process.exit(1);
  }

  await mongoose.connect(uri);

  await Booking.deleteMany({});
  await Tour.deleteMany({});
  await Destination.deleteMany({});
  await User.deleteMany({});

  await User.create({
    name: ADMIN.name,
    email: ADMIN.email,
    password: ADMIN.password,
    role: 'admin',
    isVerified: true,
  });

  const sylhet = await Destination.create({
    name: 'Sylhet Hills',
    description: 'Rolling tea gardens, waterfalls, and misty hills in northeastern Bangladesh.',
    region: 'Sylhet',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80',
  });

  const cox = await Destination.create({
    name: 'Cox\'s Bazar Coast',
    description: 'Long sandy beaches, seafood, and relaxed coastal vibes on the Bay of Bengal.',
    region: 'Chittagong',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  });

  const dhaka = await Destination.create({
    name: 'Old Dhaka Heritage',
    description: 'Historic lanes, riverfront life, and street food in the capital.',
    region: 'Dhaka',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=900&q=80',
  });

  const tourDate = (daysFromNow) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d;
  };

  await Tour.create([
    {
      title: '3-Day Sylhet Tea Trail',
      destination: sylhet._id,
      description: 'Visit tea estates, Jaflong, and Ratargul swamp forest with a local guide.',
      price: 175,
      duration: 3,
      date: tourDate(30),
      seatsAvailable: 12,
      image: sylhet.image,
    },
    {
      title: 'Weekend Cox\'s Bazar Escape',
      destination: cox._id,
      description: 'Beach stays, sunset walks, and optional boat trip to nearby islands.',
      price: 220,
      duration: 4,
      date: tourDate(45),
      seatsAvailable: 8,
      image: cox.image,
    },
    {
      title: 'Old Dhaka Food & Culture Walk',
      destination: dhaka._id,
      description: 'Rickshaw lanes, Ahsan Manzil, and curated street-food tastings.',
      price: 65,
      duration: 1,
      date: tourDate(14),
      seatsAvailable: 20,
      image: dhaka.image,
    },
  ]);

  console.log('Seed complete.');
  console.log(`Admin login: ${ADMIN.email} / ${ADMIN.password}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
