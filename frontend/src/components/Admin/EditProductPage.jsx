import React, { useState } from 'react'

const EditProductPage = () => {
    const [productData , setProductData] = useState({
      name:"",
      description:"",
      price: 0,
      countInStock: 0,
      sku:"",
      category: "",
      brand: "",
      sizes: [],
      colors: [],
      collections:"",
      material:"",
      gender:"",
      images:[
        {
          url: "https://picsum.photos.150?random=1",
        },
        {
          url: "https://picsum.photos.150?random=2",
        },
      ]
    })  

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <form>
        {/* name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
        </div>
      </form>
    </div>
  )
}

export default EditProductPage