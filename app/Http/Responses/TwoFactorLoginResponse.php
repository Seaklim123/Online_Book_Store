<?php

namespace App\Http\Responses;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;

class TwoFactorLoginResponse implements TwoFactorLoginResponseContract
{
    public function toResponse($request): RedirectResponse
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Load roles relationship
        if (!$user->relationLoaded('roles')) {
            $user->load('roles');
        }

        // If admin role → dashboard
        if ($user->hasRole('admin')) {
            return redirect()->route('dashboard');
        }

        // Otherwise → welcome (customer)
        return redirect()->route('welcome');
    }
}