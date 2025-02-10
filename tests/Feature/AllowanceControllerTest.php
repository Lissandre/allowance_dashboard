<?php

namespace Tests\Feature;

use App\Models\Allowance;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AllowanceControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private string $walletAddress = '0x1234567890123456789012345678901234567890';
    private array $validAllowanceData;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test user
        $this->user = User::factory()->create([
            'wallet_address' => $this->walletAddress
        ]);

        // Prepare valid allowance data
        $this->validAllowanceData = [
            'contract_address' => '0x2222222222222222222222222222222222222222',
            'owner_address' => $this->walletAddress,
            'spender_address' => '0x3333333333333333333333333333333333333333',
            'allowance_amount' => '100.5'
        ];
    }

    /**
     * It should display the allowances index page.
     */
    public function test_it_displays_allowances_index_page(): void
    {
        $this->actingAs($this->user)
            ->get(route('allowances.index'))
            ->assertInertia(fn ($assert) => $assert
                ->component('Allowances/Index')
                ->has('allowances')
            );
    }

    /**
     * It should display the create allowance page.
     */
    public function test_it_displays_create_allowance_page(): void
    {
        $this->actingAs($this->user)
            ->get(route('allowances.create'))
            ->assertInertia(fn ($assert) => $assert
                ->component('Allowances/Create')
            );
    }

    /**
     * It should store a new allowance.
     */
    public function test_it_can_store_new_allowance(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('allowances.store'), $this->validAllowanceData);

        $response->assertRedirect(route('allowances.index'));
        $this->assertDatabaseHas('allowances', $this->validAllowanceData);
    }

    /**
     * It should prevent storing allowance with unauthorized owner.
     */
    public function test_it_prevents_storing_allowance_with_unauthorized_owner(): void
    {
        $unauthorizedData = $this->validAllowanceData;
        $unauthorizedData['owner_address'] = '0x9999999999999999999999999999999999999999';

        $response = $this->actingAs($this->user)
            ->post(route('allowances.store'), $unauthorizedData);

        $response->assertSessionHasErrors('owner_address');
        $this->assertDatabaseMissing('allowances', $unauthorizedData);
    }

    /**
     * It should show allowance for update.
     */
    public function test_it_can_show_allowance_for_update(): void
    {
        $allowance = Allowance::create($this->validAllowanceData);

        $this->actingAs($this->user)
            ->get(route('allowances.get', $allowance))
            ->assertInertia(fn ($assert) => $assert
                ->component('Allowances/Update')
                ->has('allowance')
            );
    }

    /**
     * It should prevent showing unauthorized allowance.
     */
    public function test_it_prevents_showing_unauthorized_allowance(): void
    {
        $unauthorizedData = $this->validAllowanceData;
        $unauthorizedData['owner_address'] = '0x9999999999999999999999999999999999999999';
        $allowance = Allowance::create($unauthorizedData);

        $this->actingAs($this->user)
            ->get(route('allowances.get', $allowance))
            ->assertSessionHasErrors('owner_address');
    }

    /**
     * It should update allowance.
     */
    public function test_it_can_update_allowance(): void
    {
        $allowance = Allowance::create($this->validAllowanceData);
        $updatedData = $this->validAllowanceData;
        $updatedData['allowance_amount'] = '200.5';

        $response = $this->actingAs($this->user)
            ->patch(route('allowances.update', $allowance), $updatedData);

        $response->assertRedirect(route('allowances.index'));
        $this->assertDatabaseHas('allowances', $updatedData);
    }

    /**
     * It should delete allowance.
     */
    public function test_it_can_delete_allowance(): void
    {
        $allowance = Allowance::create($this->validAllowanceData);

        $response = $this->actingAs($this->user)
            ->delete(route('allowances.destroy', $allowance));

        $response->assertRedirect(route('allowances.index'));
        $this->assertDatabaseMissing('allowances', $this->validAllowanceData);
    }

    /**
     * It should prevent deleting unauthorized allowance.
     */
    public function test_it_prevents_deleting_unauthorized_allowance(): void
    {
        $unauthorizedData = $this->validAllowanceData;
        $unauthorizedData['owner_address'] = '0x9999999999999999999999999999999999999999';
        $allowance = Allowance::create($unauthorizedData);

        $response = $this->actingAs($this->user)
            ->delete(route('allowances.destroy', $allowance));

        $response->assertSessionHasErrors('owner_address');
        $this->assertDatabaseHas('allowances', $unauthorizedData);
    }

    /**
     * It should validate allowance data on store.
     */
    public function test_it_validates_allowance_data_on_store(): void
    {
        $invalidData = [
            'contract_address' => 'invalid-address',
            'owner_address' => 'invalid-address',
            'spender_address' => 'invalid-address',
            'allowance_amount' => 'invalid-amount'
        ];

        $response = $this->actingAs($this->user)
            ->post(route('allowances.store'), $invalidData);

        $response->assertSessionHasErrors([
            'contract_address',
            'owner_address',
            'spender_address',
            'allowance_amount'
        ]);
    }
}
