import '../styles/App.css';

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
