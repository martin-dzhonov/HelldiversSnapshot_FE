import {
    missionNames,
    itemCategoryColors,
    itemCategories,
    strategems
} from "./constants";

const getStrategemByName = (name) => {
    const result = Object.entries(strategems).find(([key, value]) => value.name === name);
    return {
        "id": result[0],
        ...result[1]
    };
}

const getItemId = (name) => {
    const entry = Object.entries(strategems).find(([key, value]) => value.name === name);
    return entry ? entry[0] : null;
};

const getItemColor = (item) => {
    return itemCategoryColors[itemCategories.indexOf(strategems[item].category)];
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

function capitalizeFirstLetter(str) {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const getPercentage = (number1, number2, decimals = 1) => {
    const percantageRaw = (number1 / number2) * 100;
    return Number(percantageRaw.toFixed(decimals));
};

function isFiniteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}

const isDateBetween = (targetDate, startDate, endDate) => {
    const target = new Date(targetDate);
    const start = new Date(startDate);
    const end = endDate === "Present" ? new Date() : new Date(endDate);

    const targetTime = target.getTime();
    const startTime = start.getTime();
    const endTime = end.getTime();

    return targetTime >= startTime && targetTime <= endTime;
};

const filterByPatch = (period, game) => {
    return period.id !== "All"
        ? isDateBetween(
            game.createdAt,
            period.start,
            period.end
        )
        : true;
};

const sortDictArray = (a, b) => {
    return b[1] - a[1];
};

function getItemDict(data, category) {
    const itemCount = {};
    let itemCountRanked = {};
    let loadoutsCount = 0;

    const categoryRankings = itemCategories.slice(1).reduce((acc, category) => {
        acc[category] = 1;
        return acc;
    }, {});

    data.forEach(mission => {
        const players = mission.players || [];
        loadoutsCount += players.length;
        players.forEach(playerList => {
            playerList.forEach(item => {
                itemCount[item] = (itemCount[item] || 0) + 1;
            });
        });
    });

    Object.entries(itemCount)
        .sort(sortDictArray)
        .forEach((item, index) => {
            const itemCategory = strategems[item[0]].category;
            itemCountRanked[item[0]] = {
                total: item[1],
                rankTotal: index + 1,
                rankCategory: categoryRankings[itemCategory],
                value: getPercentage(item[1], loadoutsCount, 1)
            };
            categoryRankings[itemCategory]++;
        });

    const rankedByCategory = Object.fromEntries(
        Object.entries(itemCountRanked).filter(([key]) => {
            return category === "All" ? true : strategems[key]?.category === category
        })
    );

    return rankedByCategory;
}


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

export {
    getMissionsByLength,
    getMissionLength,
    getItemColor,
    getItemsByCategory,
    getCountingSuffix,
    capitalizeFirstLetter,
    getPercentage,
    isDateBetween,
    filterByPatch,
    getItemId,
    getItemDict,
    getStrategemByName,
    getStrategemRank,
    isFiniteNumber,
    hexToRgbA,
    getChartGradient
};
