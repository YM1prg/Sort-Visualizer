import { gsap } from "gsap";
import React, { useEffect, useState } from "react";

const App = () => {
    const [array, setArray] = useState([]);
    const [inputValue, setInputValue] = useState("5,3,8,1,2");
    const [isAnimating, setIsAnimating] = useState(false);
    const [speed, setSpeed] = useState(200); // animation speed in ms

    useEffect(() => {
        parseAndSetArray(inputValue);
    }, []);

    const parseAndSetArray = (value) => {
        try {
            const parsed = value.split(",").map(Number);
            if (parsed.every((num) => !isNaN(num))) {
                setArray(parsed);
            }
        } catch (err) {
            console.error("Invalid input");
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        parseAndSetArray(e.target.value);
    };

    const sendToBackendAndAnimate = async () => {
        if (isAnimating || array.length === 0) return;
        setIsAnimating(true);

        try {
            const res = await fetch("http://localhost:5000/sort", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ array }),
            });

            const data = await res.json();
            const steps = data.steps;

            let currentArray = [...array];
            for (let step of steps) {
                const { i, j } = step;

                // Swap locally to simulate backend result
                [currentArray[i], currentArray[j]] = [currentArray[j], currentArray[i]];
                setArray([...currentArray]);

                // Animate swap
                await animateSwap(i, j);
                await sleep(speed);
            }
        } catch (err) {
            console.error("Error fetching steps:", err);
        }

        setIsAnimating(false);
    };

    const animateSwap = (i, j) => {
        return new Promise((resolve) => {
            // Get the DOM elements
            const barI = document.getElementById(`bar-${i}`);
            const barJ = document.getElementById(`bar-${j}`);

            // Get their computed widths including gap
            const widthWithGap = 31; // 25px width + 6px gap

            // Calculate how far each bar needs to move
            const dx = (j - i) * widthWithGap;
            gsap.to(barI, { scale: 1.2, backgroundColor: "#ffeb3b", duration: 0.15 });
            gsap.to(barJ, { scale: 1.2, backgroundColor: "#ffeb3b", duration: 0.15 });

            gsap.to([barI, barJ], {
                x: (target, index) => (index === 0 ? dx : -dx), // bar-i moves right, bar-j moves left
                duration: 0.3,
                ease: "power2.inOut",
                onComplete: resolve,
            });

            // Then reset after animation
            gsap.to(barI, { scale: 1, backgroundColor: "#4caf50", duration: 0.15, delay: 0.15 });
            gsap.to(barJ, { scale: 1, backgroundColor: "#4caf50", duration: 0.15, delay: 0.15 });
        });
    };

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    return (
        <div style={{ textAlign: "center", padding: "20px", }}>
            <h1>Sorting Visualizer (Flask Backend)</h1>

            <div className="in">
                <div>
                    <label>
                        Enter Array:
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="e.g. 5,3,8,1,2"
                            disabled={isAnimating}
                        />
                    </label>
                </div>

                <button onClick={sendToBackendAndAnimate} disabled={isAnimating}>
                    Start Animation
                </button>

                <label>
                    Speed:
                    <input
                        type="range"
                        min="50"
                        max="1000"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                    />
                </label>

            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    height: "250px",
                    marginTop: "20px",
                    gap: "6px",
                }}
            >
                {array.map((value, index) => (
                    <div
                        key={index}
                        id={`bar-${index}`}
                        style={{
                            width: "30px",
                            height: `${value * 30}px`,
                            backgroundColor: "rgb(0 183 255)",
                            transition: "height 0.1s ease-in-out",
                        }}
                    ><span style={{ fontSize: "2rem" }}>{value}</span></div>
                ))}
            </div>
        </div>
    );
};

export default App;