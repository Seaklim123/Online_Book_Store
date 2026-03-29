import Breadcrumb from '@/Components/Breadcrumb';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import NavLink from '@/Components/NavLink';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SecondaryButtonLink from '@/Components/SecondaryButtonLink';
import AdminLayout from '@/Layouts/AdminLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import moment from 'moment';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function UserPage({ users }) {
    const { auth } = usePage().props;
    const can = auth?.can ?? {}; 
    
    const datasList = users.data;
    const [confirmingDataDeletion, setConfirmingDataDeletion] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [resetTargetUser, setResetTargetUser] = useState(null);
    const [dataEdit, setDataEdit] = useState({})
    const { data: deleteData, setData: setDeleteData, delete: destroy, processing, reset, errors, clearErrors } =
        useForm({
            id: '',
            name: ''
        });

    const {
        data: resetPasswordData,
        setData: setResetPasswordData,
        patch: patchResetPassword,
        processing: processingResetPassword,
        reset: resetResetPassword,
        errors: resetPasswordErrors,
        clearErrors: clearResetPasswordErrors,
    } = useForm({
        password: '',
        password_confirmation: '',
    });

    const confirmDataDeletion = (data) => {
        setDataEdit(data);
        setDeleteData('id', data.id)
        setDeleteData('name', data.name)
        setConfirmingDataDeletion(true);
    };
    const closeModal = () => {
        setConfirmingDataDeletion(false);
        setDataEdit({})
        clearErrors();
        reset();
    };

    const deleteDataRow = (e) => {
        e.preventDefault();
        destroy(route('users.destroy', dataEdit.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };
    const headWeb = 'User List'
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];

    const handleBlockUser = async (user) => {
        const action = user?.is_blocked ? 'unblock' : 'block';

        const result = await Swal.fire({
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
            text: `Are you sure you want to ${action} ${user.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: action === 'block' ? '#d33' : '#16a34a',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Yes, ${action}`,
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) {
            return;
        }

        router.patch(route('users.block', user.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: `User ${action}ed successfully`,
                    showConfirmButton: false,
                    timer: 1800,
                    timerProgressBar: true,
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: `Unable to ${action} this user.`,
                });
            },
        });
    };

    const handleResetPassword = (user) => {
        setResetTargetUser(user);
        setShowResetPasswordModal(true);
    };

    const closeResetPasswordModal = () => {
        setShowResetPasswordModal(false);
        setResetTargetUser(null);
        resetResetPassword();
        clearResetPasswordErrors();
    };

    const submitResetPassword = (e) => {
        e.preventDefault();

        if (!resetTargetUser) {
            return;
        }

        patchResetPassword(route('users.reset-password', resetTargetUser.id), {
            preserveScroll: true,
            onSuccess: () => closeResetPasswordModal(),
        });
    };
    
    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />} >
            <Head title={headWeb} />
            <section className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-outline card-info">
                            <div className="card-header">
                                <h3 className="card-title">
                                    Datalist Management
                                </h3>
                                <div className="card-tools">
                                    <div className="input-group input-group-sm" style={{ width: '150px' }}>
                                        <input type="text" name="table_search" className="form-control float-right" placeholder="Search" />
                                        <div className="input-group-append">
                                            <button type="submit" className="btn btn-default">
                                                <i className="fas fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body table-responsive p-0">
                                <table className="table table-hover text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>#ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Created At</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                   
                                    <tbody>
                                        {datasList.length > 0 ?
                                            datasList.map((item, k) => (
                                                <tr key={k}>
                                                    <td>{item?.id}</td>
                                                    <td>{item?.name}</td>
                                                    <td>{item?.email}</td>
                                                    <td>
                                                        {item?.roles.length > 0 ? (
                                                            item.roles.map(role => (
                                                                <span key={role.id} className="badge badge-info mr-1">
                                                                    {role.name}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="badge badge-info mr-1">customer</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {item?.is_blocked ? (
                                                            <span className="badge badge-danger">Blocked</span>
                                                        ) : (
                                                            <span className="badge badge-success">Active</span>
                                                        )}
                                                    </td>
                                                    <td>{moment(item?.created_at).format("DD/MM/YYYY")}</td>
                                                    <td width={'280px'}>
                                                        {can['user-edit'] && (
                                                            <>
                                                                <Link href={route('users.edit', item.id)} className="btn btn-info btn-xs mr-2 mb-1">
                                                                    <i className='fas fa-edit'></i> Edit
                                                                </Link>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleBlockUser(item)}
                                                                    className={`btn btn-xs mr-2 mb-1 ${item?.is_blocked ? 'btn-success' : 'btn-warning'}`}
                                                                >
                                                                    <i className={`fas ${item?.is_blocked ? 'fa-unlock' : 'fa-ban'}`}></i>{' '}
                                                                    {item?.is_blocked ? 'Unblock' : 'Block'}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleResetPassword(item)}
                                                                    className="btn btn-secondary btn-xs mb-1"
                                                                >
                                                                    <i className="fas fa-key"></i> Reset Password
                                                                </button>
                                                            </>
                                                        )}
                                                        {/* <button onClick={() => confirmDataDeletion(item)} type="button" className="btn btn-danger btn-xs">
                                                            <i className='fas fa-trash'></i> Delete
                                                        </button> */}
                                                    </td>
                                                </tr>
                                            ))
                                            :
                                            <tr>
                                                <td colSpan={5}>There are no record!</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                                <Modal show={confirmingDataDeletion} onClose={closeModal}>
                                    <form onSubmit={deleteDataRow} className="p-6">
                                        <h2 className="text-lg font-medium text-gray-900">
                                            Confirmation!
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Are you sure you want to delete <span className='text-lg font-medium'>{deleteData.name}</span>?
                                        </p>
                                        <div className="mt-6 flex justify-end">
                                            <SecondaryButton onClick={closeModal}>No</SecondaryButton>
                                            <DangerButton className="ms-3" disabled={processing}>Yes</DangerButton>
                                        </div>
                                    </form>
                                </Modal>

                                <Modal show={showResetPasswordModal} onClose={closeResetPasswordModal}>
                                    <form onSubmit={submitResetPassword} className="p-6">
                                        <h2 className="text-lg font-medium text-gray-900">
                                            Reset Password
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Set a new password for <span className="font-medium">{resetTargetUser?.name}</span>.
                                        </p>

                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                                            <input
                                                type="password"
                                                value={resetPasswordData.password}
                                                onChange={(e) => setResetPasswordData('password', e.target.value)}
                                                className="mt-1 block w-full form-control"
                                                minLength={8}
                                                required
                                            />
                                            <InputError className="mt-2" message={resetPasswordErrors.password} />
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={resetPasswordData.password_confirmation}
                                                onChange={(e) => setResetPasswordData('password_confirmation', e.target.value)}
                                                className="mt-1 block w-full form-control"
                                                minLength={8}
                                                required
                                            />
                                            <InputError className="mt-2" message={resetPasswordErrors.password_confirmation} />
                                        </div>

                                        <div className="mt-6 flex justify-end">
                                            <SecondaryButton type="button" onClick={closeResetPasswordModal}>Cancel</SecondaryButton>
                                            <PrimaryButton className="ms-3" disabled={processingResetPassword}>Save</PrimaryButton>
                                        </div>
                                    </form>
                                </Modal>
                            </div>

                            <div className="card-footer clearfix">
                                <Pagination links={users.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
