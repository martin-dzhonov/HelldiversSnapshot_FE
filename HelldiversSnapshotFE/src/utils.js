import {
    isDev,
    missionNames,
    itemCategoryColors,
    itemCategories,
    strategems,
    weaponsDict,
    weaponCategoryColors,
    weaponCategories
} from "./constants";

const getStrategemByName = (name) => {
    const result = Object.entries(strategems).find(([key, value]) => value.name === name);
    return {
        "id": result[0],
        ...result[1]
    };
}

const getItemId = (name) => {
    const entry = Object.entries({ ...strategems, ...weaponsDict }).find(([key, value]) => value.name === name);
    return entry ? entry[0] : null;
};

const getItemColor = (item) => {
    return itemCategoryColors[itemCategories.indexOf(strategems[item].category)];
};

const getWeaponColor = (item) => {
    return weaponCategoryColors[weaponCategories.indexOf(weaponsDict[item].category)];
};

const getItemsByCategory = (category) => {
    if (category === "All") {
        return Object.values(strategems);
    }
    const result = Object.values(strategems).filter((item) => item.category === category);
    return result;
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
const getMaxRounded = (dataset) => {
    let maxRounded = Math.round(Math.max(...dataset.filter((item => isFinite(item)))));
    return maxRounded < 2 ? 4 : maxRounded + 5;
}
function capitalizeFirstLetter(str) {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

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

const getStrategemRank = (data, strategemName, category) => {
    const sorted = Object.entries(data?.strategems).sort((a, b) => b[1].loadouts - a[1].loadouts);
    if (category) {
        const strategemCategory = strategems[strategemName].category;
        const categoryRank = sorted.filter((item) => strategems[item[0]].category === strategemCategory).findIndex(item => item[0] === strategemName);
        return categoryRank + 1;
    } else {
        const rankAll = sorted.findIndex(item => item[0] === strategemName);
        return rankAll + 1;
    }
}

const getWeaponRank = (data, weaponName) => {
    const sorted = Object.entries(data?.weapons).sort((a, b) => b[1].loadouts - a[1].loadouts);
    const weaponCategory = weaponsDict[weaponName].category;
    const categoryRank = sorted.filter((item) => weaponsDict[item[0]].category === weaponCategory).findIndex(item => item[0] === weaponName);
    return categoryRank + 1;
}

const getPatchDiffs = (startPatch, endPatch) => {
    const diffsObj = {};
    Object.entries(endPatch).forEach(([key, value]) => {
        if (startPatch[key]) {
            const currValue = endPatch[key].value;
            const pastValue = startPatch[key].value;
            const diff = endPatch[key].value - startPatch[key].value;
            if (Math.abs(diff) > 0.9) {
                diffsObj[key] = { currValue, pastValue, value: diff }
            }
        }
    });
    const sortedEntries = Object.entries(diffsObj)
        .sort(([, a], [, b]) => b.value - a.value);

    const up = Object.fromEntries(sortedEntries.filter(([key, obj]) => obj.value > 0).map(([key, obj]) => [
        key, { ...obj, value: Math.abs(obj.value).toFixed(1) }
    ]));
    const down = Object.fromEntries(sortedEntries.filter(([key, obj]) => obj.value < 0).map(([key, obj]) => [
        key, { ...obj, value: Math.abs(obj.value).toFixed(1) }
    ]).reverse());

    return { up, down }
}

const printDiffs = (startPatch, endPatch) => {
    const diffsObj = {};
    Object.entries(endPatch).forEach(([key, value]) => {

        if (startPatch[key]) {
            const pastValue = startPatch[key].value;
            const currValue = endPatch[key].value;
            const startRank = startPatch[key].rank;
            const endRank = endPatch[key].rank;
            const loadouts = endPatch[key].loadouts;

            const diff = Number((currValue - pastValue).toFixed(1));
            diffsObj[key] = { currValue, pastValue, diff, name: strategems[key].name, startRank, endRank, loadouts }
        } else if (isDev) {
            const pastValue = 0;
            const currValue = endPatch[key].value;
            const startRank = endPatch[key].rank;
            const endRank = endPatch[key].rank;
            const loadouts = endPatch[key].loadouts;

            const diff = Number((currValue - pastValue).toFixed(1));
            diffsObj[key] = { currValue, pastValue, diff, name: strategems[key].name, startRank, endRank, loadouts }
        }

    });

    console.log(diffsObj);

    const all = Object.entries(diffsObj).sort(([, a], [, b]) => b.currValue - a.currValue)

    const byCategory = itemCategories.slice(1, 4).map((category) => {
        const filtered = all.filter(([key, value]) => strategems[key].category === category).slice(0, category !== "Defensive" ? 10 : 5);
        return Object.values(Object.fromEntries(filtered));
    })

    console.log(byCategory);
}

const strategemsByCategory = (gamesData, category, full) => {
    if (!gamesData) {
        return {};
    }
    const result = {};
    let strategemsCategory = category === "All" ?
        Object.entries(gamesData.strategems) :
        Object.entries(gamesData.strategems).filter(([key, value]) =>
            strategems[key].category === category);

    //if (!full) { strategemsCategory = strategemsCategory.slice(0, !isDev ? 15 : category === "Defensive" ? 5 : 10); }

    strategemsCategory.forEach(([key, value]) => {
        result[key] = {
            loadouts: value.loadouts,
            value: getPercentage(value.loadouts, gamesData.totalLoadouts),
            rank: getStrategemRank(gamesData, key, true),
        };
    })
    return result;
}

const weaponsByCategory = (gamesData, category, full) => {
    if (!gamesData) {
        return {};
    }
    const weaponsData = gamesData?.weapons;
    const transformedData = Object.keys(weaponsData).reduce((acc, key) => {
        const loadouts = weaponsData[key].loadouts;
        acc[key] = { loadouts, value: getPercentage(loadouts, gamesData.totalLoadouts) };
        return acc;
    }, {});
    const weaponsFiltered = Object.fromEntries(Object.entries(transformedData).filter(([key, value]) =>
        weaponsDict[key].category === category
    ));
    return weaponsFiltered;
}

const getPercentage = (number1, number2, decimals = 1) => {
    const percantageRaw = (number1 / number2) * 100;
    return Number(percantageRaw.toFixed(decimals));
};

export {
    getMissionsByLength,
    getMissionLength,
    getItemColor,
    getItemsByCategory,
    getCountingSuffix,
    capitalizeFirstLetter,
    getPercentage,
    getItemId,
    getStrategemByName,
    getStrategemRank,
    hexToRgbA,
    getMaxRounded,
    getChartGradient,
    getPatchDiffs,
    printDiffs,
    strategemsByCategory,
    weaponsByCategory,
    getWeaponRank,
    getWeaponColor
};

// const isDateBetween = (targetDate, startDate, endDate) => {
//     const target = new Date(targetDate);
//     const start = new Date(startDate);
//     const end = endDate === "Present" ? new Date() : new Date(endDate);

//     const targetTime = target.getTime();
//     const startTime = start.getTime();
//     const endTime = end.getTime();

//     return targetTime >= startTime && targetTime <= endTime;
// };

// function isFiniteNumber(value) {
//     return typeof value === 'number' && Number.isFinite(value);
// }

// const filterByPatch = (period, game) => {
//     return period.id !== "All"
//         ? isDateBetween(
//             game.createdAt,
//             period.start,
//             period.end
//         )
//         : true;
// };

// const sortDictArray = (a, b) => {
//     return b[1] - a[1];
// };

// function getItemDict(data, category) {
//     const itemCount = {};
//     let itemCountRanked = {};
//     let loadoutsCount = 0;

//     const categoryRankings = itemCategories.slice(1).reduce((acc, category) => {
//         acc[category] = 1;
//         return acc;
//     }, {});

//     data.forEach(mission => {
//         const players = mission.players || [];
//         loadoutsCount += players.length;
//         players.forEach(playerList => {
//             playerList.forEach(item => {
//                 itemCount[item] = (itemCount[item] || 0) + 1;
//             });
//         });
//     });

//     Object.entries(itemCount)
//         .sort(sortDictArray)
//         .forEach((item, index) => {
//             const itemCategory = strategems[item[0]].category;
//             itemCountRanked[item[0]] = {
//                 total: item[1],
//                 rankTotal: index + 1,
//                 rankCategory: categoryRankings[itemCategory],
//                 value: getPercentage(item[1], loadoutsCount, 1)
//             };
//             categoryRankings[itemCategory]++;
//         });

//     const rankedByCategory = Object.fromEntries(
//         Object.entries(itemCountRanked).filter(([key]) => {
//             return category === "All" ? true : strategems[key]?.category === category
//         })
//     );

//     return rankedByCategory;
// }