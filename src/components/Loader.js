import '../styles/App.css';
import '../styles/Loader.css';
import hdlogo from "../assets/logos/hd_logo_small.png";

function Loader({ loading = true, children }) {

    return (
        <>
            {!loading && children}

            {loading &&
                <div className="spinner-container">
                    <div className="spinner">
                        <img
                            src={hdlogo}
                            className="spinner-icon"
                        />
                    </div>
                </div>
            }
        </>
    )
}

export default Loader