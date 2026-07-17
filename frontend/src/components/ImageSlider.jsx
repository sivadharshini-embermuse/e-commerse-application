import { useState, useEffect } from "react";

const images = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
];

    function ImageSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
    const interval = setInterval(() => {
        setCurrent((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
        );
    }, 3000);

    return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[200px] sm:h-[200px] md:h-[300px] overflow-hidden">

        <div
            className="flex h-full transition-transform duration-1500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
        >
            {images.map((image, index) => (
            <img
                key={index}
                src={image}
                alt={`slide-${index}`}
                className="w-full h-full object-cover flex-shrink-0"
            />
            ))}
        </div>

        </div>
    );
}

export default ImageSlider;