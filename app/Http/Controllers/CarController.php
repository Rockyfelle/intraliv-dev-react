<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Fuel;
use App\Models\Inspection;
use App\Models\Mileage;
use App\Models\Service;
use Illuminate\Http\Request;

class CarController extends Controller
{

    public function getAll()
    {
        $carList = array();
        foreach (Car::orderBy('plate', 'asc')->get() as $carItem) {
            $carItem->fuel;
            $carItem->inspection;
            $carItem->mileage;
            $carItem->service;
            array_push($carList, $carItem);
        }
        return $carList;
    }



    public function create(Request $request)
    {
        $varArray = [
            'plate',
            'bought_location',
            'bought_date',
            'brand',
            'model',
            'station',
            'color',
            'comment',
            'abax',
            'employee_car',
            'benefit',
            'automatic',
            'insurance_cost',
            'max_mileage',
            'wheels_summer_amount',
            'wheels_summer_type',
            'wheels_winter_amount',
            'wheels_winter_type',
            'wheels_location',
            'winter_wheels_on',
            'oil_checked',
            'washed',
        ];

        foreach ($varArray as $currentVar) {
            if (!$request->has($currentVar)) return ['status' => 'missing-data', 'id' => 'missing-data', 'text' => 'Alla fält är ej ifyllda'];
        }
            
        $newCar = Car::create([
            'plate' => $request->plate,
            'bought_location' => $request->bought_location,
            'bought_date' => $request->bought_date,
            'brand' => $request->brand,
            'model' => $request->model,
            'station' => $request->station,
            'color' => $request->color,
            'comment' => $request->comment,
            'abax' => $request->abax,
            'employee_car' => $request->employee_car,
            'benefit' => $request->benefit,
            'automatic' => $request->automatic,
            'insurance_cost' => $request->insurance_cost,
            'max_mileage' => $request->max_mileage,
            'wheels_summer_amount' => $request->wheels_summer_amount,
            'wheels_summer_type' => $request->wheels_summer_type,
            'wheels_winter_amount' => $request->wheels_winter_amount,
            'wheels_winter_type' => $request->wheels_winter_type,
            'wheels_location' => $request->wheels_location,
            'winter_wheels_on' => $request->winter_wheels_on,
            'oil_checked' => $request->oil_checked,
            'washed' => $request->washed,
        ]);

        if ($request->has('fuel')) {
            //$fuelArray = json_decode($request->fuel);
            //return [$request->fuel, $fuelArray];
            foreach ($request->fuel as $fuelItem) {
                //$object = json_decode($fuelItem);
                Fuel::create([
                    'car_id' => $newCar->id,
                    'date' => $fuelItem['date'],
                    'cost' => $fuelItem['cost'],
                ]);
            }
        }
        unset($fuelItem);

        if ($request->has('inspection')) {
            foreach (json_decode($request->inspection) as $inspectionItem) {
                Inspection::create([
                    'car_id' => $newCar->id,
                    'date' => $inspectionItem->date,
                    'approved' => $inspectionItem->approved,
                    'comment' => $inspectionItem->comment,
                ]);
            }
        }
        unset($inspectionItem);

        if ($request->has('mileage')) {
            foreach (json_decode($request->mileage) as $mileageItem) {
                Mileage::create([
                    'car_id' => $newCar->id,
                    'date' => $mileageItem->date,
                    'mileage' => $mileageItem->mileage,
                ]);
            }
        }
        unset($mileageItem);

        if ($request->has('service')) {
            foreach (json_decode($request->service) as $serviceItem) {
                Service::create([
                    'car_id' => $newCar->id,
                    'date' => $serviceItem->date,
                    'full_service' => $serviceItem->full_service,
                    'comment' => $serviceItem->comment,
                ]);
            }
        }
        unset($serviceItem);

        //Success
        return ['status' => 'success', 'id' => 'success', 'car' => $newCar];
    }

    public function delete(Request $request)
    {
        $carId = $request->id;
        if (Car::where('id', $carId)->exists()) {
            $carToDelete = Car::where('id', $carId)->first();
            $carToDelete->delete();
            Fuel::where('car_id', $carId)->delete();
            Inspection::where('car_id', $carId)->delete();
            Mileage::where('car_id', $carId)->delete();
            Service::where('car_id', $carId)->delete();
            return ['status' => 'success', 'cars' => $this->getAll()];
        } else {
            return ['status' => 'not-found', 'field' => 'id', 'id' => 'id-not-found', 'text' => 'Det finns ingen bil registrerad med detta id'];
        }
    }

}