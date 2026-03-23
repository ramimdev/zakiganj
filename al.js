
// Scroll Down Logo Show/Hide Script
//------------------------------
let lastScrollY = window.scrollY;

window.addEventListener("scroll", function () {
  const logoItem = document.getElementById("logoItem");
  const currentScrollY = window.scrollY;

  if (window.innerWidth > 768 && currentScrollY > lastScrollY && currentScrollY > 150) {
    logoItem.style.display = "flex";
    logoItem.style.alignItems = "center";
    logoItem.classList.add("show-logo");
  } else {
    logoItem.classList.remove("show-logo");
    logoItem.style.display = "none";
  }

  lastScrollY = currentScrollY;
});
//------------------------------


// Bangla, English & Hijri Date Auto Display Script
//------------------------------
function convertToBanglaNumber(number){
  const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return number.toString().split('').map(d => banglaDigits[d] || d).join('');
}

function isLeapYear(year){
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getBanglaDate(gDate){

  const banglaMonths = [
    "বৈশাখ","জৈষ্ঠ","আষাঢ়","শ্রাবণ",
    "ভাদ্র","আশ্বিন","কার্তিক","অগ্রহায়ণ",
    "পৌষ","মাঘ","ফাল্গুন","চৈত্র"
  ];

  let monthDays = [31,31,31,31,31,30,30,30,30,30,30];

  const year = gDate.getFullYear();
  const start = new Date(year,3,14);

  let banglaYear;
  let diffDays;

  if(gDate >= start){
    banglaYear = year - 593;
    diffDays = Math.floor((gDate - start)/(1000*60*60*24));
  } else {
    banglaYear = year - 594;
    const prevStart = new Date(year-1,3,14);
    diffDays = Math.floor((gDate - prevStart)/(1000*60*60*24));
  }

  if(isLeapYear(year)){
    monthDays[11] = 31;
  }

  let monthIndex = 0;
  while(monthIndex < 12 && diffDays >= monthDays[monthIndex]){
    diffDays -= monthDays[monthIndex];
    monthIndex++;
  }

  const day = convertToBanglaNumber(diffDays + 1);
  const month = banglaMonths[monthIndex] || "";
  const yearBn = convertToBanglaNumber(banglaYear);

  return day + " " + month + " " + yearBn;
}

function getHijriBangla(gDate){

  const hijriMonthsBn = [
    "মুহাররম","সফর","রবিউল আউয়াল","রবিউস সানি",
    "জমাদিউল আউয়াল","জমাদিউস সানি",
    "রজব","শাবান","রমজান","শাওয়াল",
    "জিলকদ","জিলহজ"
  ];

  const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic',{
    day:'numeric',
    month:'numeric',
    year:'numeric'
  });

  const parts = hijriFormatter.formatToParts(gDate);

  let day, month, year;
  parts.forEach(p=>{
    if(p.type==="day") day = p.value;
    if(p.type==="month") month = p.value;
    if(p.type==="year") year = p.value;
  });

  return convertToBanglaNumber(day) + " " +
         hijriMonthsBn[month-1] + " " +
         convertToBanglaNumber(year) + " হিজরি";
}

function updateNewsDate(){

  const now = new Date();

  const banglaWeek = now.toLocaleDateString('bn-BD',{weekday:'long'});
  const banglaFull = banglaWeek + ", " + getBanglaDate(now);

  const english = now.toLocaleDateString('en-US',{
    month:'long',
    day:'numeric',
    year:'numeric'
  });

  const hijriBangla = getHijriBangla(now);

  document.getElementById("newsContent").innerHTML =
    banglaFull + " | " + english + " | " + hijriBangla;
}

updateNewsDate();
setInterval(updateNewsDate, 3600000);
//------------------------------


// Active Category Highlight & Auto Scroll Script
//------------------------------
document.addEventListener("DOMContentLoaded", () => {

  const container = document.querySelector(".categories-container");
  if (!container) return;

  const currentPath = location.pathname;

  const activeItem = [...container.children].find(item => {
    const link = item.querySelector("a");
    return link && new URL(link.href).pathname === currentPath;
  });

  if (activeItem) {
    container.querySelector(".active")?.classList.remove("active");
    activeItem.classList.add("active");

    container.scrollLeft =
      activeItem.offsetLeft -
      (container.offsetWidth - activeItem.offsetWidth) / 2;
  }

  container.onclick = e => {
    const item = e.target.closest(".category");
    if (!item) return;

    container.querySelector(".active")?.classList.remove("active");
    item.classList.add("active");
  };

});
//------------------------------


