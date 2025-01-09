import {
    missionNames,
    itemCategoryColors,
    itemCategories,
    strategems
} from "./constants";

const getStrategemByName = (name) =>{
   const result = Object.entries(strategems).find(([key, value])=> value.name === name);
   return {
    "id": result[0],
    ...result[1]
   };
}

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
        ? missionNames
        : type === "Long"
            ? missionNames.slice(0, 16)
            : missionNames.slice(16, missionNames.length);
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

const sortDictArray = (a, b) => {
    return b[1] - a[1];
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

const getRankedDict = (data, category, itemName) => {
    let dictObj = Object.keys(strategems).reduce((acc, key) => {
        acc[key] = 0;
        return acc;
    }, {});


    // let dictObjResult = {};
    // let loadoutsCount = 0;
    // let dictObjByCategory = {};

    // const categoryRankings = {
    //     "Eagle/Orbital": 1,
    //     "Support": 1,
    //     "Defensive": 1
    // };

    // data.forEach((game) => {
    //     game.players.forEach((loadout) => {
    //         if (itemName) {
    //             if (loadout.includes(itemName)) {
    //                 loadoutsCount++;
    //                 loadout.forEach((item) => {
    //                     if (dictObj[item]) {
    //                         dictObj[item] += 1;
    //                     } else {
    //                         dictObj[item] = 1;
    //                     }
    //                 });
    //             }
    //         } else {
    //             loadoutsCount++;
    //             loadout.forEach((item) => {
    //                 if (dictObj[item]) {
    //                     dictObj[item] += 1;
    //                 } else {
    //                     dictObj[item] = 1;
    //                 }
    //             });
    //         }
    //     });
    // });

    // console.log(dictObj)

    // Object.entries(dictObj)
    //     .sort(sortDictArray)
    //     .forEach((item, index) => {
    //         const itemCategory = getItemCategory(item[0]);
    //         dictObjResult[item[0]] = {
    //             total: item[1],
    //             rankTotal: index + 1,
    //             rankCategory: categoryRankings[itemCategory],
    //             percentageLoadouts: getPercentage(item[1], loadoutsCount, 1)
    //         };
    //         categoryRankings[itemCategory]++;
    //     });


    // Object.entries(dictObjResult)
    //     .filter((item) => getItemsByCategory(category).includes(item[0]))
    //     .forEach((item) => {
    //         dictObjByCategory[item[0]] = item[1];
    //     });

    return dictObj;
};

function countPlayerItems(data, category) {
    const itemCount = {};
    let itemCountRanked = {};
    let loadoutsCount = 0;

    const categoryRankings = {
        "Eagle/Orbital": 1,
        "Support": 1,
        "Defensive": 1
    };

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
            //console.log(item);
            //console.log(strategems[item[0]]);
            const itemCategory = strategems[item[0]].category;
            itemCountRanked[item[0]] = {
                total: item[1],
                rankTotal: index + 1,
                rankCategory: categoryRankings[itemCategory],
                percentageLoadouts: getPercentage(item[1], loadoutsCount, 1)
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

const getItemId = (name) => {
    const entry = Object.entries(strategems).find(([key, value]) => value.name === name);
    return entry ? entry[0] : null;
};

const getStrategemRank = (data, strategemName, category) =>{
    const sorted = Object.entries(data?.strategems).sort((a, b) => b[1].loadouts - a[1].loadouts);

    if(category){
        const strategemCategory = strategems[strategemName].category;
        const categoryRank = sorted.filter((item)=> strategems[item[0]].category === strategemCategory).findIndex(item => item[0] === strategemName);
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
    getRankedDict,
    filterByPatch,
    getItemId,
    countPlayerItems,
    getStrategemByName,
    getStrategemRank,
    isFiniteNumber
};
