import https from "https";
import { GameVersionManifest } from "./schema/VersionInfo";
import { getVersions } from "./versions";

/**
 * Gets the metadata for a specific version of Minecraft.
 *
 * @param version - The version to get the metadata for.
 * @returns The version metadata.
 */
export const getVersion = async (version: string) => {
    const all = await getVersions();
    const it = all.versions.find((item) => item.id == version);
    const url = it?.url;

    return new Promise<GameVersionManifest>((resolve, reject) => {
        if (!url) return reject("Could not find a URL!");

        https.get(url, (res) => {
            let data = "";

            res.on("data", (chunk) => (data += chunk));
            res.on("error", (err) => reject(err));

            res.on("end", () => {
                try {
                    resolve(JSON.parse(data) as GameVersionManifest);
                } catch (e) {
                    reject(e);
                }
            });
        });
    });
};

/**
 * Gets the latest release of Minecraft.
 *
 * @returns The latest release of Minecraft.
 */
export const getLatestVersion = async () => {
    const all = await getVersions();

    return all.latest.release;
};

/**
 * Gets the latest snapshot of Minecraft.
 *
 * @returns The latest snapshot of Minecraft.
 */
export const getLatestSnapshotVersion = async () => {
    const all = await getVersions();

    return all.latest.snapshot;
};