// Scroll Direction Based Hide/Show Categories Script
//------------------------------
document.addEventListener("DOMContentLoaded", function () {

  let lastScrollTop = 0;
  const categories = document.getElementById("categoriesSection");

  if (!categories) return;

  window.addEventListener("scroll", function () {

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 80) {
      // Scroll Down
      categories.classList.add("hide");
    } else {
      // Scroll Up
      categories.classList.remove("hide");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

});
//------------------------------


// Text-to-Speech (TTS) Player with Progress & Settings Script
//------------------------------
document.addEventListener("DOMContentLoaded",function(){

const synth = window.speechSynthesis;
let voices=[], utterance=null, timer=null;

/* Elements */
const playBtn=ttsPlay, timeEl=ttsTime, progEl=ttsProgress,
seek=ttsSeek, menu=ttsMenu, popup=ttsPopup,
vol=ttsVol, pitch=ttsPitch, rate=ttsRate, gender=ttsGender;

/* Storage */
const postId=location.pathname;
const POS_KEY="tts_pos_"+postId;
const PERC_KEY="tts_percent_"+postId;

/* Load saved settings */
vol.value=localStorage.getItem("tts_vol")||1;
pitch.value=localStorage.getItem("tts_pitch")||1;
rate.value=localStorage.getItem("tts_rate")||1;
gender.value=localStorage.getItem("tts_gender")||"auto";
progEl.textContent="শোনা হয়েছে: "+(localStorage.getItem(PERC_KEY)||0)+"%";

/* Save settings */
[vol,pitch,rate,gender].forEach(e=>{
  e.onchange=()=>{
    localStorage.setItem("tts_vol",vol.value);
    localStorage.setItem("tts_pitch",pitch.value);
    localStorage.setItem("tts_rate",rate.value);
    localStorage.setItem("tts_gender",gender.value);
    if(synth.speaking){synth.cancel();playBtn.click();}
  }
});

/* Voices */
function loadVoices(){voices=synth.getVoices();}
loadVoices(); speechSynthesis.onvoiceschanged=loadVoices;

/* Google Bengali Female force */
function pickVoice(){
  return voices.find(v=>/google/i.test(v.name)&&/bn/i.test(v.lang)&&/female|bangla|bengali/i.test(v.name))
  || voices.find(v=>/bn/i.test(v.lang))
  || (gender.value==="female"&&voices.find(v=>/google/i.test(v.name)&&/female/i.test(v.name)))
  || voices[0];
}

/* Helpers */
function splitText(t){
  return t.split(/([।.!?])/g).reduce((a,v,i,r)=>{
    if(i%2===0&&v.trim())a.push((v+(r[i+1]||"")).trim());
    return a;
  },[]);
}
const fmt=t=>Math.floor(t/60)+":"+String(t%60).padStart(2,"0");

/* Playback */
let chunks=[],i=0,elapsed=0,total=0;

function speak(){
  if(i>=chunks.length){
    localStorage.removeItem(POS_KEY);
    localStorage.setItem(PERC_KEY,100);
    progEl.textContent="শোনা হয়েছে: 100%";
    playBtn.textContent="▶";
    return;
  }
  localStorage.setItem(POS_KEY,i);
  let p=Math.floor((i/chunks.length)*100);
  localStorage.setItem(PERC_KEY,p);
  progEl.textContent="শোনা হয়েছে: "+p+"%";

  utterance=new SpeechSynthesisUtterance(chunks[i]);
  utterance.voice=pickVoice();
  utterance.volume=vol.value;
  utterance.pitch=pitch.value;
  utterance.rate=rate.value;
  utterance.onend=()=>{i++;speak();}
  synth.speak(utterance);
}

playBtn.onclick=()=>{
  if(synth.speaking){synth.cancel();clearInterval(timer);playBtn.textContent="▶";return;}
  const body=document.querySelector("#post-body"); if(!body)return;
  chunks=splitText(body.innerText.trim());
  i=parseInt(localStorage.getItem(POS_KEY))||0;
  total=Math.ceil(body.innerText.split(/\s+/).length/130*60);
  elapsed=Math.floor((i/chunks.length)*total);
  timeEl.textContent=fmt(elapsed)+" / "+fmt(total);
  timer=setInterval(()=>{
    elapsed++; timeEl.textContent=fmt(elapsed)+" / "+fmt(total);
    seek.value=(elapsed/total)*100;
  },1000);
  playBtn.textContent="⏸";
  speak();
};

menu.onclick=()=>popup.classList.toggle("ttsHide");

});
//------------------------------

// Blogger Label Posts Fetch & Display Script
//------------------------------
$(function(){

  const noImg = 'https://via.placeholder.com/800x500?text=No+Image';

  $('.modern-label-box').each(function(){

    const box = $(this),
          labelRaw = box.data('label'),
          label = encodeURIComponent(labelRaw),
          feed = `/feeds/posts/full/-/${label}?alt=json-in-script&max-results=5&callback=?`;

    $.getJSON(feed,function(data){

      const posts = data.feed.entry || [];
      if(!posts.length) return;

      let html = '';

      $.each(posts,function(i,p){

        const title = p.title.$t,
              link  = p.link.find(l=>l.rel=='alternate').href;

        let img = noImg;
        if(p.media$thumbnail){
          img = p.media$thumbnail.url.replace(/\/s72.*?\//,'/s800/');
        }else if(p.content && p.content.$t.match(/<img.*?src="(.*?)"/)){
          img = RegExp.$1;
        }

        if(i === 0){
          html += `
            <a href="${link}">
              <div class="modern-thumb" style="background-image:url('${img}')"></div>
            </a>
            <a class="modern-main-title" href="${link}">${title}</a>
            <div class="modern-list">
          `;
        }else{
          html += `<a href="${link}">${title}</a>`;
        }

      });

      html += `</div>`;
      box.find('.modern-label-posts').html(html);

    });

  });
});
//------------------------------


// Back to Top Button Show/Hide & Scroll Script
//------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("back_to_top");
  if (!btn) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      btn.classList.add("on");
    } else {
      btn.classList.remove("on");
    }
  });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
//------------------------------
