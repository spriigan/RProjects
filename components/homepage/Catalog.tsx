import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import ProductCard from '../ProductCard'

const Catalog = () => {
  const images = ['/archtv.png', '/arch.png','/arch1.jpg', '/arch2.jpg', '/arch3.png', '/arch4.jpg', '/arch5.jpg']
  const [products, setProducts] = useState<any>();
  useEffect(() => {
    axios.get('http://localhost:3001/product/').then(res => {
      console.log(res.data);
      setProducts(res.data);
    })
  }, [])
  
  return (
    <div className='bg-white'>
      <div className='max-w-2xl px-4 sm:py-24 sm:px-6 mx-auto lg:max-w-7xl py-16'>
        <h2 className='sr-only'>Products</h2>
        <div className='grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
          {
            Array.isArray(products) && products.map((data: any) => <ProductCard product={data} />)
          }
        </div>
      </div>
    </div>
  )
}

export default Catalog