import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import { resolveAssetURL } from "./assetindex";

export interface AssignableDownload {
    path: string;
    url: string;
}

/**
 * Downloads a file with its full path.
 *
 * @param download - The download info object.
 * @param root - An optional root directory to download to. Defaults to `./` (the current directory).
 * @returns A useless promise to trigger async functionality.
 */
export const downloadFile = (download: AssignableDownload, root = "./") => {
    const fullPath = path.resolve(root, download.path);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (fs.existsSync(fullPath)) fs.rmSync(fullPath);

    return new Promise<boolean>((resolve) => {
        (download.url.startsWith("https") ? https : http).get(
            download.url,
            (res) => {
                const stream = fs.createWriteStream(fullPath);

                res.pipe(stream);

                stream.on("finish", () => resolve(true));
            }
        );
    });
};

/**
 * Downloads an asset and copies it to the correct location.
 * This will also save it in the correct location such that Minecraft will find it correctly (there will be two copies).
 *
 * @param name - The asset's path in the Minecraft game data.
 * @param hash - The asset's hash for resolving the download.
 * @param root - An optional root directory to download to. Defaults to `./` (the current directory).
 * @returns A useless promise to trigger async functionality.
 */
export const downloadAsset = (name: string, hash: string, root = "./") => {
    const fullPath = path.resolve(
        root,
        "assets",
        "objects",
        hash.substring(0, 2),
        hash
    );
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (fs.existsSync(fullPath)) fs.rmSync(fullPath);

    return new Promise<boolean>((resolve) => {
        https.get(resolveAssetURL(hash), (res) => {
            const stream = fs.createWriteStream(fullPath);

            res.pipe(stream);

            stream.on("finish", () => {
                const newPath = path.resolve(root, "assets", name);
                const newDir = path.dirname(newPath);

                if (!fs.existsSync(newDir))
                    fs.mkdirSync(newDir, { recursive: true });

                if (fs.existsSync(newPath)) fs.rmSync(newPath);

                fs.copyFileSync(fullPath, newPath);

                resolve(true);
            });
        });
    });
};
