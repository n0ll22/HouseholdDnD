import React, { useEffect, useState } from "react";

interface DelayProps {
    wait: number; // Time to wait in milliseconds
    children: React.ReactNode; // The children to be delayed
}

const Delay: React.FC<DelayProps> = ({ wait, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, wait);

        return () => clearTimeout(timer); // Cleanup the timer on unmount
    }, [wait]);

    return isVisible ? <>{children}</> : null;
};

export default Delay;
