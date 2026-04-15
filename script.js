// CONFIG
const CONFIG = {
  daily: 5,
  ad: 2,
  spinMin: 1,
  spinMax: 10,
  tapRate: 0.2,
  withdrawMin: 50
};

// FIREBASE
firebase.initializeApp({
  apiKey: "AIzaSyDkdYO6sQvlLu7WRN3zfSLrzGpSzkUl0lg",
  databaseURL: "https://nezuko-earning-default-rtdb.firebaseio.com"
});
const db = firebase.database();

// TELEGRAM USER
const tg = Telegram.WebApp;
tg.expand();

let user = tg.initDataUnsafe?.user || { id: "demo_" + Date.now() };
let uid = user.id.toString();
let ref = db.ref("users/" + uid);

// CREATE USER SAFE
ref.once("value").then(s => {
  if (!s.exists()) {
    ref.set({
      balance: 0,
      lastDaily: 0,
      lastAd: 0,
      refs: 0
    });
  }
});

// LIVE UPDATE
ref.on("value", s => {
  let d = s.val();
  balance.innerText = "₹" + d.balance;
  refs.innerText = d.refs;
});

// TABS
function tab(id){
  ["tasks","games","refer","wallet"].forEach(x=>{
    document.getElementById(x).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

// ADSGRAM READY
function showAd(cb){
  // 👉 paste Adsgram code here
  console.log("Ad...");
  setTimeout(()=>cb(),2000);
}

// DAILY
function daily(){
  ref.once("value").then(s=>{
    let d=s.val();
    let now=Date.now();

    if(now-d.lastDaily<86400000) return alert("Already");

    showAd(()=>{
      ref.update({
        balance:d.balance+CONFIG.daily,
        lastDaily:now
      });
    });
  });
}

// WATCH AD
function watchAd(){
  ref.once("value").then(s=>{
    let d=s.val();
    let now=Date.now();

    if(now-d.lastAd<60000) return alert("Wait");

    showAd(()=>{
      ref.update({
        balance:d.balance+CONFIG.ad,
        lastAd:now
      });
    });
  });
}

// TAP GAME
let taps=0,playing=false;

function startTap(){
  taps=0;
  playing=true;

  setTimeout(()=>{
    playing=false;

    let earn=Math.floor(taps*CONFIG.tapRate);

    showAd(()=>{
      ref.once("value").then(s=>{
        ref.update({balance:s.val().balance+earn});
      });
    });

    tapResult.innerText="Earn ₹"+earn;

  },10000);
}

tapBtn.onclick=()=>{
  if(playing) taps++;
};

// SPIN
function spin(){
  let deg=Math.random()*3600;
  wheel.style.transform=`rotate(${deg}deg)`;

  let reward=Math.floor(Math.random()*(CONFIG.spinMax-CONFIG.spinMin+1))+CONFIG.spinMin;

  showAd(()=>{
    ref.once("value").then(s=>{
      ref.update({balance:s.val().balance+reward});
    });
  });

  spinRes.innerText="Won ₹"+reward;
}

// SCRATCH
let canvas=document.getElementById("scratch");
let ctx=canvas.getContext("2d");

canvas.width=300;
canvas.height=100;

function scratchStart(){
  ctx.fillStyle="gray";
  ctx.fillRect(0,0,300,100);

  let reward=Math.floor(Math.random()*5)+1;

  canvas.onmousemove=(e)=>{
    ctx.clearRect(e.offsetX,e.offsetY,20,20);
  };

  canvas.onclick=()=>{
    showAd(()=>{
      ref.once("value").then(s=>{
        ref.update({balance:s.val().balance+reward});
      });
    });

    scratchRes.innerText="Won ₹"+reward;
  };
}

// REFER
let url=new URL(location);
let r=url.searchParams.get("ref");

if(r && r!==uid){
  db.ref("users/"+r).once("value").then(s=>{
    if(s.exists()){
      db.ref("users/"+r).update({
        refs:(s.val().refs||0)+1
      });
    }
  });
}

refLink.innerText=location.origin+"?ref="+uid;

// WITHDRAW
function withdraw(){
  let upi=document.getElementById("upi").value;

  ref.once("value").then(s=>{
    let d=s.val();

    if(d.balance<CONFIG.withdrawMin) return alert("Min not reached");

    db.ref("withdraws").push({
      uid,upi,amount:d.balance,time:Date.now()
    });

    ref.update({balance:0});
  });
}
