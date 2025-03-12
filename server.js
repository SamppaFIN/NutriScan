const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 5000;

// Mock product data for the barcode API
const mockProducts = {
  '6411401026539': {
    id: '6411401026539',
    name: 'Valio Oivariini 400g',
    brand: 'Valio',
    description: 'Butter and vegetable oil spread, 75% fat',
    image: '/assets/products/oivariini.png',
    ingredients: 'Butter (cream, salt), vegetable oil (rapeseed), water, salt (1.2%)',
    nutritionalInfo: {
      energy: '2775 kJ / 675 kcal',
      fat: '75 g',
      saturatedFat: '45 g',
      carbohydrates: '0.8 g',
      sugar: '0.8 g',
      protein: '0.6 g',
      salt: '1.2 g'
    },
    allergens: ['milk'],
    eNumbers: [],
    recyclable: 'Container: Plastic - Recycle. Lid: Plastic - Recycle.',
    countryOfOrigin: 'Finland'
  },
  '6410405096296': {
    id: '6410405096296',
    name: 'Fazer Ruispalat 6kpl/330g',
    brand: 'Fazer',
    description: 'Rye bread slices',
    image: '/assets/products/ruispalat.png',
    ingredients: 'Rye flour (56%), water, wheat flour, rye malt, wheat gluten, barley malt extract, yeast, salt (1.1%), E471',
    nutritionalInfo: {
      energy: '1050 kJ / 250 kcal',
      fat: '1.5 g',
      saturatedFat: '0.2 g',
      carbohydrates: '45 g',
      sugar: '2.5 g',
      fiber: '10 g',
      protein: '9 g',
      salt: '1.1 g'
    },
    allergens: ['wheat', 'rye', 'barley', 'gluten'],
    eNumbers: ['E471'],
    recyclable: 'Package: Plastic - Recycle',
    countryOfOrigin: 'Finland'
  }
};

// Simple API routes
const handleApiRequest = (req, res, pathname) => {
  // API endpoints
  if (pathname === '/api/product') {
    // Get query parameters
    const queryObject = url.parse(req.url, true).query;
    const barcode = queryObject.barcode;
    
    if (!barcode) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Barcode parameter is required' }));
      return;
    }
    
    // Look up product by barcode
    const product = mockProducts[barcode];
    if (product) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(product));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Product not found' }));
    }
    return;
  }
  
  // Return 404 for other API endpoints
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'API endpoint not found' }));
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  console.log(`Request received: ${pathname}`);
  
  // Handle API requests
  if (pathname.startsWith('/api/')) {
    handleApiRequest(req, res, pathname);
    return;
  }
  
  // Default to index.html for root or undefined paths
  let filePath = './public/index.html';
  
  // If a specific path is requested, use that instead
  if (pathname !== '/' && pathname !== undefined) {
    filePath = './public' + pathname;
  }
  
  // Determine the content type based on file extension
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
  }
  
  // Read and serve the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // For SPA routing, serve index.html for all non-file paths
        fs.readFile('./public/index.html', (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Server Error: Could not serve index.html');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}/`);
  console.log(`API endpoints:`);
  console.log(` - GET /api/product?barcode=BARCODE_NUMBER`);
});