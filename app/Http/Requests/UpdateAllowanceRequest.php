<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAllowanceRequest extends FormRequest
{
    public function authorize()
    {
        return Auth::user()->wallet_address === $this->route('allowance')->owner_address;
    }

    public function rules()
    {
        return [
            'allowance_amount' => ['required', 'string', 'regex:/^\d*\.?\d*$/'],
        ];
    }

    public function messages()
    {
        return [
            'allowance_amount.required' => 'The allowance amount is required.',
            'allowance_amount.regex' => 'The allowance amount must be a valid number.',
        ];
    }
}
