<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AllowanceResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'contract_address' => $this->contract_address,
            'owner_address' => $this->owner_address,
            'spender_address' => $this->spender_address,
            'allowance_amount' => $this->allowance_amount,
            'updated_at' => $this->updated_at,
            'created_at' => $this->created_at,
        ];
    }
}
