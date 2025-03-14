import * as functions from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import {onSchedule} from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import {Response} from "express";
import {DateTime} from "luxon";
import { Timestamp } from "firebase-admin/firestore";


admin.initializeApp();
const db = admin.firestore();

// Fetch NCAA Game Data from API
async function fetchNCAAGamesFromAPI(date: string | null = null) {
  const pacificNow = DateTime.now().setZone("America/Los_Angeles");
  const targetDate = date || pacificNow.toFormat("yyyy/MM/dd"); // Format: "2024/03/10"
  const apiUrl = `https://data.ncaa.com/casablanca/scoreboard/basketball-men/d1/${targetDate}/scoreboard.json`;
  console.log(`🌍 Fetching NCAA games from: ${apiUrl}`);

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
    batch.set(gameRef, {
      homeTeam: game.game.home.names.seo,
      awayTeam: game.game.away.names.seo,
      homeScore: game.game.home.score,
      awayScore: game.game.away.score,
      gameDate: game.game.startDate,
      status: game.game.currentPeriod,
      lastUpdated: Timestamp.now(),
    });
  });

  await batch.commit();
  console.log("✅ NCAA games saved to Firestore.");
}

// Main Function: Fetch & Store Games
export const updateNCAAGames = async (req?: functions.https.Request, res?: Response) => {
  try {
    console.log("🔄 Updating NCAA games...");
    const games = await fetchNCAAGamesFromAPI();
    console.log("🎉 NCAA games fetched successfully.");
    await saveGamesToDatabase(games);
    console.log("🎉 NCAA games updated successfully.");

    if (res) res.status(200).send("✅ NCAA games updated.");
  } catch (error) {
    console.error("🚨 NCAA game update failed:", error);
    if (res) res.status(500).send("Error updating NCAA games.");
  }
};

export const manualUpdateNCAAGames = onRequest(async (req, res) => {
  
    try {
      // Log the incoming request query
  
      let dateParam = req.query.date as string | undefined;
      if (dateParam) {
        dateParam = DateTime.fromISO(dateParam).toFormat("yyyy/MM/dd");
      }

      // Log before fetching
      console.log("⏳ [manualUpdateNCAAGames] Fetching NCAA games...");
      const games = await fetchNCAAGamesFromAPI(dateParam);
  
      console.log("💾 [manualUpdateNCAAGames] Saving NCAA games to Firestore...");
      await saveGamesToDatabase(games);
      console.log("✅ [manualUpdateNCAAGames] Games saved successfully!");
  
      res.status(200).json({ message: "Games updated successfully", data: games });
  
      // Log final message to confirm function completion
      console.log("🏁 [manualUpdateNCAAGames] Finished execution successfully.");
    } catch (error) {
      console.error("❌ [manualUpdateNCAAGames] Error updating games:", error);
      res.status(500).json({ error: "Failed to fetch NCAA games", details: error });
    }
  });
  

// Scheduled Automatic Update (Every 15 minutes)
export const scheduledUpdateNCAAGames = onSchedule("every 15 minutes", async () => {
  await updateNCAAGames();
});
