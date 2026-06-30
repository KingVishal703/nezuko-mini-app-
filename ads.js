function runHomeAd() {
  // Monetix me home interstitial nahi hai
}

function runVerifyAd() {
  // Agar verify ad nahi use karna to empty chhod do
}

function runReward(callback) {

  if (typeof window.showRewardAd !== "function") {
    alert("Reward ad load nahi hua");
    if (callback) callback(false);
    return;
  }

  window.showRewardAd(function(res) {

    console.log("Reward Result:", res);

    if (res &&
        (res.status === "completed" ||
         res.status === "closed")) {

      if (callback) callback(true);

    } else {

      if (callback) callback(false);

    }

  });

}
