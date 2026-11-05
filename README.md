# Flip 7 Bust Probability Calculator

A static, mobile-friendly calculator for tracking observed number cards in a physical game of Flip 7. Everything runs in your browser; no data is sent or saved. Refreshing clears the tracking data. Special cards are excluded.

Select your distinct cards under **My hand**. Use + and − to track and correct other players' cards. Unavailable copies cannot be added.

The probability is conditional on the next card being a number card: **remaining copies of numbers in your hand / all remaining number cards × 100**. Observed cards from the current and completed turns are excluded from both counts. The result is rounded to one decimal place for display. Flip 7 and an empty deck have dedicated states.

**Turn** moves all current observations into discards and clears the active hands. Those cards remain unavailable. **Reshuffle** returns only discarded cards from completed turns to the deck; current hands remain tracked.

## Run locally

No build or dependencies are required. Serve this directory with any static server, for example `python3 -m http.server 8000`, then visit `http://localhost:8000/`. Node.js is needed only for tests.

## Tests

Run `npm test` with a recent Node.js installation. No packages need to be installed.

## Publish to GitHub Pages

1. Create a GitHub repository and push these files to its default branch.
2. Open the repository on GitHub and select **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch containing the files and the **/ (root)** folder, then click **Save**.
5. Wait for deployment and open the URL shown in the Pages settings. Relative asset paths also work at a project URL such as `https://username.github.io/repository/`.
