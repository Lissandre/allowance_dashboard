<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WalletControllerTest extends TestCase
{
    use RefreshDatabase;

    private string $validWalletAddress = '0x1234567890123456789012345678901234567890';

    /**
     * Test login page displays correctly
     */
    public function test_login_page_is_displayed(): void
    {
        $response = $this->get(route('login'));

        $response->assertStatus(200)
            ->assertInertia(
                fn($assert) => $assert
                    ->component('Login')
            );
    }

    /**
     * Test wallet connection with valid address
     */
    public function test_wallet_can_connect_with_valid_address(): void
    {
        $response = $this->post(route('wallet.connect'), [
            'address' => $this->validWalletAddress
        ]);

        $response->assertRedirect(route('allowances.index'));

        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', [
            'wallet_address' => $this->validWalletAddress
        ]);
    }

    /**
     * Test wallet connection with invalid address format
     */
    public function test_wallet_cannot_connect_with_invalid_address(): void
    {
        $response = $this->post(route('wallet.connect'), [
            'address' => 'invalid-address'
        ]);

        $response->assertSessionHasErrors(['address']);
        $this->assertGuest();
    }

    /**
     * Test wallet connection creates new user if not exists
     */
    public function test_wallet_connection_creates_new_user_if_not_exists(): void
    {
        $this->assertDatabaseMissing('users', [
            'wallet_address' => $this->validWalletAddress
        ]);

        $this->post(route('wallet.connect'), [
            'address' => $this->validWalletAddress
        ]);

        $this->assertDatabaseHas('users', [
            'wallet_address' => $this->validWalletAddress
        ]);
    }

    /**
     * Test wallet connection uses existing user if exists
     */
    public function test_wallet_connection_uses_existing_user_if_exists(): void
    {
        $existingUser = User::create([
            'wallet_address' => $this->validWalletAddress
        ]);

        $this->post(route('wallet.connect'), [
            'address' => $this->validWalletAddress
        ]);

        $this->assertDatabaseCount('users', 1);
        $this->assertAuthenticatedAs($existingUser);
    }

    /**
     * Test wallet disconnection
     */
    public function test_wallet_can_disconnect(): void
    {
        $user = User::create([
            'wallet_address' => $this->validWalletAddress
        ]);

        $response = $this->actingAs($user)
            ->post(route('wallet.disconnect'));

        $response->assertRedirect(route('login'));
        $this->assertGuest();
    }

    /**
     * Test wallet connection requires address
     */
    public function test_wallet_connection_requires_address(): void
    {
        $response = $this->post(route('wallet.connect'), []);

        $response->assertSessionHasErrors(['address']);
        $this->assertGuest();
    }

    /**
     * Test wallet address format validation
     */
    public function test_wallet_address_format_validation(): void
    {
        $invalidAddresses = [
            '0x123', // too short
            '0xGGGG1234567890123456789012345678901234567', // invalid characters
            '1234567890123456789012345678901234567890', // missing 0x prefix
            '0x12345678901234567890123456789012345678901' // too long
        ];

        foreach ($invalidAddresses as $address) {
            $response = $this->post(route('wallet.connect'), [
                'address' => $address
            ]);

            $response->assertSessionHasErrors(['address']);
            $this->assertGuest();
        }
    }

    /**
     * Test authenticated user cannot access login page
     */
    public function test_authenticated_user_cannot_access_login_page(): void
    {
        $user = User::create([
            'wallet_address' => $this->validWalletAddress
        ]);

        $response = $this->actingAs($user)
            ->get(route('login'));

        $response->assertRedirect();
    }
}
