import "../styles/App.css";
import { strategems } from "../constants";
import ScreenshotToggle from "./ScreenshotToggle";
import Table from "react-bootstrap/Table";
import { useState } from "react";

function GamesTable({ data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
                        disabled={page === "..."}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
            <Table striped bordered hover size="sm" variant="dark">
                <thead>
                    <tr>
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
                            <td className="text-small">
                            <div >{new Date(game.createdAt).toLocaleString().split(",")[0]} </div>
                            <div >{new Date(game.createdAt).toLocaleString().split(",")[1]} </div>
                            </td>
                            <td className="text-small">
                                <div className="table-loadout-row-wrapper">
                                    {game.players.map((loadout, loadoutIndex) => (
                                        <div key={loadoutIndex} className="table-loadout-wrapper">
                                            {loadout.map((item, itemIndex) => (
                                                <img
                                                    key={itemIndex}
                                                    className="item-img-wrapper"
                                                    src={strategems[item].svg}
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
                            <td className="text-small" style={{width: "180px"}}>{game.mission}</td>
                            <td className="text-small">{game.modifiers.map((item)=> <div>{item.toUpperCase()}</div>)}</td>
                            <td className="text-small">{game.difficulty}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>            
        </div>
    );
}

export default GamesTable;