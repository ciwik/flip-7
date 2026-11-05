export const INITIAL_COPIES = Object.freeze([1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
const zeros = () => Array(13).fill(0);
export const createState = () => ({ completedTurnCounts: zeros(), myHand: Array(13).fill(false), otherPlayersCounts: zeros() });
export const observed = (state, n) => state.completedTurnCounts[n] + Number(state.myHand[n]) + state.otherPlayersCounts[n];
export function toggleHand(state, n) {
  if (!Number.isInteger(n) || n < 0 || n > 12 || (!state.myHand[n] && observed(state, n) >= INITIAL_COPIES[n])) return state;
  const myHand = [...state.myHand]; myHand[n] = !myHand[n];
  return { ...state, myHand };
}
export function changeOther(state, n, delta) {
  if (!Number.isInteger(n) || n < 0 || n > 12 || ![-1, 1].includes(delta)) return state;
  if ((delta === 1 && observed(state, n) >= INITIAL_COPIES[n]) || (delta === -1 && state.otherPlayersCounts[n] === 0)) return state;
  const otherPlayersCounts = [...state.otherPlayersCounts]; otherPlayersCounts[n] += delta;
  return { ...state, otherPlayersCounts };
}
export function turn(state) {
  return { completedTurnCounts: state.completedTurnCounts.map((count, n) => count + Number(state.myHand[n]) + state.otherPlayersCounts[n]), myHand: Array(13).fill(false), otherPlayersCounts: zeros() };
}
export function reshuffle(state) { return { ...state, completedTurnCounts: zeros() }; }
export function calculate(state) {
  const remainingCopies = INITIAL_COPIES.map((count, n) => count - observed(state, n));
  const remainingCards = remainingCopies.reduce((a, b) => a + b, 0);
  const bustCards = remainingCopies.reduce((sum, count, n) => sum + (state.myHand[n] ? count : 0), 0);
  const handCount = state.myHand.filter(Boolean).length;
  return { remainingCopies, remainingCards, bustCards, handCount, bustProbability: remainingCards ? bustCards / remainingCards * 100 : null, roundComplete: handCount >= 7 };
}
