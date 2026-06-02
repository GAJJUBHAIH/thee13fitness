const fs = require('fs');
const path = require('path');

const files = [
  'src/data/muscles.js',
  'src/data/trainers.js',
  'src/components/sections/Gallery.jsx',
  'src/components/sections/MusclePanel.jsx',
  'src/components/sections/Transformations.jsx',
  'src/pages/Store.jsx',
  'src/three/ModelBody.jsx',
  'src/constants/config.js'
];

files.forEach(f => {
  const filePath = path.join(__dirname, f);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/'\/assets\/([^']+)'/g, "`${import.meta.env.BASE_URL}assets/$1`");
    content = content.replace(/"\/assets\/([^"]+)"/g, "`${import.meta.env.BASE_URL}assets/$1`");
    content = content.replace(/`\/assets\/\$\{/g, "`${import.meta.env.BASE_URL}assets/${");
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${f}`);
  } else {
    console.log(`File not found: ${f}`);
  }
});
console.log('All files updated successfully!');
