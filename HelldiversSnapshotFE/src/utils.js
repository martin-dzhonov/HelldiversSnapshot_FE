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
        type === "Long" ? missionNames.slice(0, 8) : missionNames.slice(8, missionNames.length);
};

const getCountingSuffix = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = number % 100;

    return (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

const getPercentage = (number1, number2, decimals) => {
    
    const percantageRaw = (number1 / number2) * 100;
    console.log(percantageRaw);
    if(percantageRaw < 0){
        return percantageRaw.toFixed(1);
    } else {
        return Math.round(percantageRaw);
    }
}

export {
    getMissionsByLength,
    getItemName,
    getItemColor,
    getItemCategory,
    getItemsByCategory,
    getCountingSuffix,
    getPercentage
};
