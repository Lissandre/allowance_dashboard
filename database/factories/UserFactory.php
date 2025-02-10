<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        return [
            'wallet_address' => '0x' . substr($this->faker->sha1, 0, 40),
        ];
    }

    /**
     * Configure the factory to create a user with a specific wallet address.
     */
    public function withWalletAddress(string $address)
    {
        return $this->state(function (array $attributes) use ($address) {
            return [
                'wallet_address' => $address,
            ];
        });
    }
}
