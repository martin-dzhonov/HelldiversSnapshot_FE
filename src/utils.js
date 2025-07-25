import {
    isDev,
    missionNames,
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
} from "./constants";
import * as chartsSettings from "./settings/chartSettings";

const getItemId = (name) => {
    const entry = Object.entries({ ...strategemsDict, ...weaponsDict }).find(([key, value]) => value.name === name);
    return entry ? entry[0] : null;
};

const getItemColor = (item) => {
    const allDict = { ...strategemsDict, ...weaponsDict };
    const index = itemCategories.concat(weaponCategories).indexOf(allDict[item].category);
    const allColors = itemCategoryColors.concat(weaponCategoryColors);
    return allColors[index];
};

const getMissionsByLength = (type) => {
    return type === "All"
        ? missionNames[0].concat(missionNames[1])
        : type === "Long" ? missionNames[0] : missionNames[1];
};

const getMissionLength = (missionName) => {
    const longMissions = getMissionsByLength("Long");
    return longMissions.includes(missionName) ? "Long" : "Short";
};

const getCountingSuffix = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = number % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
};

const getMaxRounded = (dataset, factor) => {
    let maxRounded = Math.round(Math.max(...dataset.filter((item => isFinite(item)))));
    return maxRounded < 3 ? maxRounded + factor : maxRounded + (factor * 2);
};

