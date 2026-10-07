// ─── Monde Tour Resort — Seed Data ───
// This data is loaded into localStorage on first visit.
// Admin panel edits update this localStorage copy.

const defaultData = {
  settings: {
    siteName: "Monde Tour",
    tagline: "Байгальтай ойрхон, тав тухтай амралтыг танд",
    phone: "+976 9911 2233",
    email: "info@mondetour.mn",
    address: "Тэрэлж, Говьсүмбэр аймаг, Монгол",
    facebook: "https://facebook.com/mondetour",
    instagram: "https://instagram.com/mondetour",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937604!2d107.430995!3d47.89437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDUzJzM5LjciTiAxMDfCsDI1JzUxLjYiRQ!5e0!3m2!1sen!2smn!4v1699999999999!5m2!1sen!2smn",
    mapLink: "https://maps.google.com/?q=47.894370,107.430995",
    businessHours: "24 цагаар (24/7)",
    seoTitle: "Monde Tour — Тэрэлж дэх байгалийн амралтын газар",
    seoDescription: "Monde Tour амралтын газар: гэр бааз, өрөө, хоол, багц, хурим, багийн бүтээлч ажил, гэр бүлийн баяр. Тэрэлж, Монгол."
  },

  rooms: [
    {
      id: "room-1",
      name: "Стандарт гэр",
      capacity: 2,
      beds: "1 том ор",
      price: 180000,
      priceUnit: "өдөр",
      shortDesc: "Уламжлалт гэрт орчин үеийн тав тухыг хослуулсан өрөө.",
      description: "Монгол гэрийн уламжлалт загварыг орчин үеийн тав тухтай хослуулсан стандарт гэр. Дотор талдаа дулаахан, цэвэрхэн бөгөөд байгалийн үзэсгэлэнт харагдах цонхтой. Хосууд болон ганцаараа аялагчдад тохиромжтой.",
      facilities: ["Дулаахан хөнжил", "Хувийн ариун цэврийн өрөө", "Wifi", "Усан халаагч", "Цэвэрлэгээ", "Хөгжмийн систем"],
      images: ["images/camp-gers.jpg", "images/camp-overview.jpg", "images/camp-entrance.jpg"],
      featured: true
    },
    {
      id: "room-2",
      name: "Гэр бүлийн гэр",
      capacity: 5,
      beds: "1 том ор + 1 нэмэлт ор",
      price: 320000,
      priceUnit: "өдөр",
      shortDesc: "Гэр бүл, найз нөхдийн хамт амрахад зориулсан өргөн гэр.",
      description: "Гэр бүл, найз нөхөдтэйгээ хамт амрахад идеал. Өргөн талбай, нэмэлт ор, хүүхдэд ээлтэй орчинтой. Гадаа талбайд гал тогоо, суудалтай.",
      facilities: ["5 хүний багтаамж", "Хувийн ариун цэврийн өрөө", "Wifi", "Хөргөгч", "Цай, кофе", "Гадаа суудал"],
      images: ["images/camp-overview.jpg", "images/camp-gers.jpg", "images/camp-entrance.jpg"],
      featured: true
    },
    {
      id: "room-3",
      name: "VIP байшин",
      capacity: 4,
      beds: "2 том ор",
      price: 450000,
      priceUnit: "өдөр",
      shortDesc: "Премиум тав тух, өргөн талбай, байгалийн сайхан үзэмж.",
      description: "Модон байшинд бүрэн тохижуулсан VIP өрөө. Өргөн талбай, том цонх, байгалийн үзэсгэлэнт харагдах тагтантай. Онцгой амралт хайгчдад зориулав.",
      facilities: ["Тагтан", "Жакузи", "Мини бар", "Wifi", "Кондиционер", "Өглөөний цай", "Хувийн зоогийн өрөө"],
      images: ["images/camp-entrance.jpg", "images/camp-overview.jpg", "images/camp-gers.jpg"],
      featured: true
    },
    {
      id: "room-4",
      name: "Хамтын өрөө",
      capacity: 8,
      beds: "4 давхар ор",
      price: 280000,
      priceUnit: "өдөр",
      shortDesc: "Залуус, багийн аялалд зориулсан хямд өрөө.",
      description: "Залуус, дунд сургуулийн анги, багаар аялагчдад зориулсан хамтын өрөө. Цэвэрхэн, аюулгүй, эдийн засгийн хувьд хэмнэлттэй сонголт.",
      facilities: ["8 хүний багтаамж", "Хамтын ариун цэврийн өрөө", "Wifi", "Хөргөгч", "Хувцасны шүүгээ", "Тоглоомын тавцан"],
      images: ["images/camp-overview.jpg", "images/camp-gers.jpg"],
      featured: false
    }
  ],

  packages: [
    {
      id: "pkg-1",
      name: "Гэр бүлийн багц",
      people: "2-5 хүн",
      duration: "1 хоног",
      price: 520000,
      priceUnit: "багц",
      type: "family",
      shortDesc: "Гэр бүлээрээ амрах бүрэн багц: өрөө, хоол, үйлчилгээ багтсан.",
      description: "Гэр бүлээрээ чөлөөт цагийг үр дүнтэй өнгөрүүлэхэд зориулсан бүрэн багц. Өглөө, өдөр, оройн хоол, байгальтай танилцах аялал, хүүхдийн тоглоомын талбай багтсан.",
      includes: ["Гэр бүлийн гэр 1 шөнийн түрээс", "Өглөө, өдөр, оройн хоол", "Байгальтай танилцах аялал", "Хүүхдийн тоглоомын талбай", "Галын түүдэг", "Wifi"],
      image: "images/camp-overview.jpg",
      featured: true
    },
    {
      id: "pkg-2",
      name: "Хосуудын романтик багц",
      people: "2 хүн",
      duration: "1 хоног",
      price: 420000,
      priceUnit: "багц",
      type: "couple",
      shortDesc: "Хосуудын амралт, романтик орчин, онцгой үйлчилгээ.",
      description: "Хосуудын амралт, төрсөн өдөр, гэрлэлтийн ойн баярт зориулсан романтик багц. Оройн үдэшлэг, мөнгөн гэрэлтүүлэг, онцгой хоолны цэс багтсан.",
      includes: ["Стандарт гэр 1 шөнийн түрээс", "Романтик оройн хоол", "Өглөөний цай", "Мөнгөн гэрэлтүүлэг", "Цэцгэн баглаа", "Wifi"],
      image: "images/camp-gers.jpg",
      featured: true
    },
    {
      id: "pkg-3",
      name: "Байгууллагын Team Building",
      people: "10-50 хүн",
      duration: "1-2 хоног",
      price: 150000,
      priceUnit: "хүн/өдөр",
      type: "corporate",
      shortDesc: "Багийн бүтээлч ажил, уулзалт, хөгжөөнт тоглоом багтсан.",
      description: "Байгууллагын баг хамт олныг бэхжүүлэх, урам зориг өгөх team building багц. Уулзалтын өрөө, хөгжөөнт тоглоом, хоол, байр, хөтөлбөр багтсан.",
      includes: ["Байрны тохиргоо", "Уулзалтын өрөө", "Хөгжөөнт тоглоомууд", "Бүх хоол", "Автобус зохион байгуулалт", "Event coordinator"],
      image: "images/camp-entrance.jpg",
      featured: true
    },
    {
      id: "pkg-4",
      name: "Хуримын event багц",
      people: "20-120 хүн",
      duration: "1-2 хоног",
      price: 0,
      priceUnit: "захиалгаар",
      type: "event",
      shortDesc: "Хурим, томоохон баярын арга хэмжээнд зориулсан багц.",
      description: "Хурим, хүрэлцэн ирсэн зочдын баяр, төрсөн өдрийн томоохон арга хэмжээнд зориулсан бүрэн багц. Зоог, чимэглэл, хөгжим, байр, зургийн багц гэх мэт.",
      includes: ["Хуримын талбай", "Зоогийн үйлчилгээ", "Чимэглэлийн сонголт", "Хөгжмийн систем", "Зочдын байр", "Event coordinator", "Зургийн багц"],
      image: "images/camp-overview.jpg",
      featured: false
    }
  ],

  menu: {
    categories: [
      { id: "breakfast", name: "Өглөөний цай" },
      { id: "lunch", name: "Өдрийн хоол" },
      { id: "dinner", name: "Оройн хоол" },
      { id: "traditional", name: "Уламжлалт хоол" },
      { id: "beverages", name: "Ундаа" }
    ],
    items: [
      { id: "m-1", category: "breakfast", name: "Сүүтэй будаа", description: "Уламжлалт монгол өглөөний цай", price: 12000 },
      { id: "m-2", category: "breakfast", name: "Боорцог", description: "Гэрийн нөхцөлд хийсэн шүүсэн боорцог", price: 8000 },
      { id: "m-3", category: "breakfast", name: "Өндөг, талх, цай", description: "Өглөөний хөнгөн сет", price: 15000 },
      { id: "m-4", category: "lunch", name: "Хорхог", description: "Чулуун дотор хийсэн уламжлалт хорхог", price: 45000 },
      { id: "m-5", category: "lunch", name: "Гуляш", description: "Махан гуляш шарсан төмстэй", price: 28000 },
      { id: "m-6", category: "lunch", name: "Будаа, шөл", description: "Уламжлалт хоолны сет", price: 22000 },
      { id: "m-7", category: "dinner", name: "Нарийн махан хуурга", description: "Нарийн махан хуурга, ногооны хольцтой", price: 35000 },
      { id: "m-8", category: "dinner", name: "Шарсан загас", description: "Сүүлийн шарсан загас, ногоотой", price: 32000 },
      { id: "m-9", category: "traditional", name: "Цуйван", description: "Гоймонтой цуйван", price: 20000 },
      { id: "m-10", category: "traditional", name: "Бууз", description: "Монгол гэрийн бууз", price: 18000 },
      { id: "m-11", category: "beverages", name: "Салхины цай", description: "Улаан цай, сүү", price: 5000 },
      { id: "m-12", category: "beverages", name: "Кофе", description: "Американо, латте", price: 7000 }
    ]
  },

  events: [
    {
      id: "evt-1",
      category: "corporate",
      title: "Байгууллагын team building",
      description: "Багийн бүтээлч ажил, уулзалт, хөгжөөнт тоглоом, хоол, байр багтсан бүрэн багц.",
      features: ["10-120 хүртэлх хүний багтаамж", "Уулзалтын өрөө", "Спорт талбай", "Хөгжөөнт тоглоом", "Бүх хоол", "Event coordinator"],
      image: "images/camp-entrance.jpg"
    },
    {
      id: "evt-2",
      category: "wedding",
      title: "Хуримын арга хэмжээ",
      description: "Байгалийн сайхан үзэмж, том талбай, зоогийн үйлчилгээ бүхий хуримын төлөвлөлт.",
      features: ["120 хүртэлх зочин", "Хуримын талбай", "Зоогийн үйлчилгээ", "Чимэглэл", "Хөгжим, гэрэлтүүлэг", "Зургийн багц"],
      image: "images/camp-overview.jpg"
    },
    {
      id: "evt-3",
      category: "family",
      title: "Гэр бүлийн баяр",
      description: "Төрсөн өдөр, ойн баяр, гэр бүлийн уулзалт зэрэг дотно арга хэмжээнд зориулсан.",
      features: ["20-60 хүний багтаамж", "Хувийн талбай", "Төрсөн өдрийн чимэглэл", "Хоолны сонголт", "Хүүхдийн тоглоомын талбай", "Галын түүдэг"],
      image: "images/camp-gers.jpg"
    }
  ],

  gallery: [
    { id: "g-1", category: "resort", src: "images/camp-overview.jpg", title: "Баазын бүрэн харагдац" },
    { id: "g-2", category: "nature", src: "images/hero-bg.jpg", title: "Тэрэлжийн байгаль" },
    { id: "g-3", category: "rooms", src: "images/camp-gers.jpg", title: "Монгол гэр" },
    { id: "g-4", category: "resort", src: "images/camp-entrance.jpg", title: "Орц, хаалга" },
    { id: "g-5", category: "food", src: "images/camp-overview.jpg", title: "Хоолны үйлчилгээ" },
    { id: "g-6", category: "events", src: "images/camp-gers.jpg", title: "Event талбай" },
    { id: "g-7", category: "nature", src: "images/hero-bg.jpg", title: "Уул, ой" },
    { id: "g-8", category: "services", src: "images/camp-entrance.jpg", title: "Үйлчилгээний талбай" }
  ],

  bookings: [],

  pages: {
    about: {
      title: "Бидний тухай",
      content: "Monde Tour нь Тэрэлжийн байгалийн үзэсгэлэн бүрдэл дунд орших тав тухтай амралтын газар юм. Бид байгальтай ойрхон, орчин үеийн үйлчилгээтэй, уламжлалт зочломтгой Монгол соёлыг хослуулсан амралтын туршлагыг санал болгодог. Гэр бүл, хосууд, найз нөхөд, байгууллагын баг бүрт тохирсон өрөө, багц, хоол, event үйлчилгээгээс сонгоорой."
    }
  }
};

// Initialize localStorage if empty
function initData() {
  if (!localStorage.getItem('mondeTourData')) {
    localStorage.setItem('mondeTourData', JSON.stringify(defaultData));
  }
}

function getData() {
  initData();
  return JSON.parse(localStorage.getItem('mondeTourData'));
}

function saveData(data) {
  localStorage.setItem('mondeTourData', JSON.stringify(data));
}

function resetData() {
  localStorage.setItem('mondeTourData', JSON.stringify(defaultData));
}

// Format currency
function formatPrice(price) {
  if (price === 0) return 'Захиалгаар';
  return new Intl.NumberFormat('mn-MN').format(price) + ' ₮';
}

// Safe text escape
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
