export default async function handler(req, res) {
  // Determine target backend URL
  const rawTarget =
    process.env.RENDER_URL ||
    process.env.VITE_API_BASE_URL ||
    process.env.BACKEND_URL ||
    '';

  let targetBase = rawTarget.trim().replace(/\/+$/, '');

  // If no backend URL configured in Vercel environment variables
  if (!targetBase || targetBase.includes('your-backend-service.onrender.com')) {
    return res.status(503).json({
      success: false,
      error: 'BACKEND_NOT_CONFIGURED',
      message:
        'Vercel Frontend is not connected to a backend. ' +
        'Please add VITE_API_BASE_URL in Vercel Settings -> Environment Variables (e.g. https://<your-service>.onrender.com/api) and Redeploy.',
    });
  }

  // Enforce HTTPS on remote services
  if (targetBase.startsWith('http://') && !targetBase.includes('localhost') && !targetBase.includes('127.0.0.1')) {
    targetBase = targetBase.replace('http://', 'https://');
  }

  if (!targetBase.endsWith('/api')) {
    targetBase = `${targetBase}/api`;
  }

  const subpath = req.url.replace(/^\/api/, '');
  const destinationUrl = `${targetBase}${subpath}`;

  try {
    const fetchHeaders = {};
    if (req.headers['authorization']) fetchHeaders['authorization'] = req.headers['authorization'];
    if (req.headers['content-type']) fetchHeaders['content-type'] = req.headers['content-type'];
    if (req.headers['accept']) fetchHeaders['accept'] = req.headers['accept'];

    const fetchOptions = {
      method: req.method,
      headers: fetchHeaders,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
      fetchHeaders['content-type'] = 'application/json';
    }

    const response = await fetch(destinationUrl, fetchOptions);
    const contentType = response.headers.get('content-type') || 'application/json';

    res.status(response.status);
    res.setHeader('content-type', contentType);

    const data = await response.text();
    return res.send(data);
  } catch (err) {
    return res.status(502).json({
      success: false,
      error: 'PROXY_GATEWAY_ERROR',
      message: `Could not reach backend at ${destinationUrl}: ${err.message}`,
    });
  }
}
