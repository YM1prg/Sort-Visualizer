#  Sorting Visualizer - Backend

This folder contains the **backend logic** of the sorting visualizer application. It provides:

- Multiple sorting algorithms with step-by-step execution
- Dataset generation (random or user-defined)
- A lightweight API server to communicate with the frontend
- Real-time streaming of sorting steps for animation

## 📁 Folder Structure

```
backend/
│
├── algorithms/
│   ├── bubble_sort.py
│   ├── quick_sort.py
│   ├── insertion_sort.py
│   ├── selection_sort.py
│   └── merge_sort.py
│
├── Data/
│   ├── dataset_generator.py
│   └── logger.py
│
├── main.py                  # FastAPI entry point
└── models.py                # Pydantic models for request/response
```

---

## 🧩 Algorithms

All sorting algorithms are implemented as **generators** that yield a sequence of steps. Each step is a dictionary containing:

```json
{
  "step": "compare | swap | complete",
  "indices": [i, j],         // indices involved in this step
  "array": [3, 1, 2, ...]    // current array state
}
```

Supported algorithms:
- ✅ Bubble Sort
- ✅ Quick Sort
- ✅ Insertion Sort
- ✅ Selection Sort
- ✅ Merge Sort

Each file exports a function like:

```python
def bubble_sort(arr):
    ...
    yield {"step": "compare", "indices": [...], "array": arr.copy()}
```

---

## ⚙️ Utils

### `dataset_generator.py`

Generates arrays based on user input or predefined patterns.

```python
generate_dataset(size=10, mode="random")     # random numbers
generate_dataset(size=10, mode="ascending")  # sorted ascending
generate_dataset(size=10, mode="descending") # sorted descending
```

### `logger.py`

Optional logging utility for debugging or tracking performance data.

---




## 🔌 Communication with Frontend

The backend sends data to the frontend in real time using **Server-Sent Events (SSE)**. The frontend listens to the stream and updates the UI accordingly.

---

## 🛠 How to Run

From the `backend/` directory:




## 🧪 Testing an Algorithm

You can test any sorting algorithm directly from its file:

```bash
cd backend/algorithms
python bubble_sort.py
```

---

## 🤝 Contributing

If you're contributing new sorting algorithms or utilities:

- Make sure to follow the generator pattern
- Include clear comments and type hints
- Add unit tests if possible
