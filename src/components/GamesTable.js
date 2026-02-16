import "../styles/App.css";
import "../styles/GamesPage.css";

import { strategemsDict, weaponsDict } from "../constants";
import { useState, useEffect } from "react";
import { useMobile } from '../hooks/useMobile';
import { apiBaseUrl } from '../constants';
import ScreenshotToggle from "./ScreenshotToggle";
import Table from "react-bootstrap/Table";
import Loader from "./Loader";

function GamesTable({ data }) {
    const { isMobile } = useMobile();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageData = data.slice(startIndex, startIndex + itemsPerPage);
    const INVALID_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 4) {
            pages.push(1, 2, 3, 4, 5, "...", totalPages);
        } else if (currentPage >= totalPages - 3) {
            pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
        }
        return pages;
    };

    const handlePageChange = (newPage) => {
        if (newPage !== "..." && newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const formatDate = (date) => new Date(date).toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
    });

    const renderStrategems = (player) => (
        player?.strategem?.length > 0 ?
            player.strategem.map((item, index) => {
                const src = strategemsDict[item]?.image || INVALID_IMAGE;
                return (
                    <img
                        key={index}
                        className="table-img-wrapper"
                        src={src}
                        alt=""
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = INVALID_IMAGE;
                        }}
                    />
                );
            }) :
            <div className="table-empty-placeholder">No Strategem Data</div>
    );

    const renderWeapons = (player) => (
        player?.weapons?.length > 0 ?
            player.weapons.map((item, index) => {
                const src = weaponsDict[item]?.image || INVALID_IMAGE;
                const className = index === 0 ? 'primary-img-wrapper' : index === 1 ? 'secondary-img-wrapper' : 'throwable-img-wrapper';
                return (
                    <img
                        key={index}
                        className={className}
                        src={src}
                        width={40}
                        alt=""
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = INVALID_IMAGE;
                        }}
                    />
                );
            }) :
            <div className="table-empty-placeholder">No Weapon Data</div>
    );

    return (
        <div>
            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>←</button>
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? "active" : ""}
                        disabled={page === "..."}>
                        {page}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>→</button>
            </div>

            {!isMobile && (
                <Table striped bordered hover size="sm" variant="dark">
                    <thead>
                        <tr>
                            <th>Id</th>
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
                                                                <td className="text-small">{game.id}</td>

                                <td className="text-small">{game.planet}</td>
                                <td className="text-small" style={{ width: "180px" }}>{game.mission}</td>
                                <td className="text-small">
                                    <div className="table-loadout-row-wrapper">
                                        {game.players.map((player, i) => (
                                            <div key={i} className="table-loadout-wrapper">{renderStrategems(player)}</div>
                                        ))}
                                    </div>
                                    <div className="table-loadout-row-wrapper">
                                        {game.players.map((player, i) => (
                                            <div key={i} className="table-loadout-wrapper">{renderWeapons(player)}</div>
                                        ))}
                                    </div>
                                    <ScreenshotToggle id={game.id} />
                                </td>
                                <td className="text-small">{game.difficulty}</td>
                                <td className="text-small">{formatDate(game.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {isMobile && (
                <Table striped bordered hover size="sm" variant="dark">
                    <tbody>
                        {currentPageData.map((game, index) => (
                            <tr key={index}>
                                <td className="text-small">
                                    <div className="table-text-mobile">Planet: {game.planet}</div>
                                    <div className="table-text-mobile">Mission: {game.mission}</div>
                                    <div className="table-text-mobile">Difficulty: {game.difficulty}</div>
                                    <div className="table-text-mobile">Recorded: {formatDate(game.createdAt)}</div>
                                    <div className="table-loadout-row-wrapper">
                                        {game.players.map((player, i) => (
                                            <div key={i}>
                                                <div className="table-loadout-wrapper">{renderStrategems(player)}</div>
                                                <div className="table-loadout-wrapper">{renderWeapons(player)}</div>
                                                <div className="table-divider" />
                                            </div>
                                        ))}
                                    </div>
                                    <ScreenshotToggle id={game.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
             <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>←</button>
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? "active" : ""}
                        disabled={page === "..."}>
                        {page}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>→</button>
            </div>
        </div>
    );
}

export default GamesTable;
