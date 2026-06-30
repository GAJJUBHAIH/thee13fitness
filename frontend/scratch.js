import fs from 'fs';
import path from 'path';
import https from 'https';

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle redirect
        resolve(fetchHtml(res.headers.location));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function searchYoutube(query) {
  try {
    const html = await fetchHtml(`https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' exercise form tutorial')}`);
    const match = html.match(/"videoId":"([^"]{11})"/);
    if (match && match[1]) {
      return match[1];
    }
  } catch (e) {
    console.error(`Error searching for ${query}:`, e.message);
  }
  return null;
}

async function main() {
  const filePath = path.join(process.cwd(), 'src/data/muscles.js');
  let content = fs.readFileSync(filePath, 'utf-8');

  const exerciseMatches = [...content.matchAll(/\{\s*name:\s*'([^']+)',\s*sets:.*?\}/g)];
  console.log(`Found ${exerciseMatches.length} exercises. Processing...`);

  for (const match of exerciseMatches) {
    const exName = match[1];
    
    // Check if it already has a videoId
    const blockRegex = new RegExp(`(\\{\\s*name:\\s*'${exName}'.*?)(,\\s*videoId:\\s*'([^']+)')?\\s*\\}`);
    const exBlock = content.match(blockRegex);
    
    // I previously inserted some video IDs, let's just refresh all of them to be safe, 
    // or if we only want missing ones we could skip, but user said "search on yt for relatede exe nad place them for every exesie"
    
    console.log(`Searching for: ${exName}`);
    const videoId = await searchYoutube(exName);
    if (videoId) {
      console.log(`Found videoId for ${exName}: ${videoId}`);
      content = content.replace(blockRegex, `$1, videoId: '${videoId}' }`);
    } else {
      console.log(`No videoId found for ${exName}`);
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('Done updating muscles.js');
}

main();
