import {move} from './move';
import {getCharacter} from './getCharacter';
import {delay} from './utils';
import {makeRequest} from './makeRequest';
import {withdraw} from './withdraw';
import client from './client';
import {ArtifactsError} from 'artifacts-api-client';
import {bankCoords} from './consts';

const deposit = async (charName, code, quantity) => {
    try {
        const response = await makeRequest({path: `/my/${charName}/action/bank/deposit`, body: {code, quantity}});
        const {data} = await response.json();
        console.log('deposit response status: ', response.status);
        await delay(data.cooldown.total_seconds * 1000 + 500 || 5000);
        return data;
    } catch (err) {
        console.error('Deposit error');
        throw err;
    }
};
export const depositAllAndBack = async (charName) => {
    try {
        const charInfo = await getCharacter(charName);

        // todo: выяснить в чем дело
        await delay(5000);

        await move(charName, bankCoords.x, bankCoords.y);
        await depositAll(charName);
        await move(charName, charInfo.x, charInfo.y);
    } catch (err) {
        console.error('depositAllAndBack error: ', err);
    }
};

export const depositAllReplenishAndBack = async (charName, code) => {
    try {
        const charInfo = await getCharacter(charName);

        await move(charName, bankCoords.x, bankCoords.y);
        await depositAll(charName);

        //todo rewrite
        const {data} = await client.items.get(code);

        const itemCraftList = data.item.craft.items.map((item) => ({code: item.code, quantity: item.quantity}));
        console.log('itemCraftLits', itemCraftList);
        if (itemCraftList.lenght === 1) {
            await withdraw(charName, itemCraftList[0].code);
        } else {
            const sumOfIngredients = itemCraftList.reduce((acc, item) => acc + item.quantity, 0);
            const multiplier = Math.floor(Number(charInfo.inventory_max_items) / sumOfIngredients);

            for (const item of itemCraftList) {
                await withdraw(charName, item.code, multiplier * item.quantity);
            }
        }
        await move(charName, charInfo.x, charInfo.y);
    } catch (err) {
        console.error('depositAllAndBack error: ', err);
    }
};

export const depositAll = async (charName) => {
    const charInfo = await getCharacter(charName);
    const items = charInfo.inventory?.filter((item) => item.quantity > 0);

    for (const item of items) {
        await deposit(charInfo.name, item.code, item.quantity);
    }
};
// {kind: 'gather', payload: {name: characterName}
// Условие: персонаж уже должен стоять на нужной клетке
export const doAndDepositLoop = async (options: ActionOptions) => {
    // const actionBuilders = {
    //     gather: client.myCharacters.gathering,
    // };

    try {
        const response = await doSwitch(options);
        await delay(response.data.cooldown.total_seconds * 1000 + 500);
    } catch (err) {
        console.log('Gathering error: ', err);
        if (err instanceof ArtifactsError && err?.code === 497) {
            try {
                await depositAllAndBack(options.payload.name);
            } catch (err) {
                console.log('DepositAllAndBack', err);
            }
        }
    }

    doAndDepositLoop(options);
};

// type Kind = 'fight' | 'gather' | 'craft';

class FightAction implements {} {
    kind: 'fight';
    payload: {name: string};
}

class CraftAction implements {} {
    kind: 'craft';
    payload: {name: string; code: string; quantity: number};
}

class GatherAction implements {} {
    kind: 'gather';
    payload: {name: string};
}

// type ActionOptions = FightAction | CraftAction | GatherAction;
type ActionOptions = GatherAction | FightAction | CraftAction;

const doSwitch = async (actionOptions: ActionOptions) => {
    try {
        let myResult;
        switch (actionOptions.kind) {
            case 'gather':
                // eslint-disable-next-line no-case-declarations
                myResult = await client.myCharacters.gathering(actionOptions.payload.name);

                break;
            case 'fight':
                // eslint-disable-next-line no-case-declarations
                myResult = await client.myCharacters.fight(actionOptions.payload.name);

                break;
        }
        return myResult;
    } catch (err) {
        console.log('doSwitch', err);
        throw err;
    }
};
