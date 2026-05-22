import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';
import axios from 'axios';

const confirmPasswordModal = () => {
    return Swal.fire({
        title: 'Confirm Password',
        text: 'Please confirm your password to enable 2FA',
        input: 'password',
        inputPlaceholder: 'Enter your password',
        inputAttributes: { autocapitalize: 'off', autocorrect: 'off' },
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#bda081',
        cancelButtonColor: '#6b7280',
        preConfirm: async (password) => {
            if (!password) {
                Swal.showValidationMessage('Password is required');
                return false;
            }
            try {
                await axios.post('/user/confirm-password', { password });
                return true;
            } catch {
                Swal.showValidationMessage('Wrong password. Please try again.');
                return false;
            }
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            return await enableTwoFactor();
        }

        return false;
    });
};

const enableTwoFactor = async () => {
    try {
        await axios.post('/user/two-factor-authentication');

        const qrResponse = await axios.get('/user/two-factor-qr-code');
        const qrSvg = qrResponse.data.svg;

        const { isConfirmed } = await Swal.fire({
            title: 'Scan QR Code',
            html: `
                <p class="text-sm text-gray-500 mb-4">
                    Scan this QR code with your authenticator app<br/>
                    (Google Authenticator, Authy, etc.)
                </p>
                <div class="flex justify-center mb-4">${qrSvg}</div>
                <p class="text-sm text-gray-500 mb-2">Then enter the 6-digit code:</p>
                <input 
                    id="swal-2fa-code" 
                    type="text" 
                    maxlength="6"
                    placeholder="000000"
                    class="swal2-input" 
                    style="letter-spacing:0.5em; font-size:1.5rem; text-align:center; width:180px;"
                />
            `,
            showCancelButton: true,
            confirmButtonText: 'Verify & Enable',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#bda081',
            cancelButtonColor: '#6b7280',
            preConfirm: async () => {
                const code = document.getElementById('swal-2fa-code').value;
                if (!code || code.length !== 6) {
                    Swal.showValidationMessage('Please enter the 6-digit code');
                    return false;
                }
                try {
                    await axios.post('/user/confirmed-two-factor-authentication', { code });
                    return true;
                } catch {
                    Swal.showValidationMessage('Invalid code. Please try again.');
                    return false;
                }
            }
        });

        if (isConfirmed) {
            await showRecoveryCodes();
            return true;
        } else {
            await axios.delete('/user/two-factor-authentication');
            return false;
        }

    } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong.', confirmButtonColor: '#bda081' });
    }
};

const showRecoveryCodes = async () => {
    try {
        const response = await axios.get('/user/two-factor-recovery-codes');
        const codes = response.data;

        await Swal.fire({
            title: '🎉 2FA Enabled!',
            html: `
                <p class="text-sm text-gray-600 mb-3">
                    <strong>Save these recovery codes</strong> in a safe place.
                </p>
                <div style="background:#f3f4f6; padding:12px; border-radius:8px; font-family:monospace; text-align:left;">
                    ${codes.map(code => `<div style="padding:2px 0;">${code}</div>`).join('')}
                </div>
            `,
            confirmButtonText: 'Done, I saved them!',
            confirmButtonColor: '#bda081',
            allowOutsideClick: false,
        });

        router.reload();

    } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Could not load recovery codes.', confirmButtonColor: '#bda081' });
    }
};

export const disableTwoFactorModal = () => {
     return Swal.fire({
        title: 'Disable 2FA',
        text: 'Confirm your password to disable Two-Factor Authentication',
        input: 'password',
        inputPlaceholder: 'Enter your password',
        inputAttributes: { autocapitalize: 'off', autocorrect: 'off' },
        showCancelButton: true,
        confirmButtonText: 'Disable 2FA',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        preConfirm: async (password) => {
            if (!password) {
                Swal.showValidationMessage('Password is required');
                return false;
            }
            try {
                await axios.post('/user/confirm-password', { password });
                return true;
            } catch {
                Swal.showValidationMessage('Wrong password. Please try again.');
                return false;
            }
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.delete('/user/two-factor-authentication');

                await Swal.fire({
                    icon: 'success',
                    title: '2FA Disabled',
                    text: 'Two-Factor Authentication has been disabled.',
                    confirmButtonColor: '#bda081',
                    timer: 2000,
                    showConfirmButton: false,
                });

                router.reload();
                    
            } catch {
                Swal.fire({ 
                    icon: 'error', 
                    title: 'Error', 
                    text: 'Could not disable 2FA.', 
                    confirmButtonColor: '#bda081' 
                });
                return false;
            }
        }
    });
};

export default confirmPasswordModal;