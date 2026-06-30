import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function uploadProduct() {
  try {
    const record = await pb.collection('products').create({
      name: 'Premium Gold Whey Protein',
      price: 1699,
      category: 'Supplements',
      original_price: 2699,
      flavors: ["Belgian Chocolate", "Double Rich Chocolate"],
      sizes: ["1 KG", "2 KG"],
      rating: 5,
      active: true
    });
    console.log('Successfully created product:', record.id);
  } catch (err) {
    console.error('Failed to create product:', err);
    console.error(err.data);
  }
}

uploadProduct();
