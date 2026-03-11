import express from 'express';
import { structures, structureIds } from './data/structures.js';
import { authors, nameAutocomplete } from './data/authors.js';
import { mapStructure } from './helpers.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((_req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Health check
app.get('/hc', (_req, res) => {
  res.json({ status: 'OK' });
});

// Structure by ID
app.get('/api/v1/structure/:id', (req, res) => {
  const id = Number(req.params.id);
  const structure = structures.find((s) => s._id === id);
  res.json({
    meta: {},
    cache: { type: 'structure' },
    errors: [],
    data: structure || null,
  });
});

// Batch structures
app.post('/api/v1/structure', (req, res) => {
  const idsStr = req.body.ids || '[]';
  const expand = req.body.expand === 'true';
  let ids: number[];
  try {
    ids = JSON.parse(idsStr);
  } catch {
    ids = [];
  }
  const data = ids
    .map((id) => structures.find((s) => s._id === id))
    .filter(Boolean)
    .map((s) => mapStructure(s!, expand));

  res.json({ errors: [], meta: {}, cache: { type: 'structure-details' }, data });
});

// Catalog
app.get('/api/v1/catalog', (req, res) => {
  const page = Number(req.query.page) || 1;
  // Each catalog entry represents a "page" of structures
  // The frontend requests page N and looks for data item with id === N
  res.json({
    meta: { pages: 1 },
    cache: { type: 'catalog' },
    errors: [],
    data: [
      {
        id: page,
        type: 'catalog',
        attributes: { id: page, structures: structureIds },
      },
    ],
  });
});

// Authors list
app.get('/api/v1/authors', (req, res) => {
  const page = Number(req.query.page) || 1;
  const perPage = 300;
  const start = (page - 1) * perPage;
  const pageAuthors = authors.slice(start, start + perPage);
  res.json({
    errors: [],
    meta: { total: authors.length, pages: Math.ceil(authors.length / perPage) },
    data: pageAuthors.map((a) => ({
      id: a.full,
      type: 'author',
      attributes: { full: a.full, count: a.count, updated: new Date().toISOString() },
    })),
  });
});

// Author details
app.get('/api/v1/authors/:name', (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const matched = authors.filter((a) => a.full.toLowerCase().includes(name.toLowerCase()));
  res.json({
    meta: { total: structureIds.length, pages: 1, name },
    data: {
      results: matched.length > 0 ? structureIds : [],
      authors: matched,
    },
  });
});

// Search by name
app.post('/api/v1/search/name', (req, res) => {
  const name = String(req.body.name || '').toLowerCase();
  const matched = structures.filter(
    (s) =>
      s.commonname?.toLowerCase().includes(name) ||
      s.chemname?.toLowerCase().includes(name) ||
      s.mineral?.toLowerCase().includes(name)
  );
  const ids = matched.map((s) => s._id);
  res.json({
    meta: { total: ids.length, pages: 1, searchString: name },
    data: matched.map((s) => mapStructure(s, false)),
  });
});

// Search by author
app.post('/api/v1/search/author', (req, res) => {
  const name = String(req.body.name || '').toLowerCase();
  const matched = structures.filter((s) =>
    s.__authors.some((a) => a.toLowerCase().includes(name))
  );
  const matchedAuthors = authors.filter((a) => a.full.toLowerCase().includes(name));
  res.json({
    meta: {
      searchString: name,
      authors: matchedAuthors,
      total: matched.length,
      pages: 1,
    },
    data: { structures: matched.map((s) => s._id) },
  });
});

// Search by formula
app.post('/api/v1/search/formula', (req, res) => {
  const formula = String(req.body.formula || '').toLowerCase().replace(/\s/g, '');
  const matched = structures.filter(
    (s) =>
      s.formula.toLowerCase().replace(/\s/g, '').includes(formula) ||
      s.calcformula.toLowerCase().replace(/\s/g, '').includes(formula)
  );
  res.json({
    meta: {
      pages: 0,
      total: matched.length,
      searchFormula: formula,
      exactMatchStructures: matched.length,
      similarMatchStructures: 0,
      similarFormulas: [],
    },
    data: { structures: matched.map((s) => s._id) },
  });
});

// Search by unit cell
app.post('/api/v1/search/unit-cell', (req, res) => {
  const { a, b, c, alpha, beta, gamma, tolerance } = req.body;
  const tol = Number(tolerance) || 5;
  const inRange = (val: number, target: number) =>
    Math.abs(val - target) <= (target * tol) / 100;

  const matched = structures.filter(
    (s) =>
      (!a || inRange(s.a, Number(a))) &&
      (!b || inRange(s.b, Number(b))) &&
      (!c || inRange(s.c, Number(c))) &&
      (!alpha || inRange(s.alpha, Number(alpha))) &&
      (!beta || inRange(s.beta, Number(beta))) &&
      (!gamma || inRange(s.gamma, Number(gamma)))
  );
  res.json({
    meta: { total: matched.length, pages: 1 },
    data: { structures: matched.map((s) => s._id) },
  });
});

// Autocomplete name
app.get('/api/v1/autocomplete/name', (req, res) => {
  const name = String(req.query.name || '').toLowerCase();
  const matched = nameAutocomplete.filter((n) => n.name.includes(name));
  res.json({
    meta: { limit: 100, items: matched.length },
    data: matched,
  });
});

// Autocomplete author
app.get('/api/v1/autocomplete/author', (req, res) => {
  const name = String(req.query.name || '').toLowerCase();
  const matched = authors.filter((a) => a.full.toLowerCase().includes(name));
  res.json({
    meta: { limit: 100, items: matched.length },
    data: matched,
  });
});

// Sitemap
app.get('/sitemap.xml', (_req, res) => {
  res.set('Content-Type', 'text/xml');
  res.send(
    '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://crystallography.io/sitemap/sitemap_s.xml</loc></sitemap></sitemapindex>'
  );
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log(`  ${structures.length} structures, ${authors.length} authors`);
});
