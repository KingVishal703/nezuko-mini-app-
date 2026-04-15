const SUB={
anime:["All","Series","Movies","OVA"],
movies:["All","Hollywood","Bollywood","Tollywood"],
adult:["All","Desi", "Web Series","English","Cosplay","Hentai","Animation","Japanese","Chinese"]
};

let DB=[];
let current=[];
let activeCategory="anime";
let activeSub="All";

fetch("data.json")
.then(r=>r.json())
.then(d=>{
DB=d;
startApp();
});

function startApp(){
loadCategory("anime",document.querySelector(".tabs button"));
runSlider();
}

/* SEARCH */

function searchContent(){
let q=document.getElementById("search").value.toLowerCase();
let result=DB.filter(x=>x.title.toLowerCase().includes(q));
render(result);
}

/* CATEGORY */

function loadCategory(cat,btn){
activeCategory=cat;
activeSub="All";

document.querySelectorAll(".tabs button").forEach(b=>b.classList.remove("active"));
btn.classList.add("active");

renderSubTabs();
filterData();
runSlider();
}

function renderSubTabs(){
let html="";
SUB[activeCategory].forEach(name=>{
html+=`<button onclick="setSub('${name}',this)" ${name==="All"?'class="active"':''}>${name}</button>`;
});
subtabs.innerHTML=html;
}

function setSub(name,btn){
activeSub=name;
document.querySelectorAll(".subtabs button").forEach(b=>b.classList.remove("active"));
btn.classList.add("active");
filterData();
}

function filterData(){
current=DB.filter(x=>{
return x.category===activeCategory &&
(activeSub==="All" || x.sub===activeSub);
});
render(current);
}

/* GRID */

function render(list){
if(!list.length){
grid.innerHTML=`<h3 style="padding:20px;color:#777">No content</h3>`;
return;
}

let html="";
list.forEach((item,i)=>{
html+=`
<div class="card">
<img src="${item.image}" onclick="openDetails(${i})">
<h3>${item.title}</h3>
<div class="button" onclick="verify('${encodeURIComponent(item.token)}')">Watch Now</div>
</div>`;
});
grid.innerHTML=html;
}

/* DETAILS */

function openDetails(i){
let d=current[i];

details.innerHTML=`
<div class="modal-box">

<div class="topbar">
<div class="topbtn" onclick="closeDetails()">← Back</div>
</div>

<img src="${d.image}">

<h2 style="padding:10px">${d.title}</h2>

<p style="padding:0 10px">🌐 Season - ${d.season||"-"}</p>
<p style="padding:0 10px">📀 Episodes - ${d.episodes||"-"}</p>
<p style="padding:0 10px">⭐ Quality - ${d.quality||"-"}</p>
<p style="padding:0 10px">🎧 Language - ${d.language||"-"}</p>
<p style="padding:0 10px">⚡ Genre - ${d.genre||"-"}</p>

<div class="button" onclick="verify('${encodeURIComponent(d.token)}')">
Watch Now
</div>

</div>
`;

details.style.display="block";
}

function closeDetails(){
details.style.display="none";
}

function verify(link){
window.location="verify.html?link="+link;
}

/* SLIDER */

function runSlider(){
let slider=document.getElementById("slider");

let trending=DB.filter(x=>x.category===activeCategory).slice(0,5);
if(!trending.length) return;

let i=0;

function show(){
let item=trending[i];

slider.innerHTML=`
<div class="slide" style="background-image:url('${item.image}')">

<div class="slide-overlay">
<div class="slide-title">${item.title}</div>
<div class="slide-btn" onclick="openDetails(${i})">Watch Now</div>
</div>

</div>`;
}

show();

clearInterval(window.sliderInt);
window.sliderInt=setInterval(()=>{
i=(i+1)%trending.length;
show();
},3000);
}
