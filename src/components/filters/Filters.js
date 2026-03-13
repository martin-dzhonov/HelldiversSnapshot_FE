import '../../styles/App.css';
import '../../styles/Filters.css';
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';


import { useState } from 'react';
import { FaLock, FaLockOpen, FaXmark } from 'react-icons/fa6';
import {
    itemCategories,
    weaponCategories,
    difficultiesNames,
    patchPeriods,
    factions,
    modifierNames,
    missionTypesAll
} from '../../constants';
import { capitalizeFirstLetter } from '../../utils/utils';

const FilterDropdown = ({ title, value, options, onSelect, renderLabel = (o) => o, renderTooltip }) => (
    <div className="filter-container">
        <div className="filters-title">{title}</div>
        <DropdownButton className="dropdown-button" title={value}>
            {options.map((option, index) => {
                const item = (
                    <Dropdown.Item as="button" onClick={() => onSelect(option, index)}>
                        {renderLabel(option)}
                    </Dropdown.Item>
                );

                if (!renderTooltip) return <div key={index}>{item}</div>;

                return (
                    <OverlayTrigger
                        key={index}
                        placement="right"
                        overlay={
                            <Tooltip id={`tooltip-${title}-${index}`} className="custom-tooltip">
                                {renderTooltip(option)}
                            </Tooltip>}>

                        <div>{item}</div>
                    </OverlayTrigger>
                );
            })}
        </DropdownButton>
    </div>
);

function Filters({ filters, totals, setFilters, resetFilters }) {

    const [locked, setLocked] = useState(true);

    const patchOptionsMap = {
        strategem: [...patchPeriods].reverse(),
        weapons: [...patchPeriods.slice(3)].reverse(),
        armor: [...patchPeriods.slice(5)].reverse(),
    };

    const categoryOptionsMap = {
        strategem: itemCategories,
        weapons: weaponCategories,
    };

    const getPatchOptions = () => patchOptionsMap[filters.page] || [];
    const getCategoryOptions = () => categoryOptionsMap[filters.page] || [];

    const dropdowns = [
        {
            title: "FACTION",
            value: filters.faction.toUpperCase(),
            options: factions,
            onSelect: (faction) => setFilters({ ...filters, faction, modifier: "ALL" }),
            renderLabel: (f) => f.toUpperCase(),
        },
        filters.page !== "armor" && {
            title: "CATEGORY",
            value: filters.category.toUpperCase(),
            options: getCategoryOptions(),
            onSelect: (category) => setFilters({ ...filters, category }),
            renderLabel: (c) => c.toUpperCase(),
        },
        {
            title: "PATCH",
            value: filters.patch.name.toUpperCase(),
            options: getPatchOptions(),
            onSelect: (patch) =>
                setFilters({
                    ...filters,
                    patch,
                    modifier: patch.id < 10 ? "ALL" : filters.modifier
                }),
            renderLabel: (p) => p.name.toUpperCase(),
            renderTooltip: (p) => `${p.start} - ${p.end}`
        },
        {
            title: "MODIFIERS",
            value: filters.modifier.toUpperCase(),
            options: modifierNames[filters.faction],
            onSelect: (modifier) => setFilters({ ...filters, modifier }),
            renderLabel: capitalizeFirstLetter,
        },
        {
            title: "DIFFICULTY",
            value: filters.difficulty === 0 ? "ALL" : filters.difficulty,
            options: difficultiesNames,
            onSelect: (diffName, diffIndex) =>
                setFilters({
                    ...filters,
                    difficulty: diffName === "All" ? 0 : 6 + diffIndex,
                }),
            renderLabel: (d) => d.toUpperCase(),
        },
        {
            title: "MISSION",
            value: filters.mission.toUpperCase(),
            options: missionTypesAll,
            onSelect: (mission) => setFilters({ ...filters, mission }),
            renderLabel: (m) => m.toUpperCase(),
        },
    ].filter(Boolean);

    return (
        <div className={`filters-container ${locked ? "filters-locked" : ""}`}>
            <div className="filters-row-wrapper">
                <div className="filters-row">
                    {dropdowns.map((d, idx) => <FilterDropdown key={idx} {...d} />)}
                </div>

                {totals && (
                    <div className="totals-wrapper">
                        <div className="filter-container totals-dropdown">
                            <div className="totals-row">
                                <div className="totals-title">GAMES</div>
                                <div className="totals-value">{totals.games}</div>
                            </div>

                            <div className="totals-separator"></div>

                            <div className="totals-row">
                                <div className="totals-title">LOADOUTS</div>
                                <div className="totals-value">{totals.loadouts}</div>
                            </div>
                        </div>

                        <div className="filters-actions">
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id="lock-tooltip" className="custom-tooltip">
                                        {locked ? "Unlock" : "Always On Top"}
                                    </Tooltip>
                                }>
                                <button
                                    className="filters-action-btn"
                                    onClick={() => setLocked(!locked)}>
                                    {locked ? <FaLock /> : <FaLockOpen />}
                                </button>
                            </OverlayTrigger>

                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id="reset-tooltip" className="custom-tooltip">
                                        Reset Filters
                                    </Tooltip>
                                }>
                                <button
                                    className="filters-action-btn"
                                    onClick={resetFilters}>
                                    <FaXmark />
                                </button>
                            </OverlayTrigger>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Filters;