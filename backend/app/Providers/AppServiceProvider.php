<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Domain\Orphan\Repositories\OrphanRepositoryInterface::class,
            \App\Domain\Orphan\Repositories\EloquentOrphanRepository::class
        );
        $this->app->bind(
            \App\Domain\Staff\Repositories\StaffRepositoryInterface::class,
            \App\Domain\Staff\Repositories\EloquentStaffRepository::class
        );
        $this->app->bind(
            \App\Domain\Donation\Repositories\DonationRepositoryInterface::class,
            \App\Domain\Donation\Repositories\EloquentDonationRepository::class
        );
        $this->app->bind(
            \App\Domain\Orphan\Services\OrphanService::class,
            \App\Domain\Orphan\Services\OrphanService::class
        );
        $this->app->bind(
            \App\Domain\Staff\Services\StaffService::class,
            \App\Domain\Staff\Services\StaffService::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
    }
}
