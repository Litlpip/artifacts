//Use node index.ts in the terminal for execute the script.
//Warning: Firefox does not fully support the editor. Please use a chromimum-based web browser such as Chrome, Brave or Edge.
//This script is a basic example of a player's movement. You can load other examples by clicking on "Load example".

const server = 'https://api.artifactsmmo.com';
//Your token is automatically set
const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkxpdGxwaXAiLCJwYXNzd29yZF9jaGFuZ2VkIjoiIn0.-OD_rwwKkqf-NKUNDqROgzdeeaY3-nx-Hd045gqJHX8';
//Put your character name here

const defaultCharacter = 'Litlpip';

const makeRequest = ({
    path,
    // tries = 1,
    body = undefined,
    method = 'POST',
}) => {
    const url = server + path;

    // const onError = (err)=> {
    //     const triesLeft = tries -1
    //     console.log('retry', triesLeft)
    //     if(triesLeft===0) {
    //         throw  err
    //     }
    //     return delay(500).then(()=>makeRequest({path,body,tries: triesLeft}))
    // }

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + token,
        },
        body: typeof body === 'object' ? JSON.stringify(body) : body,
    };

    return fetch(url, options);
};

export {makeRequest};
