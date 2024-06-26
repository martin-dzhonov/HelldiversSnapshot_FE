import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getCountingSuffix } from '../utils';

const StrategemRank = ({ value, text, color, suffix = false }) => {
    return (
        <div className='strategem-rankings-item'>
            <div className='strategem-rankings-number' style={{ color }}>
                {value}
                {suffix && <span className='strategem-rankings-number-small'>{getCountingSuffix(value)}</span>}
            </div>
            <div className='strategem-rankings-text-wrapper'>
                <div className='strategem-rankings-text-small'>{text[0]}</div>
                <div className='strategem-rankings-text-small'>{text[1]}</div>
            </div>
        </div>
    )
};

export default StrategemRank;