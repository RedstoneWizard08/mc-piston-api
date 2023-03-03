import os from "os";
import { LibraryDownload } from "./VersionInfo";

export const getOSName = () => {
    switch (process.platform) {
        case "win32":
        case "cygwin":
            return "windows";

        case "darwin":
            return "osx";

        case "linux":
        case "android":
            return "linux";

        default:
            throw new ReferenceError("Unknown platform!");
    }
};

export const getArch = () => {
    switch (process.arch) {
        case "arm":
        case "arm64":
            return "arm";

        case "ia32":
        case "x64":
            return "x86";

        default:
            throw new ReferenceError("Unknown architecture!");
    }
};

export const shouldDownload = (download: LibraryDownload) => {
    let shouldDownload = true;

    for (const rule of download.rules || []) {
        if (rule.os) {
            if (rule.os.name && shouldDownload)
                shouldDownload = rule.os.name == getOSName();

            if (rule.os.version && shouldDownload)
                shouldDownload = new RegExp(rule.os.version).test(os.version());

            if (rule.os.arch && shouldDownload)
                shouldDownload = rule.os.arch == getArch();
        }
    }

    return shouldDownload;
};
