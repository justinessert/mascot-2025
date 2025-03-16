import { DateTime } from "luxon";
import { transformTeamName } from "./utils";
import { roundOrders } from "./constants";
import { db } from "./firebase";


// 🎯 **Calculate Score for a Single Bracket**
function calculateBracketScore(bracket: any, gameMappings: any, ncaaGameResults: any): number {
    let totalScore = 0;

    for (const [region, rounds] of Object.entries(gameMappings)) {
        if (!bracket.bracketData.bracket[region]) {
            throw new Error(`Missing bracket data for region: ${region} in bracket ${bracket}`);
        }

        for (const [roundKey, gameIds] of Object.entries(rounds as Record<string, string[]>)) {
            const roundNumber = parseInt(roundKey.split("_")[1]); // Extracts the round number
            let pointsPerWin = 10 * Math.pow(2, roundNumber - 1); // Doubles each round
            pointsPerWin = region === "final_four" ? pointsPerWin * 16 : pointsPerWin;
            const userRoundOrder = roundOrders[roundNumber];

            for (let i = 0; i < gameIds.length; i++) {
                const gameId = gameIds[i];
                if (!gameId || !ncaaGameResults[gameId]) continue; // Skip if no game mapping or game data

                const correctWinner = ncaaGameResults[gameId].winner;
                const userGameIdx = userRoundOrder[i]
                const userSelection = bracket.bracketData.bracket[region]["bracket"][roundNumber]?.[userGameIdx];
                const userSelectionTransform = transformTeamName(userSelection["name"]);

                if (userSelectionTransform === correctWinner) {
                    totalScore += pointsPerWin;
                }
            }
        }
    }

    return totalScore;
}

// 🎯 **Update Published Bracket Scores**
export async function updateScores(year: string | number | null = null) {
    year = year || DateTime.now().year;

    console.log(`📅 Updating bracket scores for year: ${year}`);

    // **Step 1: Get Published Brackets**
    const publishedBracketsRef = db.collection(`leaderboard`).doc(`${year}`).collection("data");
    const publishedBracketsSnapshot = await publishedBracketsRef.get();

    if (publishedBracketsSnapshot.empty) {
        console.warn(`⚠️ No published brackets found for year ${year}.`);
        return;
    }

    // **Step 2: Fetch each bracket's data**
    const publishedBrackets = await Promise.all(
        publishedBracketsSnapshot.docs.map(async (doc) => {
            const bracket = { id: doc.id, ...doc.data() };

            if (!("bracketId" in bracket)) {
                console.warn(`⚠️ Skipping bracket ${doc.id} due to missing bracketId.`);
                return null;
            }

            // Fetch the full bracket from Firestore
            const bracketRef = db.collection("brackets").doc(`${year}`).collection(String(bracket.bracketId)).doc("data");
            const bracketSnapshot = await bracketRef.get();

            if (!bracketSnapshot.exists) {
                console.warn(`⚠️ Bracket data missing for bracket ID: ${bracket.bracketId}`);
                return { ...bracket, bracketData: null };
            }

            return { ...bracket, bracketData: bracketSnapshot.data() };
        })
    );

    console.log(`📌 Found ${publishedBrackets.length} published brackets.`);

    // **Step 3: Get Game Mappings**
    const gameMappingsRef = db.collection("gameMappings").doc(year.toString());
    const gameMappingsSnapshot = await gameMappingsRef.get();
    if (!gameMappingsSnapshot.exists) {
        console.error(`❌ No game mappings found for year ${year}`);
        return;
    }
    const gameMappings = gameMappingsSnapshot.data();
    console.log("📌 Game mappings retrieved:", gameMappings);

    // **Step 4: Get NCAA Game Results**
    const ncaaGamesRef = db.collection("ncaaGames");
    // const ncaaGameResults: Record<string, any> = await ncaaGamesRef.get();
    const ncaaGamesSnapshot = await ncaaGamesRef.get();
    const ncaaGameResults: Record<string, any> = {};
    ncaaGamesSnapshot.forEach(doc => {
        ncaaGameResults[doc.id] = doc.data();
    });

    console.log(`📌 Retrieved ${Object.keys(ncaaGameResults).length} NCAA games.`);

    // **Step 5: Score & Update Each Published Bracket**
    const updatePromises = publishedBrackets.map(async bracket => {
        const score = calculateBracketScore(bracket, gameMappings, ncaaGameResults);
        console.log(`🏆 Bracket ${bracket!.id} - New Score: ${score}`);

        return publishedBracketsRef.doc(bracket!.id).update({ score });
    });

    await Promise.all(updatePromises);
    console.log("✅ All brackets updated successfully!");
}
