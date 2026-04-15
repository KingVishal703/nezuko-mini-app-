// CONFIG
const CONFIG = {
  dailyBonus: 5,
  adReward: 2,
  spinMin: 1,
  spinMax: 10,
  tapRewardRate: 0.2,
  withdrawMin: 50
};

// Firebase Init
const firebaseConfig = {
  apiKey: "AIzaSyDkdYO6sQvlLu7WRN3zfSLrzGpSzkUl0lg",
  authDomain: "nezuko-earning.firebaseapp.com",
  databaseURL: "https://nezuko-earning-default-rtdb.firebaseio.com",
  projectId: "nezuko-earning",
  storageBucket: "nezuko-earning.appspot.com",
  messagingSenderId: "941091730977",
  appId: "1:941091730977:web:931e928cacac8eada49560"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Telegram User
const tg = window.Telegram.WebApp;
tg.expand();

let user = tg.initDataUnsafe?.user || { id: "demo_" + Date.now() };
let userId = user.id.toString();

let userRef = db.ref("users/" + userId);

// Create User
userRef.once("value").then(snap => {
  if (!snap.exists()) {
    userRef.set({
      balance: 0,
      lastDailyBonus: 0,
      lastAdTime: 0,
      referrals: 0
    });
  }
});

// Live Sync
userRef.on("value", snap => {
  let data = snap.val();
  document.getElementById("balance").innerText = "₹" + data.balance;
  document.getElementById("refCount").innerText = data.referrals;
});

// Tabs
function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Daily Bonus
function claimDaily() {
  userRef.once("value").then(snap => {
    let data = snap.val();
    let now = Date.now();

    if (now - data.lastDailyBonus < 86400000) {
      alert("Already claimed");
      return;
    }

    userRef.update({
      balance: data.balance + CONFIG.dailyBonus,
      lastDailyBonus: now
    });
  });
}

// Ads
function showAd(callback) {
  setTimeout(callback, 2000);
}

function watchAd() {
  userRef.once("value").then(snap => {
    let data = snap.val();
    let now = Date.now();

    if (now - data.lastAdTime < 60000) {
      alert("Wait");
      return;
    }

    showAd(() => {
      userRef.update({
        balance: data.balance + CONFIG.adReward,
        lastAdTime: now
      });
    });
  });
}

// Tap Game
let taps = 0;
function startTapGame() {
  taps = 0;
  document.body.onclick = () => taps++;

  setTimeout(() => {
    document.body.onclick = null;
    let reward = Math.floor(taps * CONFIG.tapRewardRate);

    userRef.once("value").then(snap => {
      let data = snap.val();
      userRef.update({ balance: data.balance + reward });
    });

    document.getElementById("tapScore").innerText = "Earned ₹" + reward;
  }, 10000);
}

// Spin
function spin() {
  let reward = Math.floor(Math.random() * (CONFIG.spinMax - CONFIG.spinMin + 1)) + CONFIG.spinMin;

  userRef.once("value").then(snap => {
    let data = snap.val();
    userRef.update({ balance: data.balance + reward });
  });

  document.getElementById("spinResult").innerText = "Won ₹" + reward;
}

// Scratch
let canvas = document.getElementById("scratch");
let ctx = canvas.getContext("2d");
canvas.width = 300;
canvas.height = 100;

ctx.fillStyle = "gray";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let scratching = false;
canvas.onmousedown = () => scratching = true;
canvas.onmouseup = () => scratching = false;

canvas.onmousemove = (e) => {
  if (!scratching) return;
  ctx.clearRect(e.offsetX, e.offsetY, 20, 20);
};

canvas.onclick = () => {
  let reward = Math.floor(Math.random() * 5) + 1;

  userRef.once("value").then(snap => {
    let data = snap.val();
    userRef.update({ balance: data.balance + reward });
  });

  document.getElementById("scratchResult").innerText = "Won ₹" + reward;
};

// Referral
let url = new URL(window.location);
let ref = url.searchParams.get("ref");

if (ref && ref !== userId) {
  let refRef = db.ref("users/" + ref);
  refRef.once("value").then(snap => {
    if (snap.exists()) {
      refRef.update({
        referrals: (snap.val().referrals || 0) + 1
      });
    }
  });
}

document.getElementById("refLink").innerText =
  location.origin + "?ref=" + userId;

// Withdraw
function withdraw() {
  let upi = document.getElementById("upi").value;

  userRef.once("value").then(snap => {
    let data = snap.val();

    if (data.balance < CONFIG.withdrawMin) {
      alert("Minimum not reached");
      return;
    }

    db.ref("withdraws").push({
      userId,
      upi,
      amount: data.balance,
      time: Date.now()
    });

    userRef.update({ balance: 0 });
  });
        }
