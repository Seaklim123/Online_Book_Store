<?php

namespace Tests\Feature\Admin;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\Book;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;

class BookManagementTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    protected function setUp(): void
    {
    parent::setUp();
    
    
    \Spatie\Permission\Models\Permission::create(['name' => 'book-create']);
    
    
    $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

    \Spatie\Permission\Models\Role::create(['name' => 'admin'])->givePermissionTo('book-create');
    \Spatie\Permission\Models\Role::create(['name' => 'customer']);
    }

    public function test_customer_cannot_create_a_book()
{
    $this->withoutMiddleware(VerifyCsrfToken::class);
    $customer = User::factory()->create();
    $customer->assignRole('customer');
    $category = \App\Models\Category::factory()->create();

    $response = $this->actingAs($customer)->postJson(route('books.store'), [
        'category_id' => $category->id,
        'title'       => 'Hack Attempt',
        'pages'       => '100',
        'author'      => 'Hacker',
        'price'       => 15.00,
        'stock'       => 5,
        'discount_id' => null,
    ]);

    // Now this will correctly be 403
    $response->assertStatus(403); 
}

}
