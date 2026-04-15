// CONFIG
const CONFIG = {
  dailyBonus: 5,
  adReward: 2,
  spinMin: 1,
  spinMax: 10,
  tapRewardRate: 0.2,
  withdrawMin: 50
};

// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDkdYO6sQvlLu7WRN3zfSLrzGpSzkUl0lg",
  authDomain: "nezuko-earning.firebaseapp.com",
  databaseURL: "https://nezuko-earning-default-rtdb.firebaseio.com",
  projectId: "nezuko-earning",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Telegram
const tg = window.Telegram.WebApp;
tg.expand();

let user = tg.initDataUnsafe?.user || { id: "demo_" + Date.now() };
let userId = user.id.toString();

let userRef = db.ref("users/" + userId);

// Create user
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

// Live update
userRef.on("value", snap => {
  let d = snap.val();
  document.getElementById("balance").innerText = "₹" + d.balance;
  document.getElementById("refCount").innerText = d.referrals;
});

// Tabs
function showTab(id){
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// DAILY BONUS
function claimDaily(){
  userRef.once("value").then(snap=>{
    let d = snap.val();
    let now = Date.now();

    if(now - d.lastDailyBonus < 86400000){
      alert("Already claimed");
      return;
    }

    showAd(()=>{
      userRef.update({
        balance: d.balance + CONFIG.dailyBonus,
        lastDailyBonus: now
      });
    });
  });
}

// WATCH AD
function watchAd(){
  userRef.once("value").then(snap=>{
    let d = snap.val();
    let now = Date.now();

    if(now - d.lastAdTime < 60000){
      alert("Wait 60 sec");
      return;
    }

    showAd(()=>{
      userRef.update({
        balance: d.balance + CONFIG.adReward,
        lastAdTime: now
      });
    });
  });
}

// TAP GAME
let taps = 0, playing=false;

function startTapGame(){
  taps = 0;
  playing = true;
  document.getElementById("tapTimer").innerText = "GO!!!";

  setTimeout(()=>{
    playing = false;

    let reward = Math.floor(taps * CONFIG.tapRewardRate);

    showAd(()=>{
      userRef.once("value").then(snap=>{
        let d = snap.val();
        userRef.update({ balance: d.balance + reward });
      });
    });

    document.getElementById("tapScore").innerText = "Earned ₹"+reward;

  },10000);
}

function tapClick(){
  if(playing) taps++;
}

// SPIN
function spin(){
  let wheel = document.getElementById("wheel");
  let deg = Math.floor(Math.random()*3600);

  wheel.style.transform = `rotate(${deg}deg)`;

  let reward = Math.floor(Math.random()*(CONFIG.spinMax-CONFIG.spinMin+1))+CONFIG.spinMin;

  showAd(()=>{
    userRef.once("value").then(snap=>{
      let d = snap.val();
      userRef.update({ balance: d.balance + reward });
    });
  });

  document.getElementById("spinResult").innerText = "Won ₹"+reward;
}

// SCRATCH
let canvas = document.getElementById("scratch");
let ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 100;

function startScratch(){
  ctx.fillStyle="gray";
  ctx.fillRect(0,0,300,100);

  let reward = Math.floor(Math.random()*5)+1;

  canvas.onmousemove = (e)=>{
    ctx.clearRect(e.offsetX,e.offsetY,20,20);
  };

  canvas.onclick = ()=>{
    showAd(()=>{
      userRef.once("value").then(snap=>{
        let d = snap.val();
        userRef.update({ balance: d.balance + reward });
      });
    });

    document.getElementById("scratchResult").innerText="Won ₹"+reward;
  };
}

// REFER
let url = new URL(window.location);
let ref = url.searchParams.get("ref");

if(ref && ref!==userId){
  db.ref("users/"+ref).once("value").then(snap=>{
    if(snap.exists()){
      db.ref("users/"+ref).update({
        referrals: (snap.val().referrals||0)+1
      });
    }
  });
}

document.getElementById("refLink").innerText =
  location.origin + "?ref=" + userId;

// WITHDRAW
function withdraw(){
  let upi = document.getElementById("upi").value;

  userRef.once("value").then(snap=>{
    let d = snap.val();

    if(d.balance < CONFIG.withdrawMin){
      alert("Minimum not reached");
      return;
    }

    db.ref("withdraws").push({
      userId,
      upi,
      amount:d.balance,
      time:Date.now()
    });

    userRef.update({ balance:0 });
  });
}
