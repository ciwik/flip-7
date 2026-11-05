# Build a Flip 7 Bust Probability Calculator

You are working in the current project workspace. Build a complete, working web application according to the requirements below. Do not just provide an implementation plan or code snippets: create all project files, implement the application, run the tests, and fix any issues.

## 1. Purpose

Build a simple probability calculator for the card game Flip 7.

During a game, the user manually tracks the number cards received by themselves and other players. Based on these observations, the application continuously calculates the probability that the user will bust if they draw another number card.

The application must be extremely simple, fast, and convenient to operate while playing a physical card game.

## 2. Technical requirements

- Pure static web application.
- Hosted using GitHub Pages.
- All calculations happen locally in the browser.
- No backend, server, database, API, authentication, or external services.
- No data transmission.
- No cookies, localStorage, sessionStorage, or other persistence. All state exists only in memory and resets when the page is refreshed.
- No external runtime dependencies, UI frameworks, CSS frameworks, or CDN resources.
- Use vanilla HTML, CSS, and JavaScript with native ES modules.
- Must work when deployed under a GitHub Pages project URL, not just at the domain root.
- Must be responsive and optimized for mobile screens.

Use a minimal project structure:

- index.html
- styles.css
- app.js
- calculator.js
- calculator.test.js
- package.json
- README.md

## 3. Number card distribution

The standard Flip 7 deck contains 79 number cards.

Use this exact initial distribution:

| Number | Initial copies |
|---|---:|
| 0 | 1 |
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
| 4 | 4 |
| 5 | 5 |
| 6 | 6 |
| 7 | 7 |
| 8 | 8 |
| 9 | 9 |
| 10 | 10 |
| 11 | 11 |
| 12 | 12 |

The total is 79 number cards.

Completely ignore all special cards, including action cards and score modifiers.

**Important:** The displayed probability must be conditional on drawing a number card. Both the numerator and denominator must exclude special cards.

## 4. User interface

Create a clean, compact interface with the following elements.

### A. My hand

Display 13 buttons, numbered 0 through 12.

- Clicking a button toggles that number on or off in my hand.
- A selected number must have a visually distinct appearance.
- My hand cannot contain duplicate numbers.
- Display the number of currently selected cards.

### B. Other players

Display another group of 13 buttons, numbered 0 through 12.

This group represents all number cards observed in other players' hands during the current turn.

- Clicking a number increases its observed count by one.
- Show the current count for each number.
- Provide a convenient way to decrement a count when correcting a mistake.
- Multiple copies of the same number are allowed.
- The combined observed number of copies must never exceed the original deck distribution.

Keep these two groups visually consistent, with clear distinctions between their interaction behavior.

### C. Probability display

Display the current probability of busting in a prominent, easily readable way.

For example:

**4.0%**

Also display useful supporting information:

- Number of remaining number cards.
- Number of remaining cards that would make me bust.

For example:

`2 bust cards / 50 remaining number cards`

The probability must update immediately whenever either group of buttons changes.

Use a large percentage display that is easy to read at a glance.

Include a clear explanatory label:

"Chance of busting if the next card is a number card."

### D. Turn button

Add a button labeled "Turn".

When clicked:

1. Move all number cards observed during the current turn into a historical count.
2. Clear my current hand.
3. Clear the other players' current hand observations.
4. Keep all observed cards unavailable in the deck.

In other words, cards discarded at the end of a turn must remain excluded from the remaining deck until a reshuffle happens.

### E. Reshuffle button

Add a button labeled "Reshuffle".

When clicked:

1. Clear all historical counts accumulated from previously completed turns.
2. Return those historical cards to the available deck.
3. Preserve all cards observed during the currently active turn.
4. Recalculate the probability immediately.

This distinction is important: cards observed during the current turn must remain unavailable even after pressing Reshuffle.

## 5. State model

Implement the application using the following logical state:

- `completedTurnCounts`: array of 13 integers representing cards observed in previously completed turns since the last reshuffle.
- `myHand`: array of 13 booleans representing which numbers I currently hold.
- `otherPlayersCounts`: array of 13 integers representing observed copies in other players' hands during the current turn.

