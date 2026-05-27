import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/FooterGuest';
import { useTranslation } from 'react-i18next';

export default function Welcome({ auth, bestSellers = [], watchlistIds = [] }) {
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);
    const { t } = useTranslation();

    const [scrollY, setScrollY] = useState(0);
    

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  
    const handleAddToCart = (bookId) => {
        if (!auth?.user) {
            setLoginOpen(true); 
            return;
        }
        router.post(route('cart.add', { book: bookId }), { quantity: 1 }, { preserveScroll: true });
    };

    const handleViewBook = (bookId) => {
        router.get(route('books.show', bookId));
    };

    const addToWatchlist = (bookId) => {
        router.post(`/watchlist/${bookId}`);
        setLocalWatchlist(prev => [...prev, bookId]);
    };

    return (
        <>
            <Head title="Welcome to BookStore" />
            <Navbar auth={auth} 
                loginOpen={loginOpen} 
                setLoginOpen={setLoginOpen}
                registerOpen={registerOpen}
                setRegisterOpen={setRegisterOpen}
            /> 

            <div className="min-h-screen bg-[#f5eadf] text-stone-800">
         
                <div className="relative min-h-[90vh] flex items-center pt-20">
                    <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-block px-4 py-1 rounded-full bg-white/60 text-stone-600 text-sm font-serif mb-6 backdrop-blur">
                                Discover Your Next Favorite Book
                            </span>

                            <h1 className="text-6xl md:text-8xl font-serif leading-tight mb-8">
                                Stories That <br />
                                <span className="italic text-[#bd874e]">Stay With You</span>
                            </h1>

                            <p className="text-xl text-stone-600 mb-10 max-w-lg leading-relaxed">
                                Explore curated collections, timeless classics, and modern bestsellers — all in one place.
                            </p>
                            <Link href="/customer/books" className="bg-stone-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-stone-800">Explore Library</Link>
                        </div>
                        <div className="hidden lg:block">
                            <img src="/images/book.jpg" className="rounded-3xl shadow-2xl h-[600px] object-cover w-full" alt="Hero Book" />
                        </div>
                    </div>
                </div>

                <div className="py-20 bg-white/20">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-serif text-center mb-12">{t('our_best_sellers')}</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {bestSellers && bestSellers.length > 0 ? (
                                bestSellers.map((book) => (
                                    <div key={book.id} className="relative group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100">
                                       
                                        <div className="relative aspect-[2/3] overflow-hidden bg-gray-200 cursor-pointer" onClick={() => handleViewBook(book.id)}>
                                            <img 
                                                src={book.image_url || '/images/no-book.png'} 
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                                                alt={book.title} 
                                            />
                                            
                                            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-lg">
                                                <span className="text-sm font-bold text-gray-900">${book.price}</span>
                                            </div>

                                            {book.is_best_seller && (
                                                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg rotate-[-5deg]">
                                                    BEST SELLER
                                                </div>
                                            )}

                                             <button
                                                onClick={() => addToWatchlist(book.id)}
                                                className={`group absolute top-2 right-2 z-20 p-2 rounded-full shadow transition
                                                
                                                    ${watchlistIds.includes(book.id)
                                                        ? 'bg-red-500'
                                                        : 'bg-white hover:bg-red-500'
                                                    }
                                                `}
                                            >
                                                <i
                                                    className={`fas fa-heart
                                                    
                                                        ${watchlistIds.includes(book.id)
                                                            ? 'text-white'
                                                            : 'text-[#bda081] group-hover:text-red-500'
                                                        }
                                                    `}
                                                ></i>
                                            </button>
                                        </div>

                                       
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="text-sm font-bold text-gray-900 truncate mb-1">{book.title}</h3>
                                            <p className="text-xs text-gray-500 truncate mb-2">{book.author}</p>
                                            <div>
                                                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded uppercase font-semibold">
                                                    {book.category_name || 'General'}
                                                </span>
                                            </div>
                                            
                                            <button 
                                                onClick={() => handleAddToCart(book.id)}
                                                className="mt-4 w-full bg-[#bda081] hover:bg-[#a68b6d] text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                            >
                                                <i className="fas fa-shopping-cart"></i>{t('add_to_cart')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 bg-white/10 rounded-3xl border-2 border-dashed border-stone-300">
                                    <p className="text-stone-500 font-serif">{t('no_best_sellers_found')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}
