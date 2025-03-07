import "../styles/App.css";
import { strategemsDict, weaponsDict } from "../constants";
import ScreenshotToggle from "./ScreenshotToggle";
import Table from "react-bootstrap/Table";
import { useState, useEffect } from "react";
import { useMobile } from '../hooks/useMobile';
import { apiBaseUrl } from '../constants';
import Loader from "./Loader";

function GamesTable({ filters }) {
    const { isMobile } = useMobile();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const fetchData = async (url) => {
        try {
            setLoading(true);
            const response = await fetch(`${apiBaseUrl}${url}`);
            const result = await response.json();
            const sorted = result.sort((a, b) => a.id - b.id)

            setData(sorted);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (filters) {
            fetchData(`/games?faction=${filters.faction}&patch=${filters.patch.id}`);
        }
    }, [filters]);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageData = data.slice(startIndex, startIndex + itemsPerPage);

    const getPageNumbers = () => {
        const visiblePages = 5;
        const pages = [];

        if (totalPages <= visiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }

        return pages;
    };

    const handlePageChange = (newPage) => {
        if (newPage !== "..." && newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div>
            <Loader loading={loading}>
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}>
                        Previous
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
                        Next
                    </button>
                </div>
                <Table striped bordered hover size="sm" variant="dark">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Date</th>
                            <th>Loadouts</th>
                            <th>Planet</th>
                            <th>Mission</th>
                            <th>Modifiers</th>
                            <th>Diff</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageData.map((game, index) => (
                            <tr key={index}>
                                <td className="text-small">{(currentPage * 10) + index - 9}</td>
                                <td className="text-small">
                                    <div>{new Date(game.createdAt).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit'
                                    })}</div>
                                    <div>{new Date(game.createdAt).toLocaleTimeString()}</div>
                                </td>
                                <td className="text-small">
                                    <div className="table-loadout-row-wrapper">
                                        {game.players.map((loadout, loadoutIndex) => (
                                            <div key={loadoutIndex} className="table-loadout-wrapper">
                                                {loadout.map((item, itemIndex) => (
                                                    <img
                                                        key={itemIndex}
                                                        className="table-img-wrapper"
                                                        src={strategemsDict[item]?.image}
                                                        alt=""
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="table-loadout-row-wrapper">
                                        {game.weapons.map((loadout, loadoutIndex) => (
                                            <div key={loadoutIndex} className="table-loadout-wrapper">
                                                {loadout.map((item, itemIndex) => (
                                                    <img
                                                        key={itemIndex}
                                                        className={`${itemIndex === 0 ?
                                                            'primary-img-wrapper' :
                                                            itemIndex === 1 ? 'secondary-img-wrapper' :
                                                                'throwable-img-wrapper'}`}
                                                        src={weaponsDict[item]?.image}
                                                        width={40}
                                                        alt=""
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                    <ScreenshotToggle id={game.id} alt="" />
                                </td>
                                <td className="text-small">{game.planet}</td>
                                <td className="text-small" style={{ width: "180px" }}>{game.mission}</td>
                                <td className="text-small">
                                    {game.modifiers.map((item, index) => <div key={index}>{item.toUpperCase()}</div>)}
                                </td>
                                <td className="text-small">{game.difficulty}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Loader>
        </div>
    );
}

export default GamesTable;
