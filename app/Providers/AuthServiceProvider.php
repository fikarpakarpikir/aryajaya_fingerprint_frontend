<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Inertia\Inertia;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // $this->registerPolicies();
        dd(Auth::user());
        Inertia::share('auth.user', function () {
            if (Auth::check()) {
                $user = Auth::user()->load('org'); // Ensure the `org` relationship is loaded
                return array_merge($user->toArray(), [
                    'org' => [
                        'dokumen' => $user->org->dokumen ?? null
                    ]
                ]);
            }
            return null;
        });
    }
}
