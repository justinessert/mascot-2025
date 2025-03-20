import { db } from "./firebase";

export async function addChampToLeaderboard(year: number) {
    year = year ? year : new Date().getFullYear();
    console.log(`📅 Updating published brackets for year: ${year}`);

    const leaderboardRef = db.collection(`leaderboard/${year}/data`);
    const leaderboardSnapshot = await leaderboardRef.get();

    if (leaderboardSnapshot.empty) {
        console.log("⚠️ No published brackets found.");
        throw new Error("No published brackets found");
    }

    const batch = db.batch();

    for (const doc of leaderboardSnapshot.docs) {
        const bracketId = doc.data().bracketId;
        const bracketRef = db.collection("brackets").doc(`${year}`).collection(bracketId).doc("data");
        const bracketSnapshot = await bracketRef.get();

        if (!bracketSnapshot.exists) {
            console.warn(`⚠️ Bracket ${bracketId} not found in brackets collection.`);
            continue;
        }

        const bracketData = bracketSnapshot.data();
        const finalFour = bracketData?.bracket?.final_four?.bracket;

        // Ensure finalFour is an array before accessing its last element
        const champion = finalFour['2'][0] // Get the last element's first team

        console.log(`🏆 Updating bracket ${bracketId} with champion: ${champion}`);
        batch.update(doc.ref, { champion });
    }

    await batch.commit();
    console.log("✅ Successfully updated all published brackets with champions.");
}