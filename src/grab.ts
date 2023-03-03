import path from "path";
import { getAssetIndex } from "./assetindex";
import { downloadAsset, downloadFile } from "./download";
import { AssetObject } from "./schema/AssetIndex";
import { shouldDownload } from "./schema/checks";
import { LibraryArtifact } from "./schema/VersionInfo";
import { getVersion } from "./version";

/**
 * Downloads a Minecraft version and all of its assets.
 *
 * @example
 * Downloading Minecraft 1.19.3.
 * ```ts
 * // Import the functions
 * import { downloadMinecraft } from "mc-piston-api";
 *
 * // Download Minecraft!
 * await downloadMinecraft("1.19.3", "./minecraft");
 * ```
 *
 * @param versionId - The Minecraft version to download.
 * @param root - An optional root directory to download to. Defaults to `./` (the current directory).
 */
export const downloadMinecraft = async (versionId: string, root = "./") => {
    console.log("Fetching version info...");

    const version = await getVersion(versionId);

    console.log("Fetching asset index...");

    const assetIndex = await getAssetIndex(version);

    const libraries: (LibraryArtifact & { name: string })[] = [];
    const assets: (AssetObject & { name: string })[] = [];

    console.log("Building download indexes...");

    for (const jar of version.libraries) {
        if (shouldDownload(jar))
            libraries.push({ ...jar.downloads.artifact, name: jar.name });
    }

    for (const assetName of Object.keys(assetIndex.objects)) {
        assets.push({ ...assetIndex.objects[assetName], name: assetName });
    }

    console.log(`[1/3] [1/2] Downloading: client-${version.id}.jar...`);

    await downloadFile({
        url: version.downloads.client.url,
        path: path.resolve(
            `${root || "./"}/versions/${version.id}/client-${version.id}.jar`
        ),
    });

    console.log(`[1/3] [2/2] Downloading: server-${version.id}.jar...`);

    await downloadFile({
        url: version.downloads.server.url,
        path: path.resolve(
            `${root || "./"}/versions/${version.id}/server-${version.id}.jar`
        ),
    });

    for (let i = 0; i < libraries.length; i++) {
        const library = libraries[i];
        console.log(
            `[2/3] [${i + 1} / ${libraries.length}] Downloading library: ${
                library.name
            }`
        );

        await downloadFile(library, `${root || "./"}/libraries`);
    }

    for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];

        console.log(
            `[3/3] [${i + 1} / ${assets.length}] Downloading asset: ${
                asset.name
            }`
        );

        await downloadAsset(asset.name, asset.hash, root || "./");
    }
};
