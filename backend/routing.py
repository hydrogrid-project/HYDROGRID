import random

def calculate_optimal_route(grid_data: list = None) -> dict:
    """
    Computes the dual-network hydraulic routing for Greywater and Rainwater systems.
    Includes dynamic catchment hydrology, simulated flow states, and component mapping.
    """
    
    # 1. Dynamic Hydrology Calculations (Rainwater)
    # If a grid array is passed, use it to estimate area. Otherwise, default to 120 sqm.
    catchment_area_sqm = len(grid_data) * 10 if grid_data else 120.0 
    runoff_coefficient = 0.85
    avg_rainfall_meters = 0.6
    
    # V = A * C * R * 1000 (Conversion to Liters)
    rw_tank_volume_liters = round(catchment_area_sqm * runoff_coefficient * avg_rainfall_meters * 1000)

    # 2. Simulate Independent Hydraulic States
    grey_water_level = random.randint(10, 90)
    cistern_overflowing = grey_water_level > 85
    
    rainwater_level = random.randint(10, 100)
    rainwater_overflowing = rainwater_level > 95

    # 3. Define All Engineering Components on a 10x10 Base Grid
    components = [
        # --- Greywater Treatment Nodes ---
        {
            "id": "conical_cistern",
            "name": "Conical Cistern",
            "dimensions": "1.5m x 2.0m",
            "info": "Primary collection and settling tank for greywater.",
            "coordinates": [2, 2]
        },
        {
            "id": "venturi",
            "name": "Venturi Injector",
            "dimensions": "50mm diameter",
            "info": "Aeration injector carrying oxygen to prevent anaerobic conditions.",
            "coordinates": [3, 3]
        },
        {
            "id": "chlorination_tube",
            "name": "Chlorination Tube",
            "dimensions": "1.0m length",
            "info": "Chemical dosing for bacterial disinfection.",
            "coordinates": [4, 4]
        },
        {
            "id": "gravity_seal_siphon",
            "name": "Gravity Seal Siphon",
            "dimensions": "Standard U-bend",
            "info": "Prevents backflow of sewer gases into the system.",
            "coordinates": [5, 5]
        },
        {
            "id": "hermetic_seal",
            "name": "Hermetic Seal",
            "dimensions": "Airtight flange",
            "info": "Airtight containment barrier preventing odor leaks.",
            "coordinates": [6, 6]
        },
        {
            "id": "solenoid_valve",
            "name": "3-Way Solenoid Valve",
            "dimensions": "25mm inlet",
            "info": "Automated valve switching between municipal and greywater.",
            "coordinates": [7, 7]
        },
        # --- Shared Drainage Node ---
        {
            "id": "soak_pit",
            "name": "Shared Soak Pit",
            "dimensions": "2.0m x 2.0m",
            "info": "Safe groundwater recharge area for both cistern and rainwater overflows.",
            "coordinates": [1, 8]
        },
        # --- Rainwater Harvesting Nodes ---
        {
            "id": "first_flush_diverter",
            "name": "First Flush Diverter",
            "dimensions": "110mm PVC",
            "info": "Diverts first 10 minutes of toxic runoff away from clean storage.",
            "coordinates": [0, 2]
        },
        {
            "id": "rainwater_tank",
            "name": "Rainwater Storage Tank",
            "dimensions": f"{rw_tank_volume_liters}L Capacity",
            "info": f"Sized dynamically for a {catchment_area_sqm} sqm roof area.",
            "coordinates": [0, 4]
        },
        {
            "id": "irrigation_pump",
            "name": "Irrigation Pump",
            "dimensions": "1.0 HP / 0.75 kW",
            "info": "Pressurizes stored rainwater for outdoor sprinkler systems.",
            "coordinates": [0, 5]
        }
    ]

    # 4. Define Hydraulic Paths (Active vs Inactive based on system state)
    gw_main_path = [[2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8]]
    gw_overflow_path = [[2, 2], [2, 5], [1, 8]] if cistern_overflowing else []
    municipal_fallback_path = [[0, 8], [4, 8], [7, 7], [8, 8]] if grey_water_level < 20 else []

    rw_collection_path = [[0, 0], [0, 2], [0, 4]] 
    rw_irrigation_path = [[0, 4], [0, 5], [0, 9]] if rainwater_level > 5 else []
    rw_overflow_path = [[0, 4], [1, 8]] if rainwater_overflowing else []

    # 5. Return the exact JSON structure the frontend expects
    return {
        "status": "routed",
        "system_state": {
            "catchment_area_sqm": float(catchment_area_sqm),
            "calculated_rw_capacity_liters": int(rw_tank_volume_liters),
            "grey_water_level_percent": int(grey_water_level),
            "is_cistern_overflowing": bool(cistern_overflowing),
            "active_flush_source": "municipal" if grey_water_level < 20 else "greywater",
            "rainwater_level_percent": int(rainwater_level),
            "is_rainwater_overflowing": bool(rainwater_overflowing)
        },
        "components": components,
        "hydraulic_paths": {
            "gw_main_circulation": {
                "coordinates": gw_main_path,
                "pipe_diameter_mm": 25,
                "flow_type": "Pressurized Motor Pump",
                "operating_pressure_bar": 2.5
            },
            "gw_overflow_to_soak_pit": {
                "coordinates": gw_overflow_path,
                "pipe_diameter_mm": 110,
                "flow_type": "Gravity Drainage",
                "gradient_percent": 2.0
            },
            "municipal_fallback": {
                "coordinates": municipal_fallback_path,
                "pipe_diameter_mm": 20,
                "flow_type": "Mains Pressure",
                "operating_pressure_bar": 3.0
            },
            "rw_collection": {
                "coordinates": rw_collection_path,
                "pipe_diameter_mm": 110,
                "flow_type": "Gravity Catchment",
                "gradient_percent": 1.5
            },
            "rw_irrigation": {
                "coordinates": rw_irrigation_path,
                "pipe_diameter_mm": 20,
                "flow_type": "Pressurized Irrigation",
                "operating_pressure_bar": 2.0
            },
            "rw_overflow_to_soak_pit": {
                "coordinates": rw_overflow_path,
                "pipe_diameter_mm": 110,
                "flow_type": "Gravity Drainage",
                "gradient_percent": 2.0
            }
        },
        "total_pipe_length_meters": round(len(gw_main_path) * 1.5 + len(rw_collection_path) * 1.5, 2)
    }