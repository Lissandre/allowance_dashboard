<?php

namespace Database\Factories;

use App\Models\Allowance;
use Illuminate\Database\Eloquent\Factories\Factory;

class AllowanceFactory extends Factory
{
    protected $model = Allowance::class;

    public function definition()
    {
        return [
            'contract_address' => '0x' . $this->faker->sha1,
            'owner_address' => '0x' . $this->faker->sha1,
            'spender_address' => '0x' . $this->faker->sha1,
            'allowance_amount' => $this->faker->randomFloat(18, 0, 1000000),
        ];
    }

    /**
     * Configure the factory to create an allowance for a specific owner.
     */
    public function forOwner(string $ownerAddress)
    {
        return $this->state(function (array $attributes) use ($ownerAddress) {
            return [
                'owner_address' => $ownerAddress,
            ];
        });
    }

    /**
     * Configure the factory to create an allowance for a specific contract.
     */
    public function forContract(string $contractAddress)
    {
        return $this->state(function (array $attributes) use ($contractAddress) {
            return [
                'contract_address' => $contractAddress,
            ];
        });
    }
}
