import fetch from "node-fetch";
import { DateTime } from "luxon";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "./firebase";

// Fetch NCAA Game Data from API
async function fetchNCAAGamesFromAPI(date: string | null = null) {
    const pacificNow = DateTime.now().setZone("America/Los_Angeles");
    const targetDate = date || pacificNow.toFormat("yyyy/MM/dd"); // Format: "2024/03/10"
    const apiUrl = `https://data.ncaa.com/casablanca/scoreboard/basketball-men/d1/${targetDate}/scoreboard.json`;
    console.log(`🌍 Fetching NCAA games from for ${targetDate}: ${apiUrl}`);

    try {
        console.log("⏳ Fetching NCAA games...");
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        console.log("✅ NCAA game data retrieved:", data);
        return data;
    } catch (error) {
        console.error("❌ Error fetching NCAA games:", error);
        throw error;
    }
}

// Save Game Data to Firestore
async function saveGamesToDatabase(games: any) {
    const batch = db.batch();
    const gamesCollection = db.collection("ncaaGames");

    games.games.forEach((game: any) => {
        const gameRef = gamesCollection.doc(game.game.gameID.toString());
        let winner = null;
        if (game.game.home.winner) {
            winner = game.game.home.names.seo;
        } else if (game.game.away.winner) {
            winner = game.game.away.names.seo;
        }
        batch.set(gameRef, {
            homeTeam: game.game.home.names.seo,
            awayTeam: game.game.away.names.seo,
            homeScore: game.game.home.score,
            awayScore: game.game.away.score,
            gameDate: game.game.startDate,
            status: game.game.currentPeriod,
            winner: winner,
            lastUpdated: Timestamp.now(),
        });
    });

    await batch.commit();
    console.log("✅ NCAA games saved to Firestore.");
}

// Main Function: Fetch & Store Games
export async function updateNCAAGames(date: string | undefined | null = null) {
    if (date) {
        date = DateTime.fromISO(date).toFormat("yyyy/MM/dd");
    }
    console.log(`🔄 Updating NCAA games for date ${date}...`);
    const games = await fetchNCAAGamesFromAPI(date);
    console.log("🎉 NCAA games fetched successfully.");
    await saveGamesToDatabase(games);
    console.log("🎉 NCAA games updated successfully.");
};
