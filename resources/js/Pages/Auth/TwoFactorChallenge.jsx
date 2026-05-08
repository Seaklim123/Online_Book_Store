import React, { useState, useRef, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticationCard from "@/Components/AuthenticationCard";
import AuthenticationCardLogo from "@/Components/AuthenticationCardLogo";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Checkbox from "@/Components/Checkbox";

const TwoFactorChallenge = () => {
    const [recovery, setRecovery] = useState(false);
    const recoveryCodeInput = useRef(null);
    const codeInput = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        code: "",
        recovery_code: "",
        remember_device: false,
    });

    const toggleRecovery = () => {
        setRecovery((prevRecovery) => !prevRecovery);
    };

    useEffect(() => {
        if (recovery) {
            recoveryCodeInput.current?.focus();
            setData("code", "");
        } else {
            codeInput.current?.focus();
            setData("recovery_code", "");
        }
    }, [recovery]);

    const submit = (e) => {
        e.preventDefault();
        post(route("two-factor.login"));
    };

    return (
        <>
            <Head title="Verify Your Identity" />
            <AuthenticationCard>
                <AuthenticationCardLogo className="w-20 h-20" />

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        {!recovery ? "Enter Authentication Code" : "Use Recovery Code"}
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Secure your account with two-factor authentication
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <svg
                            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div className="text-sm text-blue-800">
                            {!recovery ? (
                                <>
                                    <p className="font-semibold mb-1">Open your authenticator app</p>
                                    <p className="text-xs text-blue-700">
                                        Use Google Authenticator, Microsoft Authenticator, or Authy to find the 6-digit code.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="font-semibold mb-1">Use a saved recovery code</p>
                                    <p className="text-xs text-blue-700">
                                        Enter one of the emergency codes you saved when setting up 2FA.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {!recovery ? (
                        <div>
                            <InputLabel htmlFor="code" value="Authentication Code" />
                            <TextInput
                                id="code"
                                ref={codeInput}
                                value={data.code}
                                onChange={(e) => {
                                    const value = e.target.value
                                        .replace(/[^0-9]/g, "")
                                        .slice(0, 6);
                                    setData("code", value);
                                }}
                                type="text"
                                inputMode="numeric"
                                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ddac78] text-center text-2xl tracking-widest font-mono"
                                autoFocus
                                autoComplete="one-time-code"
                                maxLength="6"
                                placeholder="000000"
                            />
                            <InputError message={errors.code} className="mt-2" />
                        </div>
                    ) : (
                        <div>
                            <InputLabel htmlFor="recovery_code" value="Recovery Code" />
                            <TextInput
                                id="recovery_code"
                                ref={recoveryCodeInput}
                                value={data.recovery_code}
                                onChange={(e) =>
                                    setData("recovery_code", e.target.value)
                                }
                                type="text"
                                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ddac78] uppercase"
                                autoComplete="off"
                                placeholder="ABCDEF-GHIJKL"
                            />
                            <InputError message={errors.recovery_code} className="mt-2" />
                        </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <label className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded transition">
                            <Checkbox
                                name="remember_device"
                                checked={data.remember_device}
                                onChange={(e) =>
                                    setData("remember_device", e.target.checked)
                                }
                            />
                            <span className="ms-3 text-sm font-medium text-gray-700">
                                Trust this device for 30 days
                            </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-2 ml-8">
                            You won't be asked for a code on this device again
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={processing || (!recovery && data.code.length < 6) || (recovery && !data.recovery_code.trim())}
                        className="w-full bg-[#bda081] text-white py-3 rounded-lg font-semibold hover:bg-[#ddac78] transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {processing ? "Verifying..." : "Verify & Login"}
                    </button>
                </form>

                <div className="mt-6 text-center border-t pt-4">
                    <button
                        type="button"
                        onClick={toggleRecovery}
                        className="text-[#bda081] hover:text-[#ddac78] text-sm font-semibold transition"
                    >
                        {!recovery ? (
                            <>
                                <svg
                                    className="w-4 h-4 inline mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Can't access your authenticator app?
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-4 h-4 inline mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Back to authentication code
                            </>
                        )}
                    </button>
                </div>
            </AuthenticationCard>
        </>
    );
};

export default TwoFactorChallenge;