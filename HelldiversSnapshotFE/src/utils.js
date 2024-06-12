import {
    baseLabels,
    itemNames,
    missionNames,
    itemCategoryColors,
    itemCategories,
    itemCategoryIndexes,
    itemNamesFull
} from './constants';

const getItemName = (item, type) => {
    const index = baseLabels.indexOf(item);
    if (index !== -1) {
        return type === "short" ? itemNames[index] : itemNamesFull[index];
    }
    return "";
}

const getItemColor = (item) => {
    const index = baseLabels.indexOf(item);
    return index < 18 ? itemCategoryColors[1] : index < 41 ? itemCategoryColors[2] : itemCategoryColors[3];
};

const getItemCategory = (item) => {
    const itemIndex = baseLabels.indexOf(item);
    return itemIndex < 18 ? itemCategories[1] : itemIndex < 41 ? itemCategories[2] : itemCategories[3];
}
const getItemsByCategory = (category) => {
    const categoryIndex = itemCategories.indexOf(category);
    const sliced = baseLabels.slice(itemCategoryIndexes[categoryIndex][0], itemCategoryIndexes[categoryIndex][1]);
    return sliced;
};

const getMissionsByLength = (type) => {
    return type === "All" ? missionNames :
        type === "Long" ? missionNames.slice(0, 10) : missionNames.slice(10, missionNames.length);
};

const getMissionLenght = (missionName) => {
    const longMissions = getMissionsByLength("Long");
    return longMissions.includes(missionName) ? "Long" : "Short";
};

const getCountingSuffix = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = number % 100;

    return (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

const getPercentage = (number1, number2, decimals) => {
    const percantageRaw = (number1 / number2) * 100;
    if (percantageRaw < 0) {
        return percantageRaw.toFixed(1);
    } else {
        return Math.round(percantageRaw);
    }
}

const sortDictArray = (a, b) => { return b[1] - a[1] };

const getRankedDict = (data) => {
    let dictObj = {};
    let dictObjResult = {};
    let loadoutsCount = 0;

    const categoryRankings = {
        "Eagle/Orbital": 1,
        "Support": 1,
        "Defensive": 1
    }

    data.forEach((game) => {
        game.players.forEach((loadout) => {
            loadoutsCount++;
            loadout.forEach((item) => {
                if (dictObj[item]) {
                    dictObj[item] += 1;
                } else {
                    dictObj[item] = 1;
                }
            })

        })
    })


    Object.entries(dictObj)
        .sort(sortDictArray)
        .forEach((item, index) => {
            const itemCategory = getItemCategory(item[0]);
            dictObjResult[item[0]] = {
                total: item[1],
                rankTotal: index + 1,
                rankCategory: categoryRankings[itemCategory],
                percentageLoadouts: getPercentage(item[1], loadoutsCount)
            }
            categoryRankings[itemCategory]++;
        });

    return dictObjResult;
}

export {
    getMissionsByLength,
    getMissionLenght,
    getItemName,
    getItemColor,
    getItemCategory,
    getItemsByCategory,
    getCountingSuffix,
    getPercentage,
    getRankedDict
};
