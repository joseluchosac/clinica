<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\In;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {
    $users = User::query()->with('roles');

    if($request->has('search') && $request->search) {
      $users->where(function($query) use ($request) {
        $query->where('name', 'like', '%' . $request->search . '%')
              ->orWhere('username', 'like', '%' . $request->search . '%')
              ->orWhere('email', 'like', '%' . $request->search . '%');
      });
    }
    $users = $users->paginate(20)->withQueryString();
    $users->getCollection()->transform(fn($user) => [
      'id' => $user->id,
      'username' => $user->username,
      'email' => $user->email,
      'name' => $user->name,
      'roles' => $user->roles,
      'created_at' => $user->created_at?->format('Y-m-d H:i:s'),
      'updated_at' => $user->updated_at?->format('Y-m-d H:i:s'),
    ]);
    return Inertia::render('admin/users/index', [
      'users' => $users,
      'filters' => $request->only(['search']),
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    $roles = Role::all();
    return Inertia::render('admin/users/user-form', compact('roles'));
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $request->validate([
      'name' => 'required|string|max:255',
      'username' => 'required|string|max:255|unique:users',
      'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
    ]);

    $user = User::create([
      'name' => $request->name,
      'username' => $request->username,
      'email' => $request->email,
      'password' => Hash::make('12345678'),
    ]);

    if ($request->has('rolesIds')) {
      $user->syncRoles($request->rolesIds);
    }

    session()->flash('resp', [
      "msg" => "Usuario creado con éxito",
      "type" => "success",
      "action" => "storeUser",
      "data" => null
    ]);
    
    return redirect()->route('admin.users.index');
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
  public function edit(User $user)
  {
    $roles = Role::all();
    $userRolesIds = $user->roles->pluck('id');
    return Inertia::render('admin/users/user-form', compact('user', 'roles', 'userRolesIds'));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, User $user)
  {
    $validated = $request->validate([
      'name' => 'required|string|max:255',
      // 'username' => 'required|string|max:255|unique:users,username,' . $user->id,
      'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $user->id,
    ]);

    $user->update($validated);

    if ($request->has('rolesIds')) {
      $user->syncRoles($request->rolesIds);
    }

    session()->flash('resp', [
      "msg" => "Usuario actualizado con éxito",
      "type" => "success",
      "action" => "updateUser",
      "data" => null
    ]);
    return redirect()->route('admin.users.index');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(User $user)
  {
    $user->delete();
    session()->flash('resp', [
      "msg" => "Usuario eliminado con éxito",
      "type" => "success",
      "action" => "destroyUser",
      "data" => $user
    ]);
    return redirect()->route('admin.users.index');
  }

  public function resetPsw(User $user)
  {
    $user->update(['password' => Hash::make('12345678')]);
    session()->flash('resp', [
      "msg" => "Password reseteada con éxito",
      "type" => "success",
      "action" => "resetPasswordUser",
      "data" => null
    ]);
    return redirect()->route('admin.users.index');
  }
}
