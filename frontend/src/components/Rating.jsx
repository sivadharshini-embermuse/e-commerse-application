import { Star } from "lucide-react"
import { useEffect, useState } from "react"
const Rating = ({ value = 0 , onRatingChange , disabled = false, showValue = true }) => {
    const [hovered, setHovered] = useState(0);
    
    useEffect(() => {
        if (value < 0) onRatingChange && onRatingChange(0);
        else if (value > 5) onRatingChange && onRatingChange(5);
    }, [value, onRatingChange]);

    const handleClick = (star) => {
        if (disabled) return;
        if (star === value) {
            onRatingChange && onRatingChange(0); // Toggle off if same star is clicked
        } else {
            onRatingChange && onRatingChange(star);
        }
    };

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 ">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        fill={star <= (hovered || value) ? "currentColor" : "none"}
                        size={20}
                        // onClick={() => !disabled && onRatingChange && onRatingChange(star)}
                        onMouseEnter={() => !disabled && setHovered(star)}
                        onMouseLeave={() => !disabled && setHovered(0)}
                        onClick={() => handleClick(star)}
                    />
                ))}   
            </div>
            {showValue && <span className="text-lg text-gray-500">{Number(value).toFixed(1)}/5</span>}
        </div>
    )
}

export default Rating
