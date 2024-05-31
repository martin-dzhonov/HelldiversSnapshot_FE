import React, { useState } from 'react';

function ScreenshotToggle({id}) {
    const [showAnswer, setShowAnswer] = useState(false);
    const onClick = () => setShowAnswer(!showAnswer);
    return (
        <div>
            <div onClick={onClick} className='filter-results-text' style={{cursor: "pointer", marginLeft: "20px"}}>Show Image</div>
            {showAnswer && <img src={require(`./screenshots/${id}`)} width={768} />}
        </div>
    )
}

export default ScreenshotToggle;