<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\In;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
class UserController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {

    $users = User::query();
    $users = $users->paginate(10);
    $users->getCollection()->transform(fn($user) => [
      'id' => $user->id,
      'username' => $user->username,
      'email' => $user->email,
      'name' => $user->name,
      'created_at' => $user->created_at?->format('Y-m-d H:i:s'),
      'updated_at' => $user->updated_at?->format('Y-m-d H:i:s'),
    ]);
    // $users = User::query()
    //     ->orderBy('name')
    //     ->get(['id', 'name', 'username', 'email', 'created_at', 'updated_at']);

    return Inertia::render('admin/users/index', [
      'users' => $users,
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    return Inertia::render('admin/users/user-form');
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
      'password' => ['required', 'confirmed', Rules\Password::defaults()],
    ]);

    User::create([
      'name' => $request->name,
      'username' => $request->username,
      'email' => $request->email,
      'password' => Hash::make($request->password),
    ]);

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
    return Inertia::render('admin/users/user-form', compact('user'));
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
  public function destroy(string $id)
  {
    //
  }
}
