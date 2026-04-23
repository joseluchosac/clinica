<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {
    $permissions = Permission::query()->with('roles');
    if($request->has('search') && $request->search) {
      $permissions->where(function($query) use ($request) {
        $query->where('name', 'like', '%' . $request->search . '%')
              ->orWhere('guard_name', 'like', '%' . $request->search . '%');
      });
    }
    $permissions = $permissions->paginate(20)->withQueryString();
    $permissions->getCollection()->transform(fn($permissions) => [
      'id' => $permissions->id,
      'name' => $permissions->name,
      'guard_name' => $permissions->guard_name,
      'roles' => $permissions->roles,
      'created_at' => $permissions->created_at?->format('Y-m-d H:i:s'),
      'updated_at' => $permissions->updated_at?->format('Y-m-d H:i:s'),
    ]);
    return Inertia::render('admin/permissions/index', [
      'permissions' => $permissions,
      'filters' => $request->only(['search']),
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    return Inertia::render('admin/permissions/permission-form');
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $request->validate([
      'name' => 'required|string|max:255|unique:permissions',
    ]);

    Permission::create([
      'name' => $request->name,
      'guard_name' => $request->guard_name,
    ]);

    session()->flash('resp', [
      "msg" => "Permiso creado con éxito",
      "type" => "success",
      "action" => "storePermission",
      "data" => null
    ]);
    return redirect()->route('admin.permissions.index');
  }

  /**
   * Display the specified resource.
   */
  public function show(string $id)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Permission $permission)
  {
    return Inertia::render('admin/permissions/permission-form', compact('permission'));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Permission $permission)
  {
    $validated = $request->validate([
      'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
    ]);

    $permission->update($validated);

    session()->flash('resp', [
      "msg" => "Permiso actualizado con éxito",
      "type" => "success",
      "action" => "updatePermission",
      "data" => null
    ]);
    return redirect()->route('admin.permissions.index');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Permission $permission)
  {
    $permission->delete();
    session()->flash('resp', [
      "msg" => "Permiso eliminado con éxito",
      "type" => "success",
      "action" => "destroyPermission",
      "data" => null
    ]);
    return redirect()->route('admin.permissions.index');
  }
}
