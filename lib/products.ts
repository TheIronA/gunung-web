export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  image: string;
  currency: string;
}

export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'Gunung Ascent Tee',
    description: 'Premium cotton blend t-shirt designed for comfort on and off the crag.',
    price: 3500, // $35.00
    currency: 'myr',
    image: '/images/products/tee.jpg',
  },
  {
    id: 'prod_2',
    name: 'Gunung Chalk Bag',
    description: 'Hand-stitched chalk bag with fleece lining and secure closure.',
    price: 8900, // $89.00
    currency: 'myr',
    image: '/images/products/chalk-bag.jpg',
  },
];
