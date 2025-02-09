<?php

namespace App\Http\Controllers;

use App\Models\Allowance;
use App\Http\Requests\UpdateAllowanceRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AllowanceController extends Controller
{
    public function index()
    {
        $walletAddress = Auth::user()->wallet_address;
        $allowances = Allowance::where('owner_address', $walletAddress)->get();

        return Inertia::render('Allowances/Index', [
            'allowances' => $allowances
        ]);
    }

    public function create()
    {
        return Inertia::render('Allowances/Create');
    }

    public function get(Allowance $allowance)
    {
        if ($allowance->owner_address !== Auth::user()->wallet_address) {
            return redirect()->back()->withErrors(['owner_address' => 'Unauthorized owner address.']);
        }

        return Inertia::render('Allowances/Update', [
            'allowance' => $allowance
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'contract_address' => 'required|string|regex:/^0x[a-fA-F0-9]{40}$/',
            'owner_address' => 'required|string|regex:/^0x[a-fA-F0-9]{40}$/',
            'spender_address' => 'required|string|regex:/^0x[a-fA-F0-9]{40}$/',
            'allowance_amount' => 'required|string|regex:/^\d*\.?\d*$/'
        ]);

        if ($validated['owner_address'] !== Auth::user()->wallet_address) {
            return redirect()->back()->withErrors(['owner_address' => 'Unauthorized owner address.']);
        }

        Allowance::create($validated);

        return redirect()->route('allowances.index');
    }

    public function update(UpdateAllowanceRequest $request, Allowance $allowance)
    {
        try {
            DB::beginTransaction();

            $allowance->update($request->validated());

            DB::commit();

            return redirect()
                ->route('allowances.index')
                ->with('success', 'Allowance updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to update allowance'])
                ->withInput();
        }
    }

    public function destroy(Allowance $allowance)
    {
        if ($allowance->owner_address !== Auth::user()->wallet_address) {
            return redirect()->back()->withErrors(['owner_address' => 'Unauthorized owner address.']);
        }

        $allowance->delete();

        return redirect()->route('allowances.index');
    }
}
