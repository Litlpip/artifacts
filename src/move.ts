import {delay, isArtifactError} from './utils';
import client from './client';

export async function move(characterName, x, y) {
    console.log('characterName, x, y', characterName, x, y);
    try {
        const response = await client.myCharacters.move(characterName, {x, y});
        const {data} = response;
        await delay(data.cooldown.total_seconds * 1000 + 500 || 500);

        return data;
    } catch (error) {
        console.log('Move error', characterName, error);
        if (isArtifactError(error) && error.code === 499) {
            const delaySeconds = Number(error.message.split(' ')[3]);
            console.log('Move delay');

            await delay(delaySeconds ? delaySeconds * 1000 + 500 : 5000);
            await move(characterName, x, y);
        }
    }
}
