import React, { useState } from 'react';

function ScreenshotToggle({img}) {
    const [showAnswer, setShowAnswer] = useState(false);
    const onClick = () => setShowAnswer(!showAnswer);
    return (
        <div>
            <div onClick={onClick} className='filter-results-text' style={{ fontSize: '17px', marginLeft: "20px", textDecoration: "underline", cursor: "pointer" }}>Show Snapshot</div>
            {showAnswer && <img src={`https://s3.amazonaws.com/helldive.live.images/${img.replace(' ', '+')}`} width={768} />}
        </div>
    )
}

export default ScreenshotToggle;