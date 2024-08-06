import {makeRequest} from './makeRequest.ts';
import {getCharacter} from './getCharacter.ts';
import {delay} from './utils.ts';
import client from './client';

// todo add amount
export const withdraw = async (charName, itemCode, amount = undefined) => {
    try {
        const info = await getBankItemsInfo(itemCode);
        const charInfo = await getCharacter(charName);
        const charCurrentInventoryCount = charInfo.inventory
            ? charInfo.inventory.reduce((acc, item) => acc + Number(item.quantity), 0)
            : 0;
        const amountToTake = amount
            ? amount
            : Math.min(Number(charInfo.inventory_max_items), Number(info[0].quantity)) - charCurrentInventoryCount;
        const {data} = await client.myCharacters.withdrawBank(charName, {code: itemCode, quantity: amountToTake});

        await delay(data.cooldown.total_seconds * 1000 + 500 || 5000);
    } catch (err) {
        console.log('Withdraw error', err);
    }
};

export const getBankItemsInfo = async (code) => {
    try {
        const {data} = await client.myAccount.getBankItems({item_code: code});

        return data;
    } catch (err) {
        console.log('getBankItemsInfo error', err);
    }
};
