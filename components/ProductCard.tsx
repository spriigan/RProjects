import Image from 'next/image'
import React from 'react'
type ProductCardProps = {
  imagePath: string;
  product: any;
}
const ProductCard = ({imagePath, product}: ProductCardProps) => {
  return (
    <div>
      <a href="#" className='group'>
        <div className='w-full rounded-lg overflow-hidden bg-gray'>
           <Image className='w-full object-center object-cover group-hover:opacity-75 h-full' src={imagePath} width='200' height={200} layout='responsive' />
        </div>
        <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
      </a>
    </div>
  )
}

export default ProductCard