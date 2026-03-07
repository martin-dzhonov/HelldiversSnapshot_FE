import { itemsDict } from "../constants";

const formatValue = (name, value) => {
    if (!Number.isFinite(value)) return value;

    const sign = value > 0 ? '+' : '';
    const isPercent = name === 'Pick Rate Trend';

    return `${sign}${value}${isPercent ? '%' : ''}`;
};

const getValueColor = (value) => {
    if (typeof value === 'number') {
        if (value > 0) return "#679552";
        if (value < 0) return "#de7b6c";
        return "#fff000";
    }
    if (value === 'New') return "#fff000";

    return "#FFFFFF";
};

const getValueRaw = (item, valuesRaw, key) => {
    const { name, category } = item;

    if (name === 'Name') {
        return itemsDict[key].name;
    }

    const map = {
        'Times played': () => valuesRaw?.loadouts_total.toString(),
        'Avg. Level': () => {
            const level = valuesRaw?.avg_level ?? '';
            return level.toString();
        },
        'Rank Trend': () => {
            return 0;
        },
        'Pick Rate Trend': () => {
            return valuesRaw?.isNew
                ? 'New'
                : Number(valuesRaw?.change);
        },
    };

    return map[name]?.();
};

export {
    getValueRaw,
    formatValue,
    getValueColor
};