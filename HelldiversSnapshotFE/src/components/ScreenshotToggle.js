import React, { useState } from 'react';

function ScreenshotToggle({ img }) {
    const [show, setShow] = useState(false);
    const onClick = () => setShow(!show);
    return (
        <div>
            <div onClick={onClick}
                className='text-small'
                style={{ fontSize: '17px', marginLeft: "20px", textDecoration: "underline", cursor: "pointer" }}>Show Snapshot</div>
            {show && <img src={`https://s3.amazonaws.com/helldive.live.images/${img.replace(' ', '+')}`} width={768} />}
        </div>
    )
}

export default ScreenshotToggle;