function capitalizeFirstLetter(str) {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const hexToRgbA = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

const getItemRank = (key, data) => {
    const rankIndex = Object.entries(data).findIndex(item => item[0] === key);

    return rankIndex + 1;
}

const getItemsByCategory = (data, category) => {
    const filtered = Object.fromEntries(Object.entries(data).filter(([key, value]) =>
        itemsDict[key].category === category
    ));
    return filtered;
}

const getPercentage = (number1, number2, decimals = 1) => {
    const percantageRaw = (number1 / number2) * 100;
    return Number(percantageRaw.toFixed(decimals));
};

const getFieldByFilters = (data, filters) => {


    let field = filters.difficulty !== 0 ? 'diffs' : filters.mission !== 'All' ? 'missions' : 'total';
    if (filters.difficulty !== 0) {
        return data[field][filters.difficulty];
    }
    if (filters.mission !== 'All') {
        return data[field][filters.mission.toLowerCase()];
    }
    return data ? data[field] : {};
}



const getTotalsByFilters = (data, filters) => {
    let field = filters.difficulty !== 0 ? 'diffs' : filters.mission !== 'All' ? 'missions' : 'total';
    if (filters.difficulty !== 0) {
        return data[field][filters.page][filters.difficulty];
    }
    if (filters.mission !== 'All') {
        return data[field][filters.page][filters.mission.toLowerCase()];
    }
    return data ? data[field][filters.page] : {};
}

const itemsByCategory = (gamesData, filters, collectionKey) => {

    if (!gamesData) {
        return {};
    }

    const result = {};
    const items = gamesData[filters.page];


    let filtered = filters.category === "All" ?
        Object.entries(items) :
        Object.entries(items).filter(([key, value]) =>
            itemsDict[key].category === filters.category);


    const sorted = filtered.sort((a, b) => b[1].total - a[1].total);

    filtered.forEach(([key, value]) => {

        let itemData = getFieldByFilters(value, filters);

        let totalsData = getTotalsByFilters(gamesData, filters);


        const loadoutsPerc = getPercentage(itemData.loadouts, totalsData.loadouts) > 0 ?
            getPercentage(itemData.loadouts, totalsData.loadouts) :
            getPercentage(itemData.loadouts, totalsData.loadouts, 2);

        result[key] = {
            total: {
                loadouts: itemData.loadouts,
                games: itemData.games
            },
            values: {
                loadouts: loadoutsPerc,
                games: getPercentage(itemData.games, totalsData.games),
                rank: getItemRank(key, Object.fromEntries(filtered)),
                avgLevel: Number((value.totallvl.acc / value.totallvl.count).toFixed(0))

            }
        };
    });

    return result;
}

const getPatchId = (patchName) => {
    const result = patchPeriods.find((patch) => patch.name === patchName).id || null;
    return result;
}
const getPatchDelta = (startPatch, endPatch) => {
    const result = {};
    Object.entries(endPatch).map(([key, value]) => {
        let pastValues = {
            loadouts: 0,
            games: 0,
            rank: -1000,
        }
        if (startPatch[key]) {
            pastValues = { ...startPatch[key].values };
        }
        result[key] = {
            ...value,
            pastValues: pastValues
        }
    })
    const sorted = Object.entries(result).filter(([key, value]) =>
        value?.total?.loadouts !== 0
    ).sort((a, b) => b[1].total.loadouts - a[1].total.loadouts);

    return Object.fromEntries(sorted);
}

function getTrendCharts(data, filters, id) {
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
    let patchesLabels = patchPeriods.map((item) => item.name);
    
    if (filters.page === "weapon_details") {
        patchesValues = patchesValues.slice(0, patchesValues.length - 3);
        patchesLabels = patchesLabels.slice(patchesLabels.length - 5, patchesLabels.length);
    }
    const patchesDataset = patchesValues
        .map((item) => getPatchesValues(item, filters, ranks, id))
        .reverse();

    const patchChart = {
        labels: patchesLabels,
        dataset: patchesDataset,
        options: chartsSettings.patch({
            min: -2,
            max: getRankMax(patchesDataset, filters, ranks, id),
            type: filters.format,
        }),
    };

    return { faction: factionChart, patch: patchChart };
}

function getItemMiscCharts(strategemData, id) {
    if (!strategemData?.total?.loadouts) return { diff: null, mission: null, level: null };

    const chartConfigs = {
        diff: {
            key: 'diffs',
            labels: difficultiesNamesShort,
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

// const getDatasetValue = (itemID, data, filters, absolute = false) => {
//     if (!data) {
//         return -1;
//     }

//     const type = filters.type;
//     const item = data[type][itemID];

//     let values = {
//         'rank_all': !item ? -1 : Object.keys(data[type]).length - getItemRank(itemID, data[type]),
//         'rank_category': !item ? -1 : Object.keys(getItemsByCategory(data[type], itemsDict[itemID].category)).length - getItemRank(itemID, getItemsByCategory(data[type], itemsDict[itemID].category)),
//         'pick_rate': !item ? -0.1 : data.total[filters.type].loadouts ? getPercentage(item?.total.loadouts, data.total[filters.type].loadouts) : -0.1,
//         'game_rate': !item ? -0.1 : data.total[filters.type].games ? getPercentage(item?.total.games, data.total[filters.type].games) : -0.1,
//     };

//     if (absolute) {
//         values.rank_all = getItemRank(itemID, data[type]);
//         values.rank_category = getItemRank(itemID, getItemsByCategory(data[type], itemsDict[itemID].category));
//     }

//     return values[filters.format];
// }



const getRankMax = (dataset, filters, ranks, itemId, category = false) => {

    const values = {
        'rank_all': ranks.all + 2,
        'rank_category': ranks[itemsDict[itemId].category] + 2,
        'pick_rate': Math.max(...dataset.filter((item => isFinite(item)))) + 5,
        'game_rate': Math.max(...dataset.filter((item => isFinite(item)))) + 5
    };

    return values[filters.format];
}

const getFactionsMax = (itemID, dataset, data, filters) => {
    if (!data) {
        return 0;
    }

    const type = filters.type;
    const item = data[type][itemID];
    const values = {
        'rank_all': Object.keys(data[type]).length,
        'rank_category': Object.keys(getItemsByCategory(data[type], itemsDict[itemID].category)).length,
        'pick_rate': Math.max(...dataset.filter((item => isFinite(item)))) + 5,
        'game_rate': Math.max(...dataset.filter((item => isFinite(item)))) + 5
    };

    return values[filters.format];
}

const getPatchesMax = (itemID, dataset, data, filters) => {
    if (!data) {
        return 0;
    }

    const type = filters.type;
    const item = data[type][itemID];
    const values = {
        'rank_all': Object.keys(data[type]).length,
        'rank_category': Object.keys(getItemsByCategory(data[type], itemsDict[itemID].category)).length,
        'pick_rate': Math.max(...dataset.filter((item => isFinite(item)))) + 5,
        'game_rate': Math.max(...dataset.filter((item => isFinite(item)))) + 5
    };

    return values[filters.format];
}

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

const getDatasetByKey = (itemID, itemData, patchData, key, type = 'strategem') => {
    return [{
        data: Object.keys(itemData[key]).map(subKey =>
            getPercentage(itemData[key][subKey].loadouts, patchData[key][type][subKey].loadouts)),
        backgroundColor: getItemColor(itemID),
        barThickness: 24
    }]
}

const getFiltersCount = (data, filters) => {
    const asd = getFieldByFilters(data, filters);
}

const getChartDataset = ({ data, color, barSize = 24 }) => {
    return [{
        data: data,
        backgroundColor: color,
        barThickness: barSize
    }];
}

const getChartData = (data, filters) => {
    const { faction, page, patch, category } = filters;
    const patchIndex = patchPeriods.length - patch.id - 1;
    const entries = Object.entries(data[faction].items);
    console.log(entries)
    const pickStats = obj => {
        if (!obj) return { loadouts_total: null, loadouts: null, games: null, rank: null, rank_category: null, avgLevel: null };
        const { loadouts_total, loadouts, games, rank, rank_category, avgLevel, isNew } = obj;
        return { loadouts_total, loadouts, games, rank, rank_category, avgLevel, ...(isNew && { isNew }) };
    };

    const chartData = Object.fromEntries(
        entries.map(([key, item]) => [key, {
            total: { loadouts: item.values?.[patchIndex].loadouts_total, games: 500 },
            values: pickStats(item.values?.[patchIndex]),
            pastValues: pickStats(item.values?.[patchIndex + 1]),
        }])
            .filter(([, item]) => item.values.loadouts > 0)
            .filter(([key]) => category === "All" || itemsDict[key].category === category)
            .sort(([, a], [, b]) => b.values.loadouts_total - a.values.loadouts_total)
    );
    return {
        chartData,
        totals: data[faction].totals[patchIndex]
    };
};

export {
    getMissionsByLength,
    getMissionLength,
    getItemColor,
    getCountingSuffix,
    capitalizeFirstLetter,
    getPercentage,
    getItemId,
    getItemRank,
    hexToRgbA,
    getMaxRounded,
    getChartGradient,
    getPatchId,
    getDatasetValue,
    getRankMin,
    getCompanionChartData,
    getDatasetByKey,
    getFieldByFilters,
    itemsByCategory,
    getPatchDelta,
    getItemsByCategory,
    getFiltersCount,
    getFactionsMax,
    getPatchesMax,
    getTotalsByFilters,
    getChartData,
    getPatchesValues,
    getRankMax,
    getChartDataset,
    getItemMiscCharts,
    getTrendCharts
};