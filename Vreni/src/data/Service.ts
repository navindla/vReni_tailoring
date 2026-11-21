
import { Service } from '../types/Service';

export const DEFAULT_SERVICES: Service[] = [
  { id: 'blouse', name: 'Blouse Stitching', category: 'Blouse', price: 500 },
  { id: 'designer-blouse', name: 'Designer Blouse', category: 'Blouse', price: 900 },
  { id: 'blouse-alteration', name: 'Blouse Alteration', category: 'Blouse', price: 150 },

  { id: 'kurti', name: 'Kurti Stitching', category: 'Dress Stitching', price: 600 },
  { id: 'salwar', name: 'Salwar Suit Stitching', category: 'Dress Stitching', price: 900 },
  { id: 'saree-frock', name: 'Saree to Frock', category: 'Dress Stitching', price: 1200 },

  { id: 'saree-fall', name: 'Saree Fall Stitching', category: 'Saree Work', price: 150 },
  { id: 'saree-pico', name: 'Saree Pico', category: 'Saree Work', price: 100 },
  { id: 'fall-pico', name: 'Fall + Pico', category: 'Saree Work', price: 220 },

  { id: 'waist', name: 'Waist Adjustment', category: 'Alterations', price: 120 },
  { id: 'length', name: 'Length Adjustment', category: 'Alterations', price: 100 },
  { id: 'sleeve', name: 'Sleeve Alteration', category: 'Alterations', price: 120 },
  { id: 'side-fitting', name: 'Side Fitting', category: 'Alterations', price: 120 },
  { id: 'zip', name: 'Zip Replacement', category: 'Alterations', price: 150 },
  { id: 'pant', name: 'Pant Alteration', category: 'Alterations', price: 150 },
];
