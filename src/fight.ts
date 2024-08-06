import {makeRequest} from './makeRequest';
import {depositAllAndBack} from './deposit.ts';

export async function doFight(characterName) {
    let myData;
    let myJsonResponse;
    try {
        const response = await makeRequest({path: '/my/' + characterName + '/action/fight'});
        const jsonResponse = await response.json();
        myJsonResponse = jsonResponse;
        myData = jsonResponse.data;
        if (myJsonResponse?.error && myJsonResponse.error.code === 497) {
            console.log('status 497');
            await depositAllAndBack(characterName);
        }
    } catch (error) {
        console.error('DoGathering error', error, myJsonResponse?.status);
    } finally {
        setTimeout(() => doFight(characterName), myData?.cooldown?.total_seconds * 1000 + 500 || 5000);
    }
}
