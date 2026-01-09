import { getUncachableStripeClient } from './stripeClient';

interface ProductConfig {
  name: string;
  description: string;
  category: string;
  monthlyPrice: number;
}

const products: ProductConfig[] = [
  {
    name: 'Semaglutide',
    description: 'FDA-approved GLP-1 medication for weight management. Weekly injection that helps control appetite and blood sugar.',
    category: 'weight-loss',
    monthlyPrice: 29900,
  },
  {
    name: 'Tirzepatide',
    description: 'Next-generation dual GIP/GLP-1 medication for significant weight loss. Weekly injection with powerful results.',
    category: 'weight-loss',
    monthlyPrice: 39900,
  },
  {
    name: 'Finasteride',
    description: 'FDA-approved oral medication that blocks DHT to prevent further hair loss and promote regrowth.',
    category: 'hair-loss',
    monthlyPrice: 2900,
  },
  {
    name: 'Minoxidil',
    description: 'Topical solution that increases blood flow to hair follicles, promoting thicker, fuller hair growth.',
    category: 'hair-loss',
    monthlyPrice: 1900,
  },
  {
    name: 'Sildenafil',
    description: 'FDA-approved medication for erectile dysfunction. Works within 30-60 minutes and lasts up to 4 hours.',
    category: 'sexual-health',
    monthlyPrice: 2900,
  },
  {
    name: 'Tadalafil',
    description: 'Long-lasting ED medication that can work for up to 36 hours. Can be taken daily at lower doses.',
    category: 'sexual-health',
    monthlyPrice: 3400,
  },
];

async function seedProducts() {
  console.log('Seeding Stripe products...');
  const stripe = await getUncachableStripeClient();

  for (const product of products) {
    try {
      const existingProducts = await stripe.products.search({
        query: `name:'${product.name}'`,
      });

      if (existingProducts.data.length > 0) {
        console.log(`Product "${product.name}" already exists, skipping...`);
        continue;
      }

      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        metadata: {
          category: product.category,
        },
      });

      await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.monthlyPrice,
        currency: 'usd',
        recurring: { interval: 'month' },
        metadata: {
          category: product.category,
        },
      });

      console.log(`Created product: ${product.name} with monthly price $${(product.monthlyPrice / 100).toFixed(2)}`);
    } catch (error) {
      console.error(`Error creating product ${product.name}:`, error);
    }
  }

  console.log('Stripe products seeded successfully!');
}

seedProducts().catch(console.error);
