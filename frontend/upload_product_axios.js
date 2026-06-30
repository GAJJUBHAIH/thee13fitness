import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';

async function uploadProduct() {
  let token = '';
  try {
    const authRes = await axios.post('http://127.0.0.1:8090/api/admins/auth-with-password', {
      identity: 'admin@three13.com',
      password: 'admin1234567890'
    });
    token = authRes.data.token;
    console.log("Admin logged in successfully.");
  } catch (err) {
    console.error("Admin login failed", err.response?.data);
    return;
  }

  const imagesDir = 'C:\\Users\\gajju\\Downloads\\New folder (7)';
  const files = fs.readdirSync(imagesDir).filter(file => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.webp'));
  
  const form = new FormData();
  form.append('name', 'Premium Gold Whey Protein');
  form.append('description', 'Premium 100% whey isolate, designed with enzyme technology for better absorption.');
  form.append('price', 1699);
  form.append('original_price', 2699);
  form.append('category', 'Supplements');
  form.append('active', 'true');
  form.append('rating', 5);
  
  const flavors = ["Belgian Chocolate", "Double Rich Chocolate", "Cafe Latte", "Vanilla Creme", "Strawberry Milkshake", "Smooth Banana Cream", "Cookie & Cream", "Rocky Road", "Mango Magic", "Malai Kulfi"];
  form.append('flavors', JSON.stringify(flavors));
  
  const sizes = ["1 KG", "2 KG"];
  form.append('sizes', JSON.stringify(sizes));

  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(imagesDir, files[i]);
    const fileStream = fs.createReadStream(filePath);
    form.append('images', fileStream);
    
    if (i === 0) {
      form.append('image', fs.createReadStream(filePath)); // main image
    }
  }

  try {
    const res = await axios.post('http://127.0.0.1:8090/api/collections/products/records', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: token
      }
    });
    console.log('Successfully created product:', res.data.id);
  } catch (err) {
    console.error('Failed to create product:', err.message);
    if (err.response) {
      console.error(err.response.data);
    }
  }
}

uploadProduct();
