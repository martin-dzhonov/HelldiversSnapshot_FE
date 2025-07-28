import '../styles/App.css';
import '../styles/Loader.css';

function Loader({ loading = true, children }) {

    return (
        <>
            {!loading &&
                <>
                    {children}
                </>
            }
            {loading &&
                <div className="spinner-container">
                    <div className="lds-dual-ring"></div>
                </div>
            }
        </>
    );
}

export default Loader;
