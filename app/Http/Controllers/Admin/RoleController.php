<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {
    $roles = Role::query()->with('permissions');
    if($request->has('search') && $request->search) {
      $roles->where(function($query) use ($request) {
        $query->where('name', 'like', '%' . $request->search . '%')
              ->orWhere('guard_name', 'like', '%' . $request->search . '%');
      });
    }
    $roles = $roles->paginate(20)->withQueryString();
    $roles->getCollection()->transform(fn($roles) => [
      'id' => $roles->id,
      'name' => $roles->name,
      'guard_name' => $roles->guard_name,
      'permissions' => $roles->permissions,
      'created_at' => $roles->created_at?->format('Y-m-d H:i:s'),
      'updated_at' => $roles->updated_at?->format('Y-m-d H:i:s'),
    ]);
    return Inertia::render('admin/roles/index', [
      'roles' => $roles,
      'filters' => $request->only(['search']),
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    $permissions = Permission::all();
    return Inertia::render('admin/roles/role-form', compact('permissions'));
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $request->validate([
      'name' => 'required|string|max:255|unique:roles',
      'permissionsIds' => 'array',
      'permissionsIds.*' => 'exists:permissions,id',
    ]);

    $role = Role::create([
      'name' => $request->name,
      'guard_name' => $request->guard_name,
    ]);
    if ($request->has('permissionsIds')) {
      $role->syncPermissions($request->permissionsIds);
    }

    session()->flash('resp', [
      "msg" => "Rol creado con éxito",
      "type" => "success",
      "action" => "storeRole",
      "data" => null
    ]);
    return redirect()->route('admin.roles.index');
  }

  /**
   * Display the specified resource.
   */
  public function show(Role $role)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Role $role)
  {
    $permissions = Permission::all();
    $rolePermissionsIds = $role->permissions()->pluck('id')->toArray();
    return Inertia::render('admin/roles/role-form', compact('role', 'rolePermissionsIds', 'permissions'));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Role $role)
  {
    $validated = $request->validate([
      'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
      'permissionsIds' => 'array',
      'permissionsIds.*' => 'exists:permissions,id',
    ]);

    $role->update($validated);

    if ($request->has('permissionsIds')) {
      $role->syncPermissions($request->permissionsIds);
    }

    session()->flash('resp', [
      "msg" => "Rol actualizado con éxito",
      "type" => "success",
      "action" => "updateRole",
      "data" => null
    ]);
    return redirect()->route('admin.roles.index');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Role $role)
  {
    $role->delete();
    session()->flash('resp', [
      "msg" => "Rol eliminado con éxito",
      "type" => "success",
      "action" => "destroyRole",
      "data" => null
    ]);
    return redirect()->route('admin.roles.index');
  }
}
