import { useState, useEffect } from 'react';

export const useMobile = () => {
    const sizes = {
        mobile: 900
    };
    const [screenSize, setScreenSize] = useState({width: window.innerWidth});

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({width: window.innerWidth});
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return {
        isMobile: screenSize.width < sizes.mobile
    };
};

export default useMobile;