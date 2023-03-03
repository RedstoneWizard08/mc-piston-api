export interface AssetObject {
    hash: string;
    size: number;
}

export interface AssetIndex {
    objects: {
        [key: string]: AssetObject;
    };
}
