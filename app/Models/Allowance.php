<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Allowance extends Model
{
    protected $fillable = [
        'contract_address',
        'owner_address',
        'spender_address',
        'allowance_amount'
    ];
}
