import { getLatestSnapshotVersion, downloadMinecraft } from ".";

const main = async () => {
    await downloadMinecraft(await getLatestSnapshotVersion(), "./minecraft");
};

main();
