import {artifactsApi} from '../consts';
import {ArtifactsMapData, MapCode} from '../types';

export class MapService {
    constructor(list: ArtifactsMapData[]) {
        list.forEach((item) => {
            const code = item.content.code as MapCode;
            const instance = new ArtifactMap(item);

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this.cache.get(code)
                ? this.cache.set(code, [...this.cache.get(code), instance])
                : this.cache.set(code, [instance]);
        });
    }

    private cache = new Map<MapCode, ArtifactMap[]>();

    static async create() {
        const list: ArtifactsMapData[] = [];
        try {
            const res = await artifactsApi.maps.getAll({
                size: 100,
                page: 1,
            });
            res.data.filter((item) => item.content).forEach((item) => list.push(item));
            if (res.pages > 1) {
                for (let i = 2; i <= res.pages; i++) {
                    const {data} = await artifactsApi.maps.getAll({
                        size: 100,
                        page: i,
                    });

                    data.filter((item) => item.content).forEach((item) => list.push(item));
                }
            }
        } catch (err) {
            console.log('err', err);
        }

        return new MapService(list);
    }

    public get(code: MapCode): ArtifactMap[] {
        return <ArtifactMap[]>this.cache.get(code);
    }
}

export class ArtifactMap {
    constructor({content, x, y, name, skin}: ArtifactsMapData) {
        this.type = content.type;
        this.code = content.code;
        this.x = x;
        this.y = y;
        this.name = name;
        this.skin = skin;
    }

    readonly type: string;
    readonly code: string;
    readonly x: number;
    readonly y: number;
    readonly name: string;
    readonly skin: string;
}
