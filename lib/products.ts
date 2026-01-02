export interface ProductSize {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  details: string; // Extended description for the product page
  price: number; // in cents
  image: string;
  currency: string;
  sizes?: ProductSize[]; // Optional sizes for products with variants
}

export const products: Product[] = [
  {
    id: 'striker-qc-green-malachite',
    name: 'STRIKER QC (Green Malachite)',
    description: 'High-performance climbing shoes with precision fit and superior grip.',
    details: 'The STRIKER QC in Green Malachite combines aggressive downturn with exceptional edging performance. Featuring a quick-closure system for easy on/off, sticky rubber outsole for maximum friction, and a snug fit that molds to your foot for precision on technical routes.',
    price: 49999, // RM499.99
    currency: 'myr',
    image: 'https://www.ocun.com/assets/products/1_700x700/zsxl3btjoh.04835-STRIKER-QC-Green-Malachite-1-1-.jpg',
    sizes: [
      { size: 'UK 5', stock: 1 },
      { size: 'UK 5.5', stock: 1 },
      { size: 'UK 6', stock: 2 },
      { size: 'UK 6.5', stock: 2 },
      { size: 'UK 7', stock: 2 },
      { size: 'UK 7.5', stock: 2 },
      { size: 'UK 8', stock: 1 },
      { size: 'UK 8.5', stock: 1 },
      { size: 'UK 9', stock: 1 },
    ],
  },
  {
    id: 'jett-qc',
    name: 'JETT QC',
    description: 'Versatile all-day climbing shoe perfect for gym and outdoor routes.',
    details: 'The JETT QC is designed for climbers who demand comfort without sacrificing performance. With a moderate downturn and breathable upper, these shoes excel on long climbing sessions. The quick-closure system ensures a secure fit, while the durable rubber rand provides protection and longevity.',
    price: 52999, // RM529.99
    currency: 'myr',
    image: 'https://www.ocun.com/assets/products/1_700x700/o4itpyk884.04041-Jett-QC-1.jpg',
    sizes: [
      { size: 'UK 5', stock: 1 },
      { size: 'UK 6', stock: 1 },
      { size: 'UK 6.5', stock: 2 },
      { size: 'UK 7', stock: 1 },
      { size: 'UK 7.5', stock: 1 },
      { size: 'UK 8', stock: 1 },
      { size: 'UK 8.5', stock: 1 },
      { size: 'UK 9', stock: 1 },
    ],
  },
  {
    id: 'gunung-ascent-tee',
    name: 'Gunung Ascent Tee',
    description: 'Premium cotton blend t-shirt designed for comfort on and off the crag.',
    details: 'The Gunung Ascent Tee is crafted from a breathable, heavyweight cotton blend that stands up to the abrasion of the rock while keeping you cool. Featuring a relaxed fit for unrestricted movement and our signature mountain motif on the back.',
    price: 3500, // $35.00
    currency: 'myr',
    image: '/gunung-tee-placeholder.png',
  },
  {
    id: 'gunung-chalk-bag',
    name: 'Gunung Chalk Bag',
    description: 'Hand-stitched chalk bag with fleece lining and secure closure.',
    details: 'Keep your hands dry and your focus sharp. Our chalk bag features a stiffened rim for easy access, a soft fleece lining to hold chalk effectively, and a tight closure system to prevent spills in your pack. Includes a brush loop and waist belt.',
    price: 8900, // $89.00
    currency: 'myr',
    image: '/gunung-chalkbag-placeholder.png',
  },
];
