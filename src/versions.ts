import https from "https";
import { VersionManifestV2 } from "./schema/VersionManifestV2";

/**
 * Gets all the officially available versions of Minecraft.
 *
 * @returns The versions manifest.
 */
export const getVersions = () => {
    return new Promise<VersionManifestV2>((resolve, reject) => {
        https.get(
            "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json",
            (res) => {
                let data = "";

                res.on("data", (chunk) => (data += chunk));
                res.on("error", (err) => reject(err));

                res.on("end", () => {
                    try {
                        resolve(JSON.parse(data) as VersionManifestV2);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        );
    });
};
