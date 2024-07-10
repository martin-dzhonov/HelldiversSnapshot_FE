import "../styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { getCountingSuffix } from "../utils";

const StratagemRank = ({ value, text, color, suffix = false }) => {
    return (
        <div className="stratagem-rankings-item">
            <div className="stratagem-rankings-number" style={{ color }}>
                {value}
                {suffix && (
                    <span className="stratagem-rankings-number-small">
                        {getCountingSuffix(value)}
                    </span>
                )}
            </div>
            <div className="stratagem-rankings-text-wrapper">
                <div className="stratagem-rankings-text-small">{text[0]}</div>
                <div className="stratagem-rankings-text-small">{text[1]}</div>
            </div>
        </div>
    );
};

export default StratagemRank;
