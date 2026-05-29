import { products } from './src/app/data/products.js';
import https from 'https';

const checkUrl = (url) => new Promise((resolve) => {
  https.get(url, (res) => {
    resolve({ url, status: res.statusCode });
  }).on('error', (e) => {
    resolve({ url, status: 'error', message: e.message });
  });
});

(async () => {
  console.log('Checking ' + products.length + ' products...');
  for (const p of products) {
    const res = await checkUrl(p.image);
    console.log(`Product ${p.id} (${p.name}): ${res.status}`);
  }
  console.log('Done.');
})();
