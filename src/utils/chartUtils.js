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
        'Times played': () => valuesRaw.total.loadouts.toString(),
        'Avg. Level': () => {
            const level = valuesRaw?.values?.avgLevel ?? '';
            return level.toString();
        },
        'Rank Trend': () => {
            let rankValue = valuesRaw.pastValues.rank - valuesRaw.values.rank;
            if (category && category !== 'All') {
                rankValue = valuesRaw.pastValues.rank_category - valuesRaw.values.rank_category;
            }
            return valuesRaw.values.isNew ? 'New' : rankValue;
        },
        'Pick Rate Trend': () => {
            return valuesRaw.values.isNew
                ? 'New'
                : Number((valuesRaw.values.loadouts - valuesRaw.pastValues.loadouts).toFixed(2));
        },
    };

    return map[name]?.();
};

export {
    getValueRaw,
    formatValue,
    getValueColor
};