import {depositAll, doAndDepositLoop} from './deposit';
import client from './client';
import {move} from './move';
import {bankCoords} from './consts';
import {withdraw} from './withdraw';
import {doGathering} from './gathering';
import {craftAll, craftAllAndDepositLoop, craftListCount} from './craft';

const charactersSet = ['Litlpip', 'man1', 'man2', 'man3', 'man4'];

const set1 = ['man3'];
const set2 = ['Litlpip', 'man1', 'man2'];

function main() {
    try {
        // depositAllAndBack('Litlpip')
        // characters.forEach(item=> doGathering(item))
        // characters.forEach(charName=> doAndDepositLoop(actionBuilders.fight(charName),charName))
        // const characters = charactersSet.splice(0,1)
        // charactersSet.forEach(charName=> doAndDepositLoop(actionBuilders.gather(charName),charName))
        // craftAllAndDepositLoop('sticky_sword', 'man2');
        // charactersSet.forEach((charName) => move(charName, 2, 6));
        // set2.forEach((charName) => craftAllAndDepositLoop('copper', charName));
        // charactersSet.forEach((char) => doAndDepositLoop({kind: 'fight', payload: {name: char}}));

        // ['Litlpip', 'man1', 'man2', 'man4'].forEach((char) => craftAllAndDepositLoop('iron', char));
        // craftAllAndDepositLoop('copper_armor', 'man3');
        // craftListCount(['iron_boots', 'iron_helm'], 'man3', 5);
        // move('Litlpip', bankCoords.x, bankCoords.y);
        // move('Litlpip', 1, 5);
        // console.log('haha');
        // withdraw('Litlpip', 'iron_ore');
        ['Litlpip', 'man1', 'man2', 'man3', 'man4'].forEach((char) =>
            doAndDepositLoop({
                kind: 'fight',
                payload: {name: char},
            }),
        );
    } catch (err) {
        console.error('Caught in main', err);
    }
}

main();
