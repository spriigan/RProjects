import { Document, Schema } from 'mongoose';

export type ProductDocument = Document & {
  name: string;
  emporiumId: string;
  category: {
    _id: string;
    name: string;
  };
  description: string;
  manufacture: string;
  dimension: any;
  price: number;
  stock: number;
};

const ProductSchema = new Schema({
  name: { type: String },
});
