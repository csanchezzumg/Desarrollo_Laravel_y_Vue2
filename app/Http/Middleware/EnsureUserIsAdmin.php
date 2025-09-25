<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar si el usuario está autenticado
        if (!$request->user()) {
            return response()->json([
                'message' => 'No autenticado.'
            ], 401);
        }

        // Verificar si el usuario es administrador
        if ($request->user()->rol !== 'admin') {
            return response()->json([
                'message' => 'Acceso denegado. Solo los administradores pueden realizar esta acción.',
                'required_role' => 'admin',
                'user_role' => $request->user()->rol
            ], 403);
        }

        return $next($request);
    }
}
