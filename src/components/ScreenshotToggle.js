import useMobile from '../hooks/useMobile';
import '../styles/App.css';
import React, { useState } from 'react';

function ScreenshotToggle({ id }) {
    const { isMobile } = useMobile();
    const [show, setShow] = useState(false);

    const onClick = () => {
        const url = `https://s3.us-east-1.amazonaws.com/helldive.live.images/Screenshot+(${id}).png`;
        if (isMobile) {
            window.location.href = url;
        } else {
            setShow(!show);
        }
    };

    return (
        <div>
            <div onClick={onClick} className='screenshot-toggle-text'>
                Show Snapshot
            </div>
            {!isMobile && show && (
                <img src={`https://s3.us-east-1.amazonaws.com/helldive.live.images/Screenshot+(${id}).png`} width={760} alt="" />
            )}
        </div>
    );
}

export default ScreenshotToggle;