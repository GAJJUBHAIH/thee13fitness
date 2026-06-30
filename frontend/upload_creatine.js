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

  const form = new FormData();
  form.append('name', 'BigMuscles Nutrition Creatine Monohydrate');
  form.append('description', '100% Pure Creatine Monohydrate to boost strength, increase power output, and enhance muscle volume. 3g pure creatine per serving. Unflavored and easily mixable.');
  form.append('price', 499);
  form.append('original_price', 899);
  form.append('category', 'Supplements');
  form.append('active', 'true');
  form.append('rating', 4.8);
  
  const creatineFlavors = ["Unflavored"];
  form.append('flavors', JSON.stringify(creatineFlavors));
  
  const creatineSizes = ["100g", "250g"];
  form.append('sizes', JSON.stringify(creatineSizes));

  const creatineImagePath = 'C:\\Users\\gajju\\.gemini\\antigravity\\brain\\9325cab7-3ff7-4e8a-9a4a-09d69ba67cb7\\creatine_product_1782812125755.jpg';
  if (fs.existsSync(creatineImagePath)) {
    const fileStream = fs.createReadStream(creatineImagePath);
    form.append('images', fs.createReadStream(creatineImagePath));
    form.append('image', fs.createReadStream(creatineImagePath)); 
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
