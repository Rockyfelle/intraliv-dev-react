<?php

namespace App\Http\Controllers;

use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getAll()
    {
        $userList = array();
        foreach (User::orderBy('name', 'asc')->get() as $userItem) {
            $userItem->phone;
            array_push($userList, $userItem);
        }
        return $userList;
    }

    public function create(Request $request)
    {
        if (Auth::user()->admin == true) {
            if ((!isset($request->name)) || (!isset($request->admin)) || (!isset($request->password))
            ) {
                return ['status' => 'missing-data', 'id' => 'missing-data', 'text' => 'Alla fält är ej ifyllda'];
            }

            $newUser = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'admin' => $request->admin,
            ]);

            return ['status' => 'success', 'users' => $this->getAll()];
        } else return ['status' => 'unauthenticated', 'text' => 'Du har inte behörigheten för att göra detta'];
    }

    public function update(Request $request)
    {
        if (Auth::user()->admin == true) {
            if ((!isset($request->name)) || (!isset($request->admin))
            ) {
                return ['status' => 'missing-data', 'id' => 'missing-data', 'text' => 'Alla fält är ej ifyllda'];
            }

            $userId = $request->id;
            if (User::where('id', $userId)->exists()) {
                $oldUser = User::where('id', $userId)->first();
                $oldUser->update([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => ($request->password == '') ? $oldUser->password : bcrypt($request->password),
                    'admin' => $request->admin,
                ]);

                return ['status' => 'success', 'employees' => $this->getAll()];
            } else {
                //Phone does not exist, error
                return ['status' => 'not-found', 'field' => 'id', 'id' => 'id-not-found', 'text' => 'Det finns ingen användare med ID "' . $userId . '", prova att ladda om sidan'];
            }
        } else return ['status' => 'unauthenticated', 'text' => 'Du har inte behörigheten för att göra detta'];
    }

    public function delete(Request $request)
    {
        if (Auth::user()->admin == true) {
            $phoneId = $request->id;
            if (User::where('id', $phoneId)->exists()) {
                $phoneToDelete = User::where('id', $phoneId)->first();
                $phoneToDelete->delete();
                return ['status' => 'success', 'users' => $this->getAll()];
            } else {
                return ['status' => 'not-found', 'field' => 'id', 'id' => 'id-not-found', 'text' => 'Det finns ingen användare registrerad med detta id'];
            }
        } else return ['status' => 'unauthenticated', 'text' => 'Du har inte behörigheten för att göra detta'];
    }
}
