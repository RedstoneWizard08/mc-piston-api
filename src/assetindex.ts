import https from "https";
import { AssetIndex } from "./schema/AssetIndex";
import { GameVersionManifest } from "./schema/VersionInfo";

/**
 * Grabs an asset index from version metadata.
 * Requires usage of {@link getVersion | the getVersion method} to get the value for the version argument
 *
 * @example
 * Here's an example
 * ```ts
 * // Fetch the version metadata
 * const version = await getVersion("1.19.3");
 *
 * // Fetch the asset index
 * const assetIndex = await getAssetIndex(version);
 * ```
 *
 * @param version - The version metadata to grab the asset index from.
 * @returns The asset index for the version provided.
 */
export const getAssetIndex = (version: GameVersionManifest) => {
    const url = version.assetIndex.url;

    return new Promise<AssetIndex>((resolve, reject) => {
        https.get(url, (res) => {
            let data = "";

            res.on("data", (chunk) => (data += chunk));
            res.on("error", (err) => reject(err));

            res.on("end", () => {
                try {
                    resolve(JSON.parse(data) as AssetIndex);
                } catch (e) {
                    reject(e);
                }
            });
        });
    });
};

/**
 * Resolves a full asset download URL from an asset hash.
 *
 * @example
 * An example of getting this.
 * ```ts
 * // Fetch the asset index
 * const assetIndex = await getAssetIndex(version);
 *
 * // Get the asset URL
 * const assetUrl = resolveAssetURL(assetIndex.objects[Object.keys(assetIndex.objects)[0]].hash);
 * ```
 *
 * @param hash The asset's hash, found in it's object metadata in the asset index.
 * @returns The full asset URL.
 */
export const resolveAssetURL = (hash: string) => {
    return `https://resources.download.minecraft.net/${hash.substring(
        0,
        2
    )}/${hash}`;
};
