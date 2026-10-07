// ─── Erxes Client — Browser-side adapter ───
// Calls the Vercel serverless proxy at /api/erxes

const ERXES_PROXY = '/api/erxes';

async function erxesQuery(query, variables = {}) {
  const res = await fetch(ERXES_PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });

  if (!res.ok) {
    throw new Error('Erxes request failed: ' + res.status);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map(e => e.message).join('; '));
  }

  return json.data;
}

async function fetchErxesCategories() {
  const data = await erxesQuery(`{
    productCategories {
      _id
      name
      code
      parentId
      description
    }
  }`);
  return data.productCategories || [];
}

async function fetchErxesProducts() {
  const data = await erxesQuery(`{
    products {
      _id
      name
      code
      description
      unitPrice
      categoryId
      category { _id name code }
      attachment { url }
      attachments { url }
      customFieldsData
    }
  }`);
  return data.products || [];
}

// Fetch CMS posts from Erxes (Content > Posts)
async function fetchErxesCmsPosts(clientPortalId = '') {
  const variables = {};
  if (clientPortalId) variables.clientPortalId = clientPortalId;

  try {
    const data = await erxesQuery(`
      query CmsPosts($clientPortalId: String) {
        cmsPosts(clientPortalId: $clientPortalId) {
          _id
          title
          content
          categoryIds
          categories { _id name slug parentId }
          status
          createdAt
        }
      }
    `, variables);
    return data.cmsPosts || [];
  } catch (err) {
    console.error('fetchErxesCmsPosts error:', err.message);
    return [];
  }
}

// Map Erxes product to our room model
function mapErxesProductToRoom(product) {
  const images = [];
  if (product.attachment?.url) images.push(product.attachment.url);
  if (product.attachments) {
    product.attachments.forEach(a => { if (a.url) images.push(a.url); });
  }
  if (images.length === 0) images.push('images/camp-gers.jpg');

  // Try to parse capacity from custom fields or description
  let capacity = 2;
  const capMatch = (product.description || product.name || '').match(/(\d+)\s*хүн/i);
  if (capMatch) capacity = parseInt(capMatch[1]);

  return {
    id: 'room-' + product._id,
    name: product.name,
    capacity: capacity,
    beds: 'Том ор',
    price: product.unitPrice || 0,
    priceUnit: 'өдөр',
    shortDesc: product.description ? product.description.slice(0, 120) + (product.description.length > 120 ? '...' : '') : product.name,
    description: product.description || product.name,
    facilities: ['Wifi', 'Хувийн ариун цэврийн өрөө', 'Дулаахан хөнжил'],
    images: images,
    featured: true,
    _source: 'erxes',
    _erxesId: product._id
  };
}

// Map Erxes product to menu item
function mapErxesProductToMenuItem(product, categoryId) {
  return {
    id: 'm-' + product._id,
    category: categoryId,
    name: product.name,
    description: product.description ? product.description.slice(0, 80) : '',
    price: product.unitPrice || 0,
    _source: 'erxes',
    _erxesId: product._id
  };
}

// Map Erxes product to package
function mapErxesProductToPackage(product) {
  const images = [];
  if (product.attachment?.url) images.push(product.attachment.url);
  if (product.attachments) {
    product.attachments.forEach(a => { if (a.url) images.push(a.url); });
  }
  if (images.length === 0) images.push('images/camp-overview.jpg');

  return {
    id: 'pkg-' + product._id,
    name: product.name,
    people: '2+ хүн',
    duration: '1 хоног',
    price: product.unitPrice || 0,
    priceUnit: 'багц',
    type: 'family',
    shortDesc: product.description ? product.description.slice(0, 120) + (product.description.length > 120 ? '...' : '') : product.name,
    description: product.description || product.name,
    includes: ['Байрны түрээс', 'Хоолны үйлчилгээ', 'Wifi'],
    image: images[0],
    featured: true,
    _source: 'erxes',
    _erxesId: product._id
  };
}

// Load CMS posts and map them to local pages/events by category name
async function loadErxesCmsData() {
  try {
    const data = getData();
    const clientPortalId = data.settings.erxesClientPortalId || '';
    const posts = await fetchErxesCmsPosts(clientPortalId);

    if (posts.length === 0) {
      return { success: true, cmsCount: 0 };
    }

    if (!data.cms) data.cms = {};

    const categoryMap = {
      'Бидний тухай': 'about',
      'Байршил': 'location',
      'Ресторан': 'restaurant',
      'Хурим': 'wedding',
      'Гэр бүлийн баяр': 'family',
      'Байгууллагын арга хэмжээ': 'corporate',
      'Team building & Corporate events': 'corporate'
    };

    posts.forEach(post => {
      const categoryName = post.categories && post.categories[0] ? post.categories[0].name : '';
      const key = categoryMap[categoryName];
      if (!key) return;

      data.cms[key] = {
        id: post._id,
        title: post.title,
        content: stripHtml(post.content || ''),
        category: categoryName,
        _source: 'erxes'
      };

      // Also save English content if post title/content look English
      if (/^[A-Za-z\s&\-]+$/.test(post.title) && key !== 'about' && key !== 'location') {
        if (!data.cms[key + 'En']) data.cms[key + 'En'] = {};
        data.cms[key + 'En'] = {
          id: post._id,
          title: post.title,
          content: stripHtml(post.content || ''),
          category: categoryName,
          _source: 'erxes'
        };
      }
    });

    saveData(data);
    return { success: true, cmsCount: posts.length };
  } catch (err) {
    console.error('loadErxesCmsData error:', err);
    return { success: false, error: err.message };
  }
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Load Erxes data and merge with local data
async function loadErxesData() {
  try {
    const [categories, products] = await Promise.all([
      fetchErxesCategories(),
      fetchErxesProducts()
    ]);

    const data = getData();

    // Map category codes
    const catMap = {};
    categories.forEach(c => { catMap[c.code] = c._id; });

    // Filter products by category
    const roomProducts = products.filter(p => p.category?.code === '1' || p.categoryId === catMap['1']);
    const foodProducts = products.filter(p => p.category?.code === '2' || p.categoryId === catMap['2']);
    const packageProducts = products.filter(p => p.category?.code === '3' || p.categoryId === catMap['3']);

    if (roomProducts.length > 0) {
      data.rooms = roomProducts.map(mapErxesProductToRoom);
    }

    if (foodProducts.length > 0) {
      data.menu.items = foodProducts.map((p, i) => mapErxesProductToMenuItem(p, i % 2 === 0 ? 'lunch' : 'traditional'));
    }

    if (packageProducts.length > 0) {
      data.packages = packageProducts.map(mapErxesProductToPackage);
    }

    // Load CMS posts in parallel
    const cmsResult = await loadErxesCmsData();

    saveData(data);
    return {
      success: true,
      roomCount: roomProducts.length,
      foodCount: foodProducts.length,
      packageCount: packageProducts.length,
      cmsCount: cmsResult.cmsCount || 0
    };
  } catch (err) {
    console.error('loadErxesData error:', err);
    return { success: false, error: err.message };
  }
}
