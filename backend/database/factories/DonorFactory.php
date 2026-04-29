<?php

namespace Database\Factories;

use App\Models\Donor;
use Illuminate\Database\Eloquent\Factories\Factory;

class DonorFactory extends Factory
{
    protected $model = Donor::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'postal_code' => $this->faker->postcode(),
            'tax_id' => 'NPWP' . $this->faker->unique()->numerify('###########'),
            'preferred_contact_method' => $this->faker->randomElement(['email', 'phone', 'mail']),
            'notes' => $this->faker->optional()->sentence(),
            'is_active' => $this->faker->boolean(90), // 90% active
        ];
    }
}

