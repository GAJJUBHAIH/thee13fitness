import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';

const pb = new PocketBase('http://127.0.0.1:8090');

async function uploadProduct() {
  await pb.admins.authWithPassword('admin@three13.com', 'admin123456');

  const imagesDir = 'C:\\Users\\gajju\\Downloads\\New folder (7)';
  const files = fs.readdirSync(imagesDir).filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
  
  const formData = new FormData();
  formData.append('name', 'Premium Gold Whey Protein');
  formData.append('description', 'Premium 100% whey isolate, designed with enzyme technology for better absorption.');
  formData.append('price', 1699);
  formData.append('original_price', 2699);
  formData.append('category', 'Supplements');
  formData.append('active', true);
  formData.append('rating', 5);
  
  const flavors = ["Belgian Chocolate", "Double Rich Chocolate", "Cafe Latte", "Vanilla Creme", "Strawberry Milkshake", "Smooth Banana Cream", "Cookie & Cream", "Rocky Road", "Mango Magic", "Malai Kulfi"];
  formData.append('flavors', JSON.stringify(flavors));
  
  const sizes = ["1 KG", "2 KG"];
  formData.append('sizes', JSON.stringify(sizes));

  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(imagesDir, files[i]);
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    
    formData.append('images', blob, files[i]);
    
    if (i === 0) {
      formData.append('image', blob, files[i]);
    }
  }

  try {
    const record = await pb.collection('products').create(formData);
    console.log('Successfully created product:', record.id);
  } catch (err) {
    console.error('Failed to create product:', err);
    console.error(err.data);
  }
}

uploadProduct();
