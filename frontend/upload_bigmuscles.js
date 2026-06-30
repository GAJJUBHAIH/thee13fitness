import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';

const pb = new PocketBase('http://127.0.0.1:8090');

async function uploadProducts() {
  await pb.collection('users').authWithPassword('admin@three13.com', 'admin1234567890');

  try {
    // 1. Upload Premium Gold Whey
    const wheyData = new FormData();
    wheyData.append('name', 'BigMuscles Nutrition Premium Gold Whey');
    wheyData.append('description', 'Advanced whey protein blend featuring high-quality isolate and concentrate. 25g Protein, 11g EAAs, 5.5g BCAAs, Zero Sugar per serving. Perfect for muscle recovery and growth.');
    wheyData.append('price', 1699);
    wheyData.append('original_price', 2499);
    wheyData.append('category', 'Supplements');
    wheyData.append('active', true);
    wheyData.append('rating', 4.5);
    
    const wheyFlavors = ["Chocolate", "Vanilla", "Strawberry", "Cookies & Cream"];
    wheyData.append('flavors', JSON.stringify(wheyFlavors));
    
    const wheySizes = ["1kg", "2kg", "5lbs"];
    wheyData.append('sizes', JSON.stringify(wheySizes));

    const wheyImagesDir = 'C:\\Users\\gajju\\Downloads\\New folder (7)';
    if (fs.existsSync(wheyImagesDir)) {
      const wheyFiles = fs.readdirSync(wheyImagesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
      if (wheyFiles.length > 0) {
        for (let i = 0; i < Math.min(3, wheyFiles.length); i++) {
          const fp = path.join(wheyImagesDir, wheyFiles[i]);
          const buf = fs.readFileSync(fp);
          const blob = new Blob([buf], { type: 'image/jpeg' });
          wheyData.append('images', blob, wheyFiles[i]);
          if (i === 0) wheyData.append('image', blob, wheyFiles[i]);
        }
      }
    }

    const wheyRecord = await pb.collection('products').create(wheyData);
    console.log('Successfully created Whey product:', wheyRecord.id);

    // 2. Upload Creatine
    const creatineData = new FormData();
    creatineData.append('name', 'BigMuscles Nutrition Creatine Monohydrate');
    creatineData.append('description', '100% Pure Creatine Monohydrate to boost strength, increase power output, and enhance muscle volume. 3g pure creatine per serving. Unflavored and easily mixable.');
    creatineData.append('price', 499);
    creatineData.append('original_price', 899);
    creatineData.append('category', 'Supplements');
    creatineData.append('active', true);
    creatineData.append('rating', 4.8);
    
    const creatineFlavors = ["Unflavored"];
    creatineData.append('flavors', JSON.stringify(creatineFlavors));
    
    const creatineSizes = ["100g", "250g"];
    creatineData.append('sizes', JSON.stringify(creatineSizes));

    const creatineImagePath = 'C:\\Users\\gajju\\.gemini\\antigravity\\brain\\9325cab7-3ff7-4e8a-9a4a-09d69ba67cb7\\creatine_product_1782812125755.jpg';
    if (fs.existsSync(creatineImagePath)) {
      const buf = fs.readFileSync(creatineImagePath);
      const blob = new Blob([buf], { type: 'image/jpeg' });
      creatineData.append('images', blob, 'creatine.jpg');
      creatineData.append('image', blob, 'creatine.jpg');
    }

    const creatineRecord = await pb.collection('products').create(creatineData);
    console.log('Successfully created Creatine product:', creatineRecord.id);

  } catch (err) {
    console.error('Failed to create product:', err);
    if (err.data) console.error(err.data);
  }
}

uploadProducts();
