const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: 'Electronics' },
  rating: { type: Number, default: 0 },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  isRecommended: { type: Boolean, default: false },
  aiReasoning: { type: String, default: '' },
  specs: { type: Object, default: {} },
  reviews: { type: [String], default: [] },
  aiSummary: {
    pros: { type: [String], default: [] },
    cons: { type: [String], default: [] },
    verdict: { type: String, default: '' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
