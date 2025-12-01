export interface Product {
  id: string;
  name: string;
  description: string;
  details: string; // Extended description for the product page
  price: number; // in cents
  image: string;
  currency: string;
}

export const products: Product[] = [
  {
    id: 'gunung-ascent-tee',
    name: 'Gunung Ascent Tee',
    description: 'Premium cotton blend t-shirt designed for comfort on and off the crag.',
    details: 'The Gunung Ascent Tee is crafted from a breathable, heavyweight cotton blend that stands up to the abrasion of the rock while keeping you cool. Featuring a relaxed fit for unrestricted movement and our signature mountain motif on the back.',
    price: 3500, // $35.00
    currency: 'myr',
    image: '/images/products/tee.jpg',
  },
  {
    id: 'gunung-chalk-bag',
    name: 'Gunung Chalk Bag',
    description: 'Hand-stitched chalk bag with fleece lining and secure closure.',
    details: 'Keep your hands dry and your focus sharp. Our chalk bag features a stiffened rim for easy access, a soft fleece lining to hold chalk effectively, and a tight closure system to prevent spills in your pack. Includes a brush loop and waist belt.',
    price: 8900, // $89.00
    currency: 'myr',
    image: '/images/products/chalk-bag.jpg',
  },
];
