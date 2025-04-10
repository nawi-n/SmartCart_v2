import { Link } from 'react-router-dom';

const Footer = () => {
  const categories = [
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Beauty',
    'Toys & Games',
    'Sports',
    'Books',
    'Automotive',
  ];

  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Press', path: '/press' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const helpLinks = [
    { name: 'Payments', path: '/payments' },
    { name: 'Shipping', path: '/shipping' },
    { name: 'Returns', path: '/returns' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <Link to={`/category/${category.toLowerCase()}`} className="hover:text-flipkart-yellow">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-flipkart-yellow">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-flipkart-yellow">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="mb-2">Email: support@smartcart.com</p>
            <p className="mb-2">Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Smart Street, Tech City, TC 12345</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} SmartCart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 