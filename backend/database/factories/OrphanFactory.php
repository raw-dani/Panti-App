<?php

namespace Database\Factories\App\Domain\Orphan\Models;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Domain\Orphan\Models\Orphan;
use App\Domain\Staff\Models\Staff;
use Carbon\Carbon;

class OrphanFactory extends Factory
{
    protected $model = Orphan::class;

    public function definition(): array
    {
        $genders = ['male', 'female'];
        $religions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha'];
        $status = $this->faker->randomElement(['active', 'inactive']);

        return [
            'code' => 'AN' . $this->faker->unique()->numberBetween(1000, 9999),
            'name' => $this->faker->name,
            'gender' => $this->faker->randomElement($genders),
            'birth_date' => $this->faker->dateTimeBetween('-15 years', '-5 years'),
            'religion' => $this->faker->randomElement($religions),
            'address_origin' => $this->faker->address,
            'parent_status' => $this->faker->randomElement(['meninggal', 'cerai', 'menitipkan']),
            'entry_date' => Carbon::now()->subYears(rand(1, 5)),
            'health_notes' => $this->faker->sentence,
            'education_level' => $this->faker->randomElement(['TK', 'SD', 'SMP', 'SMA']),
            'photo' => null,
            'status' => $status,
        ];
    }
}

