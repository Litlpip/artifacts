import {CharacterName} from './types';
import {ArtifactsApi} from 'artifacts-api-client';

export const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkxpdGxwaXAiLCJwYXNzd29yZF9jaGFuZ2VkIjoiIn0.-OD_rwwKkqf-NKUNDqROgzdeeaY3-nx-Hd045gqJHX8';

export const characterNames: CharacterName[] = ['Litlpip', 'man1', 'man2', 'man3', 'man4'];
export const artifactsApi = ArtifactsApi.create({
    token,
});

export const contentTypeList = ['monster', 'resource', 'workshop', 'bank', 'grand_exchange', 'tasks_master'];
