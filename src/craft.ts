import {makeRequest} from './makeRequest';
import {getCharacter} from './getCharacter';
import {delay} from './utils';
import {depositAllReplenishAndBack} from './deposit';

const craft = async (code, quantity, charName) => {
    let response;
    try {
        response = await makeRequest({path: `/my/${charName}/action/crafting`, body: {code, quantity}});
        const {data} = await response.json();
        await delay(data.cooldown.total_seconds * 1000 + 500 || 5000);
    } catch (err) {
        console.log('Craft error. Status code: ', err);
    }
};

const calculateMaxCraftQuantity = (inventory, recipe) => {
    let result = undefined;

    recipe.forEach((recipeItem) => {
        if (!inventory.find((item) => item.code === recipeItem.code)) {
            throw Error('Lack of items', recipeItem.code);
        }
    });

    recipe.forEach((recipeItem) => {
        const inventoryItem = inventory.find((item) => item.code === recipeItem.code);
        const timesCraft = Math.floor(inventoryItem.quantity / recipeItem.quantity);
        if (result === undefined) result = timesCraft;
        result = Math.min(timesCraft, result);
    });

    return result;
};

export const craftAll = async (code, charName) => {
    try {
        const response = await makeRequest({path: `/items/${code}`, method: 'GET'});
        const {data} = await response.json();
        const charInfo = await getCharacter(charName);

        const inventoryItems = charInfo.inventory?.filter((item) => item.quantity > 0);
        const craftRecipe = data.item.craft.items;

        const quantity = calculateMaxCraftQuantity(inventoryItems, craftRecipe);

        await craft(code, quantity, charName);
    } catch (err) {
        console.log('Craft all error: ', err);
    }
};

export const craftAllAndDepositLoop = async (code, charName) => {
    try {
        await craftAll(code, charName);

        await depositAllReplenishAndBack(charName, code);
    } catch (err) {
        console.error('CraftAllAndDepositLoop error', err);
    }

    craftAllAndDepositLoop(code, charName);
};

export const craftListCount = async (codeList, char, amount) => {
    for (const code of codeList) {
        await craft(code, amount, char);
    }
};
