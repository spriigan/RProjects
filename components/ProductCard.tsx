import Image from 'next/image'
import React from 'react'
type ProductCardProps = {
  product: any;
}
const ProductCard = ({product}: ProductCardProps) => {
  return (
    <div>
      <a href="#" className='group'>
        <div className='w-full rounded-lg overflow-hidden bg-gray'>
           <Image className='w-full object-center object-cover group-hover:opacity-75 h-full' src={`http://localhost:3001/product/products-picture/${product.pictures[0]}`} width='200' height={200} layout='responsive' />
        </div>
        <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">{`$${product.price}`}</p>
      </a>
    </div>
  )
}

export default ProductCard