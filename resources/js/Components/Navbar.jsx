import { Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import RegisterModal from '@/Components/RegisterModal';
import LoginModal from '@/Components/LoginModal';
import confirmPasswordModal, { disableTwoFactorModal } from '@/Pages/Auth/ConfirmPassword';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';


const Navbar = ({ auth, loginOpen, setLoginOpen, registerOpen, setRegisterOpen }) => {
const [isMenuOpen, setIsMenuOpen] = useState(false); 
const [open, setOpen] = useState(false);
const menuRef = useRef(null);
const { t } = useTranslation();

useEffect(() => {
    function handleClickOutside(e) {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setOpen(false);
        }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
 },[]);

const logout = () => {
    setOpen(false);
    Swal.fire({
        title: t('logging_out'),
        text: t('are_you_sure_you_want_to_logout'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', 
        cancelButtonColor: '#bda081', 
        confirmButtonText: t('yes_logout'),
        cancelButtonText: t('cancel')
    }).then((result) => {
        if (result.isConfirmed) {
            router.post(route('logout'), {}, {
                onSuccess: () => {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: t('logged_out_successfully'),
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        }
    });
};

const isAdmin = auth.user?.roles?.some(
     role => role.name.toLowerCase() === 'admin'
);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50 bg-[#bda081] text-white rounded-t-lg shadow-inner">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="text-xl md:text-2xl font-bold flex items-center">
                            <img
                                src="/images/jong an.png"
                                alt="Logo"
                                className="h-10 w-10 mr-2 rounded-full object-cover"
                            />
                            <span className="truncate text-white">{t('bookstore')}</span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-6">
                            <div className="flex items-center gap-2 ml-4">
                                <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}                                           
                                        className="text-sm bg-white/10 text-white border border-white/30 rounded-md px-2 py-1 cursor-pointer hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-white/50">
                                    <option value="en" className="text-black bg-white"><i className="fas fa-english"></i>English</option>
                                    <option value="kh" className="text-black bg-white"><i className="fas fa-cambodia"></i>ភាសាខ្មែរ</option>
                                </select>
                            </div>
                            <Link href="/customer/books" className="text-white hover:!text-blue-500 transition">{t('books')}</Link>
                            {auth.user ? (
                                <>
                                    {isAdmin ? (
                                        <Link href="/dashboard" className="text-white hover:!text-blue-500 transition">{t('dashboard')}</Link>
                                    ) : (
                                        <>
                                            <Link href="/cart" className="text-white hover:!text-blue-500 transition flex items-center gap-1 group">
                                                <div className="relative">
                                                    <span className="text-xl">🛒</span>
                                                    {auth.cartCount > 0 && (
                                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#bda081]">
                                                            {auth.cartCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </Link>
                                            <Link href="/customer/orders" className="text-white hover:!text-blue-500 transition">{t('orders')}</Link>
                                        </>
                                    )}
                                    <span className="text-sm font-medium">{t('hi')}, {auth.user.name}</span>
                                    <div className="relative" ref={menuRef}>
                                        <button
                                            onClick={() => setOpen(prev => !prev)}
                                            className="flex items-center focus:outline-none"
                                        >
                                            <i className="fas fa-user-circle text-2xl text-white hover:text-blue-500 transition"></i>
                                        </button>

                                        {open && (
                                            <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
                                                <button 
                                                    onClick={confirmPasswordModal}
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition"
                                                >
                                                    {t('enable_2fa')}
                                                </button>
                                               
                                                <button
                                                    onClick={logout}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                                                >
                                                    {t('logout')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <button onClick={() => setLoginOpen(true)} className=" hover:text-blue-500 transition">
                                        {t('login')}
                                    </button>
                                    <button onClick={() => setRegisterOpen(true)} className=" hover:text-blue-500 transition">
                                        {t('register')}
                                    </button>
                                    
                                </div>
                                
                            )}
                        </div>

                        <div className="md:hidden flex items-center">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 focus:outline-none"
                            >
                                <div className="space-y-1.5">
                                    <span className={`block w-6 h-0.5 bg-white transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                    <span className={`block w-6 h-0.5 bg-white ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                                    <span className={`block w-6 h-0.5 bg-white transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`md:hidden bg-[#bda081] overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen border-t border-[#a68b6d]' : 'max-h-0'}`}>
                    <div className="px-4 pt-2 pb-6 space-y-3">
                        <Link href="/customer/books" className="block py-2 hover:text-blue-200">{t('books')}</Link>
                        {auth.user ? (
                            <>
                                {isAdmin ? (
                                    <Link href="/dashboard" className="block py-2">{t('dashboard')}</Link>
                                ) : (
                                    <>
                                        <Link href="/cart" className="flex items-center py-2">{t('cart')} ({auth.cartCount || 0})</Link>
                                        <Link href="/customer/orders" className="block py-2">{t('orders')}</Link>
                                    </>
                                )}
                                <div className="pt-2 border-t border-[#a68b6d]">
                                    <p className="text-sm mb-3 text-blue-100 italic font-medium">{t('hi')}, {auth.user.name}</p>
                                    <button onClick={logout} className="fas fa-user-circle">{t('logout')}</button>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <button onClick={() => setLoginOpen(true)} className="border border-white py-2 rounded-lg font-bold">{t('Login')}</button>
                                <button onClick={() => setRegisterOpen(true)} className="bg-white text-[#bda081] py-2 rounded-lg font-bold">{t('Register')}</button>
                            </div>
                        )}
                    </div>
                </div>

                <LoginModal 
                    isOpen={loginOpen} 
                    onClose={() => setLoginOpen(false)} 
                    onOpenRegister={() => {
                        setLoginOpen(false);
                        setRegisterOpen(true);
                    }}
                    canResetPassword={true} 
                />

                <RegisterModal 
                    isOpen={registerOpen} 
                    onClose={() => setRegisterOpen(false)}
                    onOpenLogin={() => {
                        setRegisterOpen(false);
                        setLoginOpen(true);
                    }}
                />
            </nav>
        </>
    );
};

export default Navbar;