Calculate total observed cards for each number as:

`completedTurnCounts[n] + (myHand[n] ? 1 : 0) + otherPlayersCounts[n]`

When the Turn button is pressed, add the active observations to `completedTurnCounts`, then reset `myHand` and `otherPlayersCounts`.

When Reshuffle is pressed, reset `completedTurnCounts` to thirteen zeros, without modifying `myHand` or `otherPlayersCounts`.

Do not implement these state transitions through independent UI hacks. Prefer clear, testable state-management functions.

## 6. Probability calculation

Implement the calculation as a pure function in `calculator.js`.

For each number n:

`remainingCopies[n] = initialCopies[n] - totalObserved[n]`

Total remaining number cards:

`remainingCards = sum(remainingCopies[0..12])`

Number of cards that would cause me to bust:

`bustCards = sum(remainingCopies[n] for every n in myHand)`

Probability:

`bustProbability = bustCards / remainingCards * 100`

Special cases:

- If my hand is empty, bust probability is 0%.
- If I have one number 1, bust probability is 0%, because there is only one 1 in the entire deck.
- If there are no remaining number cards, display an appropriate "No cards remaining" state rather than dividing by zero.
- If I have collected seven distinct number cards, display a "Flip 7!" / round-complete state instead of suggesting that I should hit again.
- Never allow observed counts to exceed the original number of copies in the deck.
- Never allow negative counts.

Round the displayed probability to one decimal place, but keep full precision internally.

### Required calculation examples

**Example 1**

My hand is empty.

Expected probability: 0%.

**Example 2**

My hand contains one 1. No other cards have been observed.

Expected probability: 0%.

**Example 3**

My hand contains one 3.

There are 50 remaining number cards, including two additional copies of 3.

Expected probability:

`2 / 50 * 100 = 4%`

The implementation must reproduce these results exactly.

## 7. Validation and UX

- Prevent adding more copies of a number than exist in the deck.
- Disable or otherwise clearly indicate unavailable actions.
- Make corrections easy through decrement controls.
- Use semantic HTML and accessible button labels.
- Provide visible keyboard focus states.
- Make controls sufficiently large for touchscreens.
- Keep the interface compact, without unnecessary animations, dialogs, menus, or settings.
- No page reloads when using controls.
- No external fonts, images, or libraries.
- Display a small note explaining that refreshing the page clears all tracking data.
- Make Turn and Reshuffle visually distinguishable because they have different effects.

## 8. Testing

Use Node.js built-in test runner (`node:test`) without installing dependencies.

Write unit tests covering:

1. Initial deck distribution and total of 79 cards.
2. Empty hand results in 0%.
3. Hand containing only 1 results in 0%.
4. The example with 2 bust cards among 50 remaining cards results in 4%.
5. Cards in other players' hands reduce the remaining deck.
6. Cards matching my hand also reduce the number of remaining bust cards.
7. Turn moves active observations into historical counts.
8. Turn clears both active hands.
9. Reshuffle clears historical observations.
10. Reshuffle preserves cards observed during the active turn.
11. Cannot exceed the original deck distribution.
12. Cannot produce negative card counts.
13. Seven unique cards trigger the round-complete state.
14. Zero remaining number cards do not cause division by zero.

Add an `npm test` script to package.json.

## 9. Final verification

Before finishing:

- Run all tests.
- Fix any failing tests.
- Check the UI for mobile and desktop layouts.
- Verify that native ES modules use relative file paths and work under a GitHub Pages project subdirectory.
- Verify that the application requires no build step and no runtime dependencies.
- Check that all calculations are performed entirely in the browser.

Update README.md with:
- Application overview.
- Probability formula.
- Explanation of Turn versus Reshuffle.
- How to run locally.
- How to execute tests.
- Step-by-step GitHub Pages deployment instructions.

## 10. Expected result

Deliver a finished, usable application, not a prototype or a mockup.

At the end, summarize:
- Files created.
- Main implementation decisions.
- Test results.
- Exact steps needed to publish the application to GitHub Pages.

Do not add features outside the requested scope.