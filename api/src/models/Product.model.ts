import { Document, Schema } from 'mongoose';
import { Address } from './User';

export type ProductDocument = Document & {
  name: string;
  emporium: { _id: string; name: string; addresses: Address[] };
  category: string[];
  picture: string[];
  description: string;
  manufacture: string;
  dimension: any;
  price: number;
  stock: number;
};

const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, require: true },
});
