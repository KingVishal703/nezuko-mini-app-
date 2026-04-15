const ADS = {
homeInterstitial:true,
verifyInterstitial:true,
reward:true,
autoInterval:600000
};

const IDS = {
home:"int-22046",
verify:"int-22056",
reward:"22055"
};

let homeAd=null;
let verifyAd=null;
let rewardAd=null;

function waitForAdsgram(callback){
let timer=setInterval(()=>{
if(window.Adsgram){
clearInterval(timer);
callback();
}
},300);
}

function initAds(){

function safe(id){
try{
return window.Adsgram.init({blockId:id});
}catch(e){
console.log("Ad init error:",id,e);
return null;
}
}

homeAd = safe(IDS.home);
verifyAd = safe(IDS.verify);
rewardAd = safe(IDS.reward);

console.log("Ads ready");
}

waitForAdsgram(initAds);

function runHomeAd(){
if(homeAd) homeAd.show().catch(()=>{});
}

function runVerifyAd(){
if(verifyAd) verifyAd.show().catch(()=>{});
}

function runReward(callback){
if(!rewardAd){callback();return;}

rewardAd.show()
.then(()=>callback())
.catch(()=>callback());
}

function startAutoHomeAds(){
setInterval(()=>{
runHomeAd();
},ADS.autoInterval);
}
