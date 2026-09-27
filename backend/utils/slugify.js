// Tiny slugify helper — no extra dependency needed for a simple
// "Cox's Bazar" -> "coxs-bazar" style conversion.
module.exports = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // strip anything that isn't a letter/number/space/hyphen
    .replace(/\s+/g, '-') // spaces -> hyphens
    .replace(/-+/g, '-'); // collapse repeated hyphens
