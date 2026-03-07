import '../../styles/App.css';
import '../../styles/Filters.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';
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

const FilterDropdown = ({ title, value, options, onSelect, renderLabel = (o) => o }) => (
  <div className="filter-container">
    <div className="filters-title">{title}</div>
    <DropdownButton className="dropdown-button" title={value}>
      {options.map((option, index) => (
        <Dropdown.Item key={index} as="button" onClick={() => onSelect(option, index)}>
          {renderLabel(option)}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  </div>
);

function Filters({ filters, setFilters }) {

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
      onSelect: (faction) => setFilters({ ...filters, faction }),
      renderLabel: (f) => f.toUpperCase(),
    },
    {
      title: "PATCH",
      value: filters.patch.name.toUpperCase(),
      options: getPatchOptions(),
      onSelect: (patch) => setFilters({ ...filters, patch }),
      renderLabel: (p) => p.name.toUpperCase(),
    },
    filters.page !== "armor" && {
      title: "CATEGORY",
      value: filters.category.toUpperCase(),
      options: getCategoryOptions(),
      onSelect: (category) => setFilters({ ...filters, category }),
      renderLabel: (c) => c.toUpperCase(),
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
    <div className="filters-container">
      <div className="filters-row">
        {dropdowns.map((d, idx) => <FilterDropdown key={idx} {...d} />)}
      </div>
    </div>
  );
}

export default Filters;