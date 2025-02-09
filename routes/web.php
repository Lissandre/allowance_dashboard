<?php

use App\Http\Controllers\Auth\WalletController;
use App\Http\Controllers\AllowanceController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('allowances.index');
});

Route::controller(WalletController::class)->group(function () {
    Route::get('/login', 'showLogin')->name('login');
    Route::post('/login', 'connect')->name('wallet.connect');
    Route::post('/disconnect', 'disconnect')->name('wallet.disconnect');
});

Route::middleware('auth')->group(function () {
    Route::controller(AllowanceController::class)
        ->prefix('allowances')
        ->name('allowances.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/create', 'create')->name('create');
            Route::get('/{allowance}', 'get')->name('get');
            Route::post('/', 'store')->name('store');
            Route::patch('/{allowance}', 'update')->name('update');
            Route::delete('/{allowance}', 'destroy')->name('destroy');
        });
});
