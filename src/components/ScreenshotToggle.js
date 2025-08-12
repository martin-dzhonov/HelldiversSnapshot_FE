import useMobile from '../hooks/useMobile';
import '../styles/App.css';
import '../styles/GamesPage.css';

import React, { useState } from 'react';

function ScreenshotToggle({ id }) {
    const { isMobile } = useMobile();
    const [show, setShow] = useState(false);

    const getBucketUrl = (id)=>{
        return `https://s3.us-east-1.amazonaws.com/helldive.live.images/Screenshot+(${id}).png`
    }

    const onClick = () => {
        if (isMobile) {
            window.location.href = getBucketUrl(id);
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
                <img src={getBucketUrl(id)} width={760} alt="" />
            )}
        </div>
    );
}

export default ScreenshotToggle;