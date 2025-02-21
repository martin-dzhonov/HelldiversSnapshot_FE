import '../styles/App.css';
import React, { useState } from 'react';

function ScreenshotToggle({ id }) {
    const [show, setShow] = useState(false);
    const onClick = () => setShow(!show);
    return (
        <div>
            <div onClick={onClick}
                className='screenshot-toggle-text'>Show Snapshot</div>
            {show && <img src={`https://s3.us-east-1.amazonaws.com/helldive.live.images/Screenshot+(${id}).png`} width={760} alt="" />}
        </div>
    )
}

export default ScreenshotToggle;