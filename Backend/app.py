from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def bubble_sort_with_steps(arr):
    steps = []
    n = len(arr)
    arr = arr.copy()
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                # Record the indices being swapped
                steps.append({"i": j, "j": j + 1})
                # Perform the swap
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return steps

@app.route('/sort', methods=['POST'])
def sort_array():
    data = request.get_json()
    unsorted_array = data.get('array')
    
    if not isinstance(unsorted_array, list) or not all(isinstance(x, int) for x in unsorted_array):
        return jsonify({"error": "Invalid input"}), 400

    steps = bubble_sort_with_steps(unsorted_array)
    return jsonify({"steps": steps})

if __name__ == '__main__':
    app.run(debug=True)