<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Login');
    }

    public function connect(Request $request)
    {
        $validated = $request->validate([
            'address' => ['required', 'string', 'regex:/^0x[a-fA-F0-9]{40}$/']
        ]);

        $user = User::firstOrCreate(
            ['wallet_address' => $validated['address']],
            ['wallet_address' => $validated['address']]
        );

        Auth::login($user);

        return redirect()->route('allowances.index');
    }

    public function disconnect()
    {
        Auth::logout();
        return redirect()->route('login');
    }
}
