import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/solid';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // In a real app, this would fetch from the API
    const mockProduct = {
      id: parseInt(id),
      name: 'Smartphone X',
      price: 699.99,
      category: 'Electronics',
      image: 'https://source.unsplash.com/random/400x400/?smartphone',
      rating: 4.5,
      description: 'The latest smartphone with cutting-edge features and performance.',
      specifications: {
        'Display': '6.5" AMOLED',
        'Processor': 'Snapdragon 8 Gen 2',
        'RAM': '12GB',
        'Storage': '256GB',
        'Camera': '50MP + 12MP + 8MP',
        'Battery': '5000mAh',
      },
      reviews: [
        {
          id: 1,
          user: 'John Doe',
          rating: 5,
          comment: 'Amazing phone! The camera quality is outstanding.',
          date: '2024-03-15',
        },
        {
          id: 2,
          user: 'Jane Smith',
          rating: 4,
          comment: 'Great performance, but battery life could be better.',
          date: '2024-03-10',
        },
      ],
    };
    setProduct(mockProduct);
  }, [id]);

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white rounded-lg p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">({product.rating})</span>
          </div>

          <p className="text-2xl font-bold text-flipkart-blue">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-gray-600">{product.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button className="btn-primary flex-1">
              <ShoppingCartIcon className="h-5 w-5 inline-block mr-2" />
              Add to Cart
            </button>
            <button className="btn-secondary flex-1">
              <HeartIcon className="h-5 w-5 inline-block mr-2" />
              Add to Wishlist
            </button>
          </div>

          {/* Specifications */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
        <div className="space-y-6">
          {product.reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{review.user}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-gray-500 text-sm">{review.date}</span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 