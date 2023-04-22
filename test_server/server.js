const http = require('http');
const { StringDecoder } = require('string_decoder');

const server = http.createServer((req, res) => {
  // Set CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // If the client is sending data, log it to the console
  if (req.method === 'POST') {
    let data = '';
    const decoder = new StringDecoder('utf8');

    req.on('data', (chunk) => {
      data += decoder.write(chunk);
    });

    req.on('end', () => {
      data += decoder.end();

      console.log('Data received:', data);
      console.log('Content-Type:', req.headers['content-type']);
      console.log('Content-Length:', req.headers['content-length']);
      console.log('User-Agent:', req.headers['user-agent']);
      console.log('Referer:', req.headers['referer']);

      // Parse the multipart/form-data and log all fields
      const boundary = req.headers['content-type'].split(';')[1].split('=')[1];
      const parts = data.split(`--${boundary}`);

      console.log('Fields:');
      for (const part of parts) {
        if (part.trim() !== '' && !part.startsWith('--')) {
            try {
                const lines = part.trim().split('\r\n');
                const headers = lines.slice(0, -2);
                const body = lines.slice(-2, -1)[0];
                const fieldName = headers[1].split(';')[1].split('=')[1];
                console.log(`${fieldName}: ${body}`);
            } catch(e) {
                console.error(e.message)
            }
          
        }
      }

      res.end('Data received');
    });
  } else {
    // If the client is not sending data, return a simple message
    console.log('Request received:', req.url);
    console.log('User-Agent:', req.headers['user-agent']);
    console.log('Referer:', req.headers['referer']);
    res.end('Server is running');
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
