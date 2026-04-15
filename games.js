function tapGame() {
  addMoney(CONFIG.earnings.gameReward);
  alert("You earned ₹" + CONFIG.earnings.gameReward);
}

function spinWheel() {
  let win = Math.floor(Math.random() * (CONFIG.earnings.spinMax - CONFIG.earnings.spinMin)) + CONFIG.earnings.spinMin;
  addMoney(win);
  alert("🎉 You won ₹" + win);
}

function scratchCard() {
  let win = Math.random() < 0.5 ? 0 : 5;
  addMoney(win);
  alert("Scratch reward ₹" + win);
}
