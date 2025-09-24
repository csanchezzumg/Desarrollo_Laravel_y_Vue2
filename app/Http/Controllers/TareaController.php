<?php

namespace App\Http\Controllers;

// ...existing code...

use Illuminate\Http\Request;
use App\Models\Tarea;

class TareaController extends Controller
{
    // Listar todas las tareas
    public function index()
    {
        return Tarea::with('usuario')->get();
    }

    // Crear una nueva tarea
    public function store(Request $request)
    {
        $validated = $request->validate([
            'usuario_id' => 'required|exists:usuarios,id',
            'titulo' => 'required|string|max:150',
            'descripcion' => 'nullable|string',
            'estado' => 'required|in:pendiente,en_progreso,completada',
            'fecha_vencimiento' => 'nullable|date',
        ]);
        $tarea = Tarea::create($validated);
        return response()->json($tarea->load('usuario'), 201);
    }

    // Actualizar una tarea existente
    public function update(Request $request, $id)
    {
        $tarea = Tarea::findOrFail($id);
        
        $validated = $request->validate([
            'usuario_id' => 'sometimes|exists:usuarios,id',
            'titulo' => 'sometimes|string|max:150',
            'descripcion' => 'nullable|string',
            'estado' => 'sometimes|in:pendiente,en_progreso,completada',
            'fecha_vencimiento' => 'nullable|date',
        ]);
        
        $tarea->update($validated);
        return response()->json($tarea->load('usuario'));
    }

    // Eliminar una tarea
    public function destroy($id)
    {
        $tarea = Tarea::findOrFail($id);
        $tarea->delete();
        
        return response()->json([
            'message' => 'Tarea eliminada exitosamente'
        ]);
    }
}
