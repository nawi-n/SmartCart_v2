import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#172337] text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-gray-400 font-medium mb-4 text-sm uppercase">ABOUT</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Flipkart Stories
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Press
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Corporate Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-gray-400 font-medium mb-4 text-sm uppercase">HELP</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:underline">
                  Payments
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Cancellation & Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Report Infringement
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h3 className="text-gray-400 font-medium mb-4 text-sm uppercase">POLICY</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:underline">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Terms Of Use
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-400 font-medium mb-4 text-sm uppercase">CONTACT US</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>1800 202 9898</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>support@flipkart.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  Flipkart Internet Private Limited, Buildings Alyssa, Begonia & Clove Embassy Tech Village, Outer Ring
                  Road, Devarabeesanahalli Village, Bengaluru, 560103, Karnataka, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm">&copy; {new Date().getFullYear()} Flipkart.com. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white" />
              </Link>
              <Link href="#" aria-label="YouTube">
                <Youtube className="h-5 w-5 text-gray-400 hover:text-white" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
