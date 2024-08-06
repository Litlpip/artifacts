import {ArtifactsApi} from 'artifacts-api-client';

const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkxpdGxwaXAiLCJwYXNzd29yZF9jaGFuZ2VkIjoiIn0.-OD_rwwKkqf-NKUNDqROgzdeeaY3-nx-Hd045gqJHX8';

const artifactsApi = ArtifactsApi.create({
    token,
});

export default artifactsApi;
