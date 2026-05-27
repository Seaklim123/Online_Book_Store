import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/FooterGuest';
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";

export default function Index({ watchlists, auth }) {

    const { t } = useTranslation();

    const [filteredBooks, setFilteredBooks] = useState([]);

    useEffect(() => {

        const books = watchlists.map(item => item.book);

        setFilteredBooks(books);

    }, [watchlists]);

    const handleViewBook = (bookId) => {
        router.get(`/customer/books/${bookId}`);
    };

    const handleAddToCart = (bookId, quantity = 1) => {

        router.post(route('cart.add', { book: bookId }), {
            quantity: quantity
        }, {
            onSuccess: () => {

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: t('Book added to cart!'),
                    showConfirmButton: false,
                    timer: 2000,
                });

            }
        });
    };

    const removeFromWatchlist = (bookId) => {

        router.delete(`/watchlist/remove/${bookId}`, {

            onSuccess: () => {

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: t('Removed from watch list'),
                    showConfirmButton: false,
                    timer: 2000,
                });

            }
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f5eadf]">

            <Head title="My Watch List" />

            <Navbar auth={auth} />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

                <h1 className="text-3xl font-bold mb-10 text-[#bda081]">
                    {t('My Watch List')}
                </h1>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

                    {filteredBooks.length > 0 ? (

                        filteredBooks.map((book) => (

                            <div
                                key={book.id}
                                className="relative group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100"
                            >

                                <div
                                    className="relative aspect-[2/3] overflow-hidden bg-gray-200 cursor-pointer"
                                    onClick={() => handleViewBook(book.id)}
                                >

                                    <img
                                        src={
                                            book.cover_image
                                                ? `/storage/${book.cover_image}`
                                                : '/images/no-book.png'
                                        }
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        alt={book.title}
                                    />

                                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-lg">

                                        {book.discounted_price ? (
                                            <>
                                                <span className="text-sm font-bold text-gray-500 line-through mr-1">
                                                    ${book.price}
                                                </span>

                                                <span className="text-sm font-bold text-gray-900">
                                                    ${book.discounted_price}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-sm font-bold text-gray-900">
                                                ${book.price}
                                            </span>
                                        )}

                                    </div>
                                </div>

                                <button
                                    onClick={() => removeFromWatchlist(book.id)}
                                    className="group absolute top-2 right-2 z-20 bg-white p-2 rounded-full shadow transition hover:bg-red-500"
                                >
                                    <i className="fas fa-heart text-red-500 group-hover:text-white"></i>
                                </button>

                                <div className="p-3 flex flex-col flex-grow">

                                    <div className="flex-grow">

                                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-[#bda081] transition-colors">
                                            {book.title}
                                        </h3>

                                        <p className="text-[11px] text-gray-500 mb-2 truncate">
                                            {book.author}
                                        </p>

                                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-md mb-3">
                                            {book.category?.name || 'General'}
                                        </span>

                                    </div>

                                    <div className="flex gap-2 mt-auto">

                                        <button
                                            disabled={book.stock === 0}
                                            onClick={() => {
                                                if (book.stock > 0) {
                                                    handleAddToCart(book.id);
                                                }
                                            }}
                                            className={`w-full text-xs font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm
                                                
                                                ${book.stock === 0
                                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                                    : 'bg-[#bda081] hover:bg-[#a68b6d] text-white'
                                                }
                                            `}
                                        >

                                            <span>
                                                {book.stock === 0
                                                    ? t('Out of Stock')
                                                    : t('add_to_cart')
                                                }
                                            </span>

                                        </button>

                                        <button
                                            onClick={() => handleViewBook(book.id)}
                                            className="w-full text-white bg-[#bda081] hover:bg-[#a68b6d] text-[11px] font-medium py-1 rounded-xl transition-colors"
                                        >
                                            {t('view_details')}
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))

                    ) : (

                        <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-inner">

                            <p className="text-gray-400 text-lg">
                                {t('No books in watch list')}
                            </p>

                        </div>

                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}