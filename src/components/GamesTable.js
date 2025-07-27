import "../styles/App.css";
import { strategemsDict, weaponsDict } from "../constants";
import ScreenshotToggle from "./ScreenshotToggle";
import Table from "react-bootstrap/Table";
import { useState, useEffect } from "react";
import { useMobile } from '../hooks/useMobile';
import { apiBaseUrl } from '../constants';
import Loader from "./Loader";

function GamesTable({ filters, setFilterResults }) {
    const { isMobile } = useMobile();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageData = data.slice(startIndex, startIndex + itemsPerPage);

    const fetchData = async (url) => {
        try {
            setLoading(true);
            const response = await fetch(`${apiBaseUrl}${url}`);
            const result = await response.json();
            const sorted = result.sort((a, b) => a.id - b.id);
            setFilterResults(sorted.length);
            setData(sorted);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (filters) {
            fetchData(`/games?faction=${filters.faction}&patch=${filters.patch.id}&difficulty=${filters.difficulty}&mission=${filters.mission}`);
        }
    }, [filters]);

    const getPageNumbers = () => {
        const pages = [];
        const total = totalPages;

        if (total <= 7) {
            for (let i = 1; i <= total; i++) pages.push(i);
            return pages;
        }

        if (currentPage <= 4) {
            pages.push(1, 2, 3, 4, 5, "...", total);
        } else if (currentPage >= total - 3) {
            pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
        } else {
            pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", total);
        }

        return pages;
    };

    const handlePageChange = (newPage) => {
        if (newPage !== "..." && newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    const INVALID_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

    return (
        <div>
            <Loader loading={loading}>
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}>
                        ←
                    </button>
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(page)}
                            className={currentPage === page ? "active" : ""}
                            disabled={page === "..."}>
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}>
                        →
                    </button>
                </div>

                {!isMobile &&
                    <Table striped bordered hover size="sm" variant="dark">
                        <thead>
                            <tr>
                            <th>Planet</th>
                            <th>Mission</th>
                                <th>Players</th>
                                <th>Difficulty</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.map((game, index) => (
                                <tr key={index}>
                                     <td className="text-small">{game.planet}</td>
                                    <td className="text-small" style={{ width: "180px" }}>{game.mission}</td>
                                    <td className="text-small">

                                        <div className="table-loadout-row-wrapper">
                                            {game.players.map((player, loadoutIndex) => (
                                                <div key={loadoutIndex} className="table-loadout-wrapper">
                                                    {player?.strategem && player.strategem.length > 0 ? (
                                                        player.strategem.map((item, itemIndex) => {
                                                            const src = strategemsDict[item]?.image || INVALID_IMAGE;
                                                            return (
                                                                <img
                                                                    key={itemIndex}
                                                                    className="table-img-wrapper"
                                                                    src={src}
                                                                    alt=""
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = INVALID_IMAGE;
                                                                    }}
                                                                />
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="table-empty-placeholder">No Strategem Data</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="table-loadout-row-wrapper">
                                            {game.players.map((player, loadoutIndex) => (
                                                <div key={loadoutIndex} className="table-loadout-wrapper">
                                                    {player?.weapons && player.weapons.length > 0 ? (
                                                        player.weapons.map((item, itemIndex) => {
                                                            const src = weaponsDict[item]?.image || INVALID_IMAGE;
                                                            return (
                                                                <img
                                                                    key={itemIndex}
                                                                    className={itemIndex === 0 ? 'primary-img-wrapper' :
                                                                        itemIndex === 1 ? 'secondary-img-wrapper' :
                                                                            'throwable-img-wrapper'}
                                                                    src={src}
                                                                    width={40}
                                                                    alt=""
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = INVALID_IMAGE;
                                                                    }}
                                                                />
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="table-empty-placeholder">No Weapon Data</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <ScreenshotToggle id={game.id} alt="" />
                                    </td>
                                    <td className="text-small">{game.difficulty}</td>

                                    <td className="text-small">
                                        <div>{new Date(game.createdAt).toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        })}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>}

                {isMobile &&
                    <Table striped bordered hover size="sm" variant="dark">
                        <tbody>
                            {currentPageData.map((game, index) => (
                                <tr key={index}>
                                    <td className="text-small">
                                        <div className="text-small table-text-mobile">Planet: {game.planet} </div>
                                        <div className="text-small table-text-mobile">Mission: {game.mission}</div>
                                        <div className="text-small table-text-mobile">Difficulty: {game.difficulty}</div>
                                        <div className="text-small table-text-mobile">Recorded: {new Date(game.createdAt).toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        })}</div>

                                        <div className="table-loadout-row-wrapper">
                                            {game.players.map((player, loadoutIndex) => (
                                                <>
                                                    <div className="table-loadout-wrapper">
                                                        {player?.strategem && player.strategem.length > 0 ? (
                                                            player.strategem.map((item, itemIndex) => {
                                                                const src = strategemsDict[item]?.image || INVALID_IMAGE;
                                                                return (
                                                                    <img
                                                                        key={itemIndex}
                                                                        className="table-img-wrapper"
                                                                        src={src}
                                                                        alt=""
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = INVALID_IMAGE;
                                                                        }}
                                                                    />
                                                                );
                                                            })
                                                        ) : (
                                                            <div className="table-empty-placeholder">No Strategem Data</div>
                                                        )}
                                                    </div>

                                                    <div className="table-loadout-wrapper">
                                                        {player?.weapons && player.weapons.length > 0 ? (
                                                            player.weapons.map((item, itemIndex) => {
                                                                const src = weaponsDict[item]?.image || INVALID_IMAGE;
                                                                return (
                                                                    <img
                                                                        key={itemIndex}
                                                                        className={itemIndex === 0 ? 'primary-img-wrapper' : itemIndex === 1 ? 'secondary-img-wrapper' : 'throwable-img-wrapper'}
                                                                        src={src}
                                                                        width={40}
                                                                        alt=""
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = INVALID_IMAGE;
                                                                        }}
                                                                    />
                                                                );
                                                            })
                                                        ) : (
                                                            <div className="table-empty-placeholder">No Weapon Data</div>
                                                        )}
                                                    </div>

                                                    <div className="table-divider" />
                                                </>
                                            ))}
                                        </div>

                                        <ScreenshotToggle id={game.id} alt="" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>}
            </Loader>
        </div>
    );

}

export default GamesTable;
