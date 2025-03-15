import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { DateTime } from "luxon";
import { updateNCAAGames } from "./games";
import { manualUpdateGameMappings } from "./mapping";
import { updateScores } from "./scoring";

export const manualUpdateNCAAGames = onRequest(async (req, res) => {

    try {
        const date = req.query.date as string
        updateNCAAGames(date);

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
    await updateScores();
});

export const updateGameMappings = onRequest(async (req, res) => {
    try {
        const { year, newMappings } = req.body; // Get data from request body

        if (!year || newMappings === undefined) {
            res.status(400).json({ error: "Missing required parameters" });
            return
        }

        await manualUpdateGameMappings(year, newMappings);

        res.status(200).json({ message: "Game mapping updated successfully" });
    } catch (error) {
        console.error("❌ Error in updateGameMappings:", error);
        res.status(500).json({ error: "Failed to update game mappings" });
    }
});

// 🎯 **Update Published Bracket Scores**
export const updateBracketScores = onRequest(async (req, res) => {
    try {
        const year = req.query.year ? parseInt(req.query.year as string) : DateTime.now().year;

        updateScores(year)

        res.status(200).json({ message: "Bracket scores updated successfully!" });

    } catch (error) {
        console.error("❌ Error updating bracket scores:", error);
        res.status(500).json({ error: "Failed to update bracket scores" });
    }
});
