import {makeRequest} from './makeRequest';
import client from './client';

export const getCharacter = async (char) => {
    try {
        const {data} = await client.characters.get(char);
        return data;
    } catch (err) {
        console.error('getCharacter error');
        throw err;
    }
};
