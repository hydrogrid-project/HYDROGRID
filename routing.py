import numpy as np

def calculate_optimal_route(grid_data: list = None) -> dict:
    # Basic path calculation on a 2D matrix
    grid = np.zeros((10, 10))
    # Simulated shortest path coordinates: Start [0, 0] -> End [9, 9]
    path = [[i, i] for i in range(10)]
    return {
        "status": "routed",
        "total_pipe_length_meters": round(len(path) * 1.5, 2),
        "path_coordinates": path
    }