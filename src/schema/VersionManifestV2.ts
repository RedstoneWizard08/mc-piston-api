export type VersionType = "release" | "snapshot" | "old_beta" | "old_alpha";

export interface VersionInfo {
    id: string;
    type: VersionType;
    url: string;
    time: string;
    releaseTime: string;
    sha1: string;
    complianceLevel: 0 | 1;
}

export interface VersionManifestV2 {
    latest: {
        release: string;
        snapshot: string;
    };

    versions: VersionInfo[];
}
