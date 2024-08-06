import {depositAllAndBack} from './deposit.ts';
import client from './client';
import {delay, isArtifactError} from './utils';

// export async function doGathering(characterName) {
//     let myData;
//     try {
//         myData = await client.myCharacters.gathering(characterName);
//     } catch (error) {
//         console.error('DoGathering error', error);
//         if (isArtifactError(error) && error.code === 497) {
//             console.log('status 497');
//             await depositAllAndBack(characterName);
//         }
//     }
//     await delay(myData?.cooldown?.total_seconds * 1000 + 500 || 5000);
//     doGathering(characterName);
// }
