import {
    itemCategoryColors,
    itemCategories,
    strategemsDict,
    weaponsDict,
    weaponCategoryColors,
    weaponCategories,
    itemsDict,
    patchPeriods,
    difficultiesNamesShort,
    missionTypes,
    factions,
    factionColors
} from "../constants";
import * as chartsSettings from "../settings/chartSettings";


const getChartDataset = ({ data, color, barSize = 24 }) => {
    return [{
        data: data,
        backgroundColor: color,
        barThickness: barSize
    }];
}

const getPatchesValues = (data, filters, ranks, itemId) => {
    if (!data) {
        return -1;
    }
    const itemCategory = itemsDict[itemId].category;

    let filterKeys = {
        'rank_all': data.rank >= 0 ? ranks.all - data.rank : -0.1,
        'rank_category': data.rank_category >= 0 ? ranks[itemCategory] - data.rank_category : -0.1,
        'pick_rate': data.loadouts >= 0 ? data.loadouts : -0.1,
        'game_rate': data.games >= 0 ? data.games : -0.1,
    };

    return filterKeys[filters.format];
}

const getRankMax = (dataset, filters, ranks, itemId, category = false) => {
    const values = {
        'rank_all': ranks.all + 2,
        'rank_category': ranks[itemsDict[itemId].category] + 2,
        'pick_rate': Math.max(...dataset.filter((item => isFinite(item)))) + 5,
        'game_rate': Math.max(...dataset.filter((item => isFinite(item)))) + 5
    };

    return values[filters.format];
}

const getDatasetValue = (data, filters, ranks, itemId) => {
    if (!data) {
        return -1;
    }

    const values = data.values[patchPeriods.length - 1 - filters.patch.id];
    const itemCategory = itemsDict[itemId].category;
    let filterKeys = {
        'rank_all': values.rank > 0 ? ranks.all - values.rank : ranks.all,
        'rank_category': values.rank_category > 0 ? ranks[itemCategory] - values.rank_category : ranks[itemCategory],
        'pick_rate': values.loadouts,
        'game_rate': values.games,
    };

    return filterKeys[filters.format];
}

const hexToRgbA = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getRankMin = (format, value) => {
    switch (format) {
        case 'rank_all':
            return -(value / 10);
        case 'rank_category':
            return -(value / 10);
        case 'pick_rate':
            return -(value / 12) - 1;
        case 'game_rate':
            return -(value / 10) - 1;
        default:
            return 0;
    }
}

const getPercentage = (number1, number2, decimals = 1) => {
    const percantageRaw = (number1 / number2) * 100;
    return Number(percantageRaw.toFixed(decimals));
};


const getItemId = (name) => {
    const entry = Object.entries({ ...strategemsDict, ...weaponsDict }).find(([key, value]) => value.name === name);
    return entry ? entry[0] : null;
};

const getItemColor = (item) => {
    const allDict = { ...strategemsDict, ...weaponsDict };
    if (!allDict[item] || !allDict[item].category) {
        return '#ffe433';
    }
    const index = itemCategories.concat(weaponCategories).indexOf(allDict[item].category);
    const allColors = itemCategoryColors.concat(weaponCategoryColors);
    return allColors[index];
};

const getCountingSuffix = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = number % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
};

function capitalizeFirstLetter(str) {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const getChartGradient = (context, itemColor) => {
    const chart = context.chart;
    const { ctx, chartArea } = chart;
    if (!chartArea) {
        return;
    }
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, hexToRgbA(itemColor, 0.15));
    gradient.addColorStop(0.2, hexToRgbA(itemColor, 0.25));
    gradient.addColorStop(1, hexToRgbA(itemColor, 0.9));
    return gradient;
};

const getPatchId = (patchName) => {
    const result = patchPeriods.find((patch) => patch.name === patchName).id || null;
    return result;
}

