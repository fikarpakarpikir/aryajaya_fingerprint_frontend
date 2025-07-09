<?php

namespace App\Http\Middleware;

use App\Http\Controllers\RecordController;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class isAdmin_HC
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        if (!auth()->check() || auth()->user()->kode_role != 5) {
            // abort(403);
            RecordController::RecordAct(auth()->user()->id, 4);
            return back()->with('error', 'Data Anda otomatis tercatat dalam percobaan mengakses yang dilarang oleh sistem.');
        }
        return $next($request);
    }
}
