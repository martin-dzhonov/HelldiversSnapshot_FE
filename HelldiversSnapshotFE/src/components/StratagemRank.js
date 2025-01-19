import "../styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { getCountingSuffix } from "../utils";
import useMobile from "../hooks/useMobile";

const StratagemRank = ({ value, text, color, suffix = false, percent = false }) => {
    const { isMobile } = useMobile();
    return (
        <div className="stratagem-rankings-item">
            <div className="stratagem-rankings-number" style={{ color }}>
                {value}
                {suffix && (
                    <span className="stratagem-rankings-number-small">
                        {getCountingSuffix(value)}
                    </span>
                )}
                {percent && (
                    <span className="stratagem-rankings-number-small">
                        %
                    </span>
                )}
            </div>
            <div className="stratagem-rankings-text-wrapper">
                {isMobile ? 
                <>
                    <div className="stratagem-rankings-text-small" style={{ opacity: 0 }}>.</div>
                    <div className="stratagem-rankings-text-small">{text[0]}&nbsp;{text[1]}</div>
                    </>
                    :  <>
                    <div className="stratagem-rankings-text-small">{text[0]}</div>
                    <div className="stratagem-rankings-text-small">{text[1]}</div>
                </>}
               
            </div>
        </div>
    );
};

export default StratagemRank;
