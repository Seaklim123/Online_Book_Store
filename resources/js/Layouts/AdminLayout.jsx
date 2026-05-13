import React, { useEffect } from 'react';
import 'admin-lte/dist/css/adminlte.min.css'; 
import 'admin-lte/dist/js/adminlte.min.js';
import MenuSideBar from './MenuSideBar';
import $ from 'jquery';
import { Link, usePage } from '@inertiajs/react';

const AdminLayout = ({breadcrumb, children }) => {
    
    const { auth } = usePage().props; 
    
    const pendingOrdersCount = auth.pendingOrdersCount;
    const user = auth.user;

    useEffect(() => {
        $('[data-toggle="dropdown"]').dropdown();
    }, []);
    
    return (
        <div className="wrapper">
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="#" role="button">
                            <i className="fas fa-bars"></i>
                        </a>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">

                    <li className="nav-item">
                        <Link 
                            href={route('orders.index', { status: 'pending' })} 
                            className="nav-link"
                        >
                            <i className="fas fa-shopping-cart"></i> 
                            {pendingOrdersCount > 0 && (
                                <span className="badge badge-danger navbar-badge">
                                    {pendingOrdersCount}
                                </span>
                            )}
                        </Link>
                    </li>

                    <li className="nav-item dropdown">
                        <a className="nav-link" data-toggle="dropdown" href="#">
                            <i className="far fa-user"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right">
                            <Link href={route('profile.edit')} className="dropdown-item">Profile</Link>
                            <div className="dropdown-divider"></div>
                            <Link
                                className="dropdown-item"
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Logout
                            </Link>
                        </div>
                    </li>

                </ul>
            </nav>

            <MenuSideBar />

            <div className="content-wrapper">
                {breadcrumb && breadcrumb}
                <section className="content">{children}</section>
            </div>

            <footer className="main-footer">
                <strong>Copyright &copy; 2025</strong> All rights reserved.
            </footer>
        </div>
    );
};

export default AdminLayout;
