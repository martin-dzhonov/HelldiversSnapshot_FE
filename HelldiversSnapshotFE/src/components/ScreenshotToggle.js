import React, { useState } from 'react';

function ScreenshotToggle({ id }) {
    const [show, setShow] = useState(false);
    const onClick = () => setShow(!show);
    return (
        <div>
            <div onClick={onClick}
                className='screenshot-toggle-text'>Show Snapshot</div>
            {show && <img src={`https://s3.us-east-1.amazonaws.com/helldive.live.images/Screenshot+(${id}).png`} width={768} alt="" />}
        </div>
    )
}

export default ScreenshotToggle;