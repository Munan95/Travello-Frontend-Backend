require('./mongoDns');

const mongoose = require('mongoose');

const DEFAULT_DB = 'travello';

function normalizeMongoUri(uri) {
  if (!uri || typeof uri !== 'string') return uri;

  const trimmed = uri.trim();
  if (!trimmed.startsWith('mongodb+srv://') && !trimmed.startsWith('mongodb://')) {
    return trimmed;
  }

  // Atlas URI pasted without a database name (trailing slash only).
  const missingDb = /^mongodb(\+srv)?:\/\/[^/]+\/?$/.test(trimmed);
  if (missingDb) {
    const base = trimmed.replace(/\/$/, '');
    return `${base}/${DEFAULT_DB}?retryWrites=true&w=majority`;
  }

  return trimmed;
}

function getMongoUri() {
  const direct = process.env.MONGO_URI_STANDARD?.trim();
  if (direct) return direct;
  return normalizeMongoUri(process.env.MONGO_URI);
}

async function connectMongo() {
  const uri = getMongoUri();
  if (!uri) {
    throw new Error('MONGO_URI is not set. Copy backend/.env.example to backend/.env and configure it.');
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    if (err.code === 'ECONNREFUSED' && err.syscall === 'querySrv') {
      throw new Error(
        'Could not resolve MongoDB Atlas SRV record (DNS blocked). ' +
          'In Atlas: Connect → Drivers → choose "Standard connection string", paste it as MONGO_URI_STANDARD in .env, ' +
          'or use Google DNS (8.8.8.8) on your network adapter.'
      );
    }
    throw err;
  }
}

module.exports = { connectMongo, getMongoUri, normalizeMongoUri };
