import {ArtifactsError} from 'artifacts-api-client';

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const isArtifactError = (err) => err instanceof ArtifactsError;
