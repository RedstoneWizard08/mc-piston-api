export type RuleFeature = "is_demo_user" | "has_custom_resolution" | string;

export type OS = "osx" | "windows" | "linux" | "x86" | "^10\\." | string;

export type RuleOS = "name" | "version" | "arch" | string;

export interface Rule {
    action: "allow";
    features?: {
        [key: RuleFeature]: boolean;
    };
    os?: {
        name?: OS;
        version?: OS;
        arch?: OS;

        [key: RuleOS]: OS | undefined;
    };
}

export type RestrictedGameArgument =
    | "--demo"
    | "--width"
    | "--height"
    | "${resolution_width}"
    | "${resolution_height}";

export interface RestrictiveGameArgument {
    rules: Rule[];
    value: RestrictedGameArgument | RestrictedGameArgument[];
}

export type GameArgument =
    | "--username"
    | "--version"
    | "--gameDir"
    | "--assetsDir"
    | "--uuid"
    | "--assetIndex"
    | "--accessToken"
    | "--clientId"
    | "--xuid"
    | "--userType"
    | "--versionType"
    | "${auth_player_name}"
    | "${version_name}"
    | "${game_directory}"
    | "${assets_root}"
    | "${assets_index_name}"
    | "${auth_uuid}"
    | "${auth_access_token}"
    | "${clientid}"
    | "${auth_xuid}"
    | "${user_type}"
    | "${version_type}"
    | RestrictiveGameArgument
    | string;

export type RestrictedJvmArgument =
    | "-XstartOnFirstThread"
    | "-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump"
    | "-Dos.name=Windows 10"
    | "-Dos.version=10.0"
    | "-Xss1M"
    | string;

export interface RestrictiveJvmArgument {
    rules: Rule[];
    value: RestrictedJvmArgument | RestrictedJvmArgument[];
}

export type JvmArgument =
    | "-cp"
    | "-Djava.library.path=${natives_directory}"
    | "-Dminecraft.launcher.brand=${launcher_name}"
    | "-Dminecraft.launcher.version=${launcher_version}"
    | "${classpath}"
    | RestrictiveJvmArgument
    | string;

export interface FileDownload {
    sha1: string;
    size: number;
    url: string;
}

export interface LibraryArtifact {
    path: string;
    sha1: string;
    size: number;
    url: string;
}

export interface LibraryDownload {
    downloads: {
        artifact: LibraryArtifact;
    };

    name: string;

    rules?: Rule[];
}

export interface LoggingOptions {
    argument: "-Dlog4j.configurationFile=${path}" | string;

    file: {
        id: string;
        sha1: string;
        size: number;
        url: string;
    };

    type: "log4j2-xml" | string;
}

export interface GameVersionManifest {
    arguments: {
        game: GameArgument[];
        jvm: JvmArgument[];
    };

    assetIndex: {
        id: string;
        sha1: string;
        size: number;
        totalSize: number;
        url: string;
    };

    assets: string;
    complianceLevel: number;

    downloads: {
        client: FileDownload;
        client_mappings: FileDownload;
        server: FileDownload;
        server_mappings: FileDownload;
    };

    id: string;

    javaVersion: {
        component: "java-runtime-gamma" | string;
        majorVersion: number;
    };

    libraries: LibraryDownload[];

    logging: {
        client: LoggingOptions;
    };

    mainClass: string;
    minimumLauncherVersion: number;
    releaseTime: string;
    time: string;
    type: "release" | "snapshot" | "old_beta" | "old_alpha";
}