function getTrendCharts(data, filters, id, isMobile = false) {
    if (!data) return { faction: null, patch: null };
    const strategemData = data[filters.faction];
    if (!strategemData) return { faction: null, patch: null };

    const ranks = strategemData.ranks;

    const factionsDataset = factions.map((faction) =>
        getDatasetValue(data[faction], filters, ranks, id)
    );

    const factionChart = {
        labels: factions.map((item) => capitalizeFirstLetter(item)),
        datasets: getChartDataset({ data: factionsDataset, color: factionColors }),
        options: chartsSettings.faction({
            min: 0,
            max: getRankMax(factionsDataset, filters, ranks, id),
            type: filters.format,
        }),
    };

    let patchesValues = data[filters.faction].values;
    let patchesLabels = patchPeriods.slice().reverse().map((item) => item.name);

    if (filters.page === "weapon_details") {
        patchesValues = patchesValues.slice(0, patchesValues.length - 3);
        patchesLabels = patchesLabels.slice(0, patchesLabels.length - 3).slice().reverse();
    }
    if (filters.page === "strategem_details") {
        patchesValues = patchesValues.slice(0, patchesValues.length - 2);
        patchesLabels = patchesLabels.slice(0, patchesLabels.length - 2).slice().reverse();
    }
    const patchesDataset = patchesValues
        .map((item) => getPatchesValues(item, filters, ranks, id))
        .reverse();

    const max = getRankMax(patchesDataset, filters, ranks, id);
    const min = getRankMin(filters.format, max)

    const patchChart = {
        labels: patchesLabels,
        dataset: patchesDataset,
        options: chartsSettings.patch({
            min,
            max,
            type: filters.format,
            isMobile
        }),
    };

    return { faction: factionChart, patch: patchChart };
}

function getItemMiscCharts(strategemData, id, isMobile) {
    if (!strategemData?.total?.loadouts) return { diff: null, mission: null, level: null };

    const chartConfigs = {
        diff: {
            key: 'diffs',
            labels: isMobile ? difficultiesNamesShort.map((item, index) => 7 + index) : difficultiesNamesShort,
            transform: (item) => item.value,
        },
        mission: {
            key: 'missions',
            labels: missionTypes,
            transform: (item) => item.value,
        },
        level: {
            key: 'levels',
            labels: strategemData.levels ? Object.keys(strategemData.levels) : [],
            transform: (item) => getPercentage(item, strategemData.total.loadouts),
        },
    };

    const charts = {};

    for (const [name, config] of Object.entries(chartConfigs)) {
        const dataSource = strategemData[config.key];
        if (dataSource) {
            charts[name] = {
                labels: config.labels,
                datasets: getChartDataset({
                    data: Object.values(dataSource).map(config.transform),
                    color: getItemColor(id),
                }),
            };
        } else {
            charts[name] = null;
        }
    }

    return charts;
}

const getCompanionChartData = (strategemData) => {

    if (strategemData.companions.strategem) {
        return Object.values(strategemData.companions.strategem).map(category => {
            return category.map(item => {
                return {
                    ...item,
                    total: { loadouts: item.total },
                    values: { loadouts: getPercentage(item.total, strategemData.total.loadouts) }
                };
            })
        }).map((item) => {
            const values = item.map((subItem) => subItem.values.loadouts);
            return {
                data: item.reduce((acc, item) => {
                    const { name, ...rest } = item;
                    acc[name] = rest;
                    return acc;
                }, {}),
                options: chartsSettings.companions({
                    max: Math.max(...values) + 15,
                })
            }
        })
    }
    return {}
}

const pickStats = (obj) => {
    if (!obj) return {
        loadouts_total: null,
        loadouts: null,
        games: null,
        rank: null,
        rank_category: null,
        avgLevel: null
    };

    const { loadouts_total, loadouts, games, rank, rank_category, avgLevel, isNew } = obj;

    return {
        loadouts_total,
        loadouts,
        games,
        rank,
        rank_category,
        avgLevel,
        ...(isNew && { isNew })
    };
};

const getChartData = (data, filters) => {
    const { faction, patch, category } = filters;
    const itemEntries = Object.entries(data[faction].items);
    const patchIndex = patchPeriods.length - patch.id - 1;

    const entriesFiltered = itemEntries.map(([key, item]) => [key, {
        total: { loadouts: item.values?.[patchIndex].loadouts_total, games: 0 },
        values: pickStats(item.values?.[patchIndex]),
        pastValues: pickStats(item.values?.[patchIndex + 1]),
    }])
        .filter(([, item]) => item.values.loadouts_total > 0)
        .filter(([key]) => category === "All" || itemsDict[key].category === category)
        .sort(([, a], [, b]) => b.values.loadouts_total - a.values.loadouts_total)

    return {
        chartData: Object.fromEntries(entriesFiltered),
        totals: data[faction].totals[patchIndex]
    };
};

export {
    getItemColor,
    getCountingSuffix,
    capitalizeFirstLetter,
    getItemId,
    getChartGradient,
    getPatchId,
    getCompanionChartData,
    getChartData,
    getItemMiscCharts,
    getTrendCharts,
};