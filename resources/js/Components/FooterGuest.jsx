import { Link } from '@inertiajs/react';

const Footer = () => {
    return (
        <footer className="bg-[#bda081] text-white mt-12 rounded-b-lg shadow-inner">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4"><i className='fas fa-book'></i> Bookstore</h3>
                        <p className="text-black">
                            Your one-stop shop for all your reading needs.
                            Discover thousands of books across all genres.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href={route('welcome')} className="text-black hover:text-blue-500">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href={route('customer.books.index')} className="text-black hover:text-blue-500">
                                    Books
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-black hover:text-blue-500">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-black hover:text-blue-500">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-black">
                            <li><i className="fas fa-envelope"></i> Email: info@bookstore.com</li>
                            <li><i className="fas fa-phone"></i> Phone: +885 234 567 890</li>
                            <li><i className="fas fa-map-marker-alt"></i> Address: 123 Book Street, Reading City</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-black">
                    <p>&copy; {new Date().getFullYear()} Bookstore. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
