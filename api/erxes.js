// Vercel serverless function: proxy to Erxes GraphQL API
// Reads admin credentials from environment variables:
//   ERXES_URL, ERXES_EMAIL, ERXES_PASSWORD

let cachedToken = null;
let tokenExpiry = 0;

async function loginToErxes() {
  const url = process.env.ERXES_URL || 'https://mondetourcamp.next.erxes.io/gateway/graphql';
  const email = process.env.ERXES_EMAIL || 'info@erxes.io';
  const password = process.env.ERXES_PASSWORD || 'KOL#$1()jko';

  if (!email || !password) {
    throw new Error('ERXES_EMAIL and ERXES_PASSWORD environment variables are required');
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation { login(email: "${email}", password: "${password}") }`
    })
  });

  const cookies = res.headers.get('set-cookie');
  if (!cookies) {
    throw new Error('Erxes login failed: no auth cookie returned');
  }

  const match = cookies.match(/auth-token=([^;]+)/);
  if (!match) {
    throw new Error('Erxes login failed: auth-token cookie not found');
  }

  cachedToken = match[1];
  // Tokens are valid for 14 days; refresh after 12 days to be safe
  tokenExpiry = Date.now() + 12 * 24 * 60 * 60 * 1000;
  return cachedToken;
}

async function getErxesToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }
  return loginToErxes();
}

module.exports = async (req, res) => {
  // Enable CORS for the frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.ERXES_URL || 'https://mondetourcamp.next.erxes.io/gateway/graphql';

  try {
    const token = await getErxesToken();

    const erxesRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `auth-token=${token}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await erxesRes.json();
    return res.status(erxesRes.status).json(data);
  } catch (err) {
    console.error('Erxes proxy error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
