import { INITIAL_COPIES, createState, observed, toggleHand, changeOther, turn, reshuffle, calculate } from './calculator.js';

let state = createState();
const hand = document.querySelector('#hand');
const others = document.querySelector('#others');
for (let n = 0; n < 13; n++) {
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'number'; button.textContent = n;
  button.addEventListener('click', () => { state = toggleHand(state, n); render(); });
  hand.append(button);
  const item = document.createElement('div'); item.className = 'counter';
  const value = document.createElement('span'); value.className = 'counter-number'; value.textContent = n;
  const controls = document.createElement('div'); controls.className = 'counter-controls';
  const minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '−'; minus.setAttribute('aria-label', `Remove one ${n} from other players`);
  const count = document.createElement('span'); count.className = 'count';
  const plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+'; plus.setAttribute('aria-label', `Add one ${n} to other players`);
  minus.addEventListener('click', () => { state = changeOther(state, n, -1); render(); });
  plus.addEventListener('click', () => { state = changeOther(state, n, 1); render(); });
  controls.append(minus, count, plus); item.append(value, controls); others.append(item);
}
document.querySelector('#turn').addEventListener('click', () => { state = turn(state); render(); });
document.querySelector('#reshuffle').addEventListener('click', () => { state = reshuffle(state); render(); });
function render() {
  const result = calculate(state);
  document.querySelector('#probability').textContent = result.roundComplete ? 'Flip 7!' : result.remainingCards === 0 ? 'No cards remaining' : `${result.bustProbability.toFixed(1)}%`;
  document.querySelector('#probability').classList.toggle('message', result.roundComplete || result.remainingCards === 0);
  document.querySelector('#remaining').textContent = `${result.bustCards} bust cards / ${result.remainingCards} remaining number cards`;
  document.querySelector('#hand-count').textContent = `${result.handCount} ${result.handCount === 1 ? 'card' : 'cards'}`;
  [...hand.children].forEach((button, n) => {
    button.setAttribute('aria-pressed', state.myHand[n]);
    button.setAttribute('aria-label', `${n}, ${state.myHand[n] ? 'in your hand' : 'add to your hand'}`);
    button.disabled = !state.myHand[n] && observed(state, n) >= INITIAL_COPIES[n];
  });
  [...others.children].forEach((item, n) => {
    const [minus, count, plus] = item.querySelector('.counter-controls').children;
    count.textContent = state.otherPlayersCounts[n]; count.setAttribute('aria-label', `${state.otherPlayersCounts[n]} observed`);
    minus.disabled = state.otherPlayersCounts[n] === 0;
    plus.disabled = observed(state, n) >= INITIAL_COPIES[n];
    item.classList.toggle('has-cards', state.otherPlayersCounts[n] > 0);
  });
  document.querySelector('#turn').disabled = result.handCount === 0 && state.otherPlayersCounts.every(n => n === 0);
  document.querySelector('#reshuffle').disabled = state.completedTurnCounts.every(n => n === 0);
}
render();
