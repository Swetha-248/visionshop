const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const router = express.Router();
const Product = require('../models/Product');
const fallbackProducts = require('../data/products.json');

const upload = multer({ storage: multer.memoryStorage() });

const getCategoryHint = (text = '') => {
  const normalized = text.toLowerCase();

  if (/(shoe|sneaker|boot|footwear|runner)/.test(normalized)) {
    return 'Apparel';
  }

  if (/(laptop|computer|phone|tablet|camera|headphone|speaker|monitor|keyboard)/.test(normalized)) {
    return 'Electronics';
  }

  return null;
};

const scoreProduct = (product, hint, inputText) => {
  const haystack = `${product.name} ${product.description || ''} ${product.category || ''} ${product.brand}`.toLowerCase();
  let score = 0;

  if (hint && product.category === hint) score += 50;
  if (product.isRecommended) score += 10;

  const keywords = inputText.split(/[^a-z0-9]+/).filter(Boolean);
  const matchedKeywords = keywords.filter(keyword => haystack.includes(keyword));

  return score + matchedKeywords.length * 5;
};

// Get all products
router.get('/products', async (req, res) => {
  try {
    const productsFromDb = await Product.find({}).lean();
    res.json(productsFromDb.length > 0 ? productsFromDb : fallbackProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Search products (Text + simulated semantic)
router.get('/search', async (req, res) => {
  const query = req.query.q?.toLowerCase();
  const catalog = await Product.find({}).lean();
  const productsToSearch = catalog.length > 0 ? catalog : fallbackProducts;
  if (!query) return res.json(productsToSearch);
  
  // Basic keyword matching
  const filtered = productsToSearch.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.brand.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  // Simulate semantic: if "comfortable" is mentioned, boost sneakers
  if (query.includes('comfortable') || query.includes('walk')) {
     const sneakers = productsToSearch.filter(p => p.category === 'Apparel');
     res.json([...new Set([...sneakers, ...filtered])]);
     return;
  }

  res.json(filtered);
});

// Get product details
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id }).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// Chat endpoint (Simulated AI Agent)
router.post('/chat', async (req, res) => {
  const { message } = req.body;
  const msg = message.toLowerCase();
  
  const catalog = (await Product.find({}).lean()).length > 0 ? await Product.find({}).lean() : fallbackProducts;
  let response = "I'm your VisionShop AI assistant. I can help you find products, compare them, or summarize reviews. What are you looking for?";
  let suggestedProducts = [];

  if (msg.includes('laptop') || msg.includes('macbook') || msg.includes('computer')) {
    response = "I've found two great laptops: the high-performance VisionPro Max and the portable UltraSlim Air. Which one sounds better for your needs?";
    suggestedProducts = catalog.filter(p => p.name.includes('Laptop') || p.name.includes('Air'));
  } else if (msg.includes('shoes') || msg.includes('sneakers') || msg.includes('walk')) {
    response = "The CloudWalk Sneakers are our top choice for comfort right now. They're trending in your area!";
    suggestedProducts = catalog.filter(p => p.name.includes('Sneakers'));
  } else if (msg.includes('budget') || msg.includes('cheap') || msg.includes('under')) {
    const budget = catalog.sort((a, b) => a.price - b.price).slice(0, 2);
    response = "Looking for value? Here are some of our best deals under $500.";
    suggestedProducts = budget;
  } else if (msg.includes('better') || msg.includes('compare')) {
    response = "To compare products, just add them to your comparison list. For example, the VisionPro Max has better battery life than the UltraSlim Air.";
  }

  res.json({ response, suggestedProducts });
});

// Visual search connected to the product catalog with CLIP-style matching
router.post('/search/image', upload.single('image'), async (req, res) => {
  const inputText = [req.body?.prompt, req.file?.originalname, req.file?.mimetype]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const categoryHint = getCategoryHint(inputText);
  const catalog = (await Product.find({}).lean()).length > 0 ? await Product.find({}).lean() : fallbackProducts;
  const tempDir = path.join(__dirname, '..', 'tmp');
  const tempImagePath = path.join(tempDir, `${Date.now()}-${req.file?.originalname || 'upload'}`);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  if (req.file?.buffer) {
    fs.writeFileSync(tempImagePath, req.file.buffer);
  }

  const pythonBinary = process.env.CLIP_PYTHON_PATH || 'C:\\Users\\Home\\AppData\\Local\\Programs\\Python\\Python311\\python.exe';
  const scriptPath = path.join(__dirname, '..', 'AI services', 'clip_search.py');

  execFile(pythonBinary, [scriptPath, tempImagePath, JSON.stringify(catalog), inputText], (error, stdout) => {
    try {
      if (error) {
        const fallbackResults = categoryHint
          ? catalog.filter(product => product.category === categoryHint)
          : catalog.filter(product => product.isRecommended);

        return res.json({
          results: fallbackResults.slice(0, 6),
          analysis: 'The CLIP service was unavailable, so the catalog fallback was used.',
          mode: 'fallback'
        });
      }

      const parsed = JSON.parse(stdout);
      res.json({
        results: parsed.results || [],
        analysis: parsed.analysis || 'Visual search completed.',
        mode: parsed.mode || 'fallback'
      });
    } catch (parseError) {
      const fallbackResults = categoryHint
        ? catalog.filter(product => product.category === categoryHint)
        : catalog.filter(product => product.isRecommended);

      res.json({
        results: fallbackResults.slice(0, 6),
        analysis: 'The CLIP response could not be parsed, so the catalog fallback was used.',
        mode: 'fallback'
      });
    } finally {
      if (fs.existsSync(tempImagePath)) {
        fs.unlinkSync(tempImagePath);
      }
    }
  });
});

// Comparative Analysis
router.post('/compare', async (req, res) => {
  const { ids } = req.body;
  const catalog = (await Product.find({}).lean()).length > 0 ? await Product.find({}).lean() : fallbackProducts;
  const compareItems = catalog.filter(p => ids.includes(p.id));
  
  if (compareItems.length < 2) {
    return res.json({ verdict: "Add at least two products to see a comparative analysis." });
  }

  // Generate a mock comparative verdict
  const bestRating = [...compareItems].sort((a, b) => b.rating - a.rating)[0];
  const bestPrice = [...compareItems].sort((a, b) => a.price - b.price)[0];

  res.json({
    verdict: `Based on your selection, ${bestRating.name} is the highest rated by users, while ${bestPrice.name} offers the best value.`,
    highlights: [
      { type: 'Power', label: 'Performance Pick', product: compareItems.find(p => p.specs.Processor?.includes('Octa'))?.name || 'N/A' },
      { type: 'Value', label: 'Budget Pick', product: bestPrice.name }
    ]
  });
});

module.exports = router;
