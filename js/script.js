// ===== helpers  =====
function $(s) {
  return document.querySelector(s);
}
function $all(s) {
  return document.querySelectorAll(s);
}

/* ===== 시트 열고 닫기 ===== */
/* - 속성 제어: setAttribute/getAttribute 
   - 스크롤 제어: window.scrollTo (기본형) */
function openSheet(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.setAttribute("aria-hidden", "false");

  var dim = document.getElementById("sheetDim");
  if (dim) dim.classList.add("open");

  document.body.style.overflow = "hidden";
  window.scrollTo(0, 0);
}

function closeSheet(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.setAttribute("aria-hidden", "true");

  // 디테일/소개 영상 리셋
  var iframe = el.querySelector("iframe");
  if (iframe) {
    var src = iframe.getAttribute("src");
    iframe.setAttribute("src", src);
  }

  // 모든 시트 닫혔는지 확인
  var anyOpen = false;
  $all(".sheet").forEach(function (s) {
    if (s.getAttribute("aria-hidden") === "false") anyOpen = true;
  });
  if (!anyOpen) {
    var dim = document.getElementById("sheetDim");
    if (dim) dim.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// 첫화면 버튼
var btnPF = document.getElementById("openPF");
if (btnPF) {
  btnPF.addEventListener("click", function (e) {
    e.preventDefault();
    openSheet("pfSheet");
  });
}
var btnAbout = document.getElementById("openAbout");
if (btnAbout) {
  btnAbout.addEventListener("click", function (e) {
    e.preventDefault();
    openSheet("aboutSheet");
  });
}

// 닫기 버튼
$all(".sheet-close").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var id = btn.getAttribute("data-sheet"); // README 3.9
    if (id) closeSheet(id);
  });
});

/* ===== 딤 클릭 시 모든 시트 닫기 ===== */
var dim = document.getElementById("sheetDim");
if (dim) {
  dim.addEventListener("click", function () {
    closeSheet("pfDetail");
    closeSheet("pfSheet");
    closeSheet("aboutSheet");
  });
}

// ESC 닫기
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeSheet("pfDetail");
    closeSheet("pfSheet");
    closeSheet("aboutSheet");
  }
});

/* ===== 포트폴리오 디테일 열기 ===== */
/* - 텍스트 갱신: textContent 
   - 속성 제어: setAttribute */
function openDetail(data) {
  var yid = data.yid;
  var title = data.title || "포트폴리오";
  var desc = data.desc || "";

  var t1 = document.getElementById("detailTitle");
  if (t1) t1.textContent = title;

  var d1 = document.getElementById("detailDesc");
  if (d1) d1.textContent = desc;

  var iframe = document.getElementById("detailIframe");
  if (iframe && yid) {
    var url =
      "https://www.youtube.com/embed/" +
      yid +
      "?rel=0&modestbranding=1&playsinline=1";
    iframe.setAttribute("src", url);
  }

  var tBody = document.getElementById("detailTitleBody");
  if (tBody) tBody.textContent = title;

  openSheet("pfDetail");
}

/* ===== 카드(썸네일/보기) 클릭 위임 ===== */
/* - 이벤트 위임 + closest 
   - 속성 읽기: getAttribute  */
document.addEventListener("click", function (e) {
  var thumb = e.target.closest(".pf-card .thumb");
  var view = e.target.closest(".pf-card .view");
  if (!thumb && !view) return;
  e.preventDefault();

  var card = (thumb || view).closest(".pf-card");
  var dataEl = thumb || (card ? card.querySelector(".thumb") : null);
  if (!card || !dataEl) return;

  var yid =
    (thumb && thumb.getAttribute("data-yid")) ||
    (view && view.getAttribute("data-yid")) ||
    (dataEl && dataEl.getAttribute("data-yid"));

  if (!yid) return;

  var title =
    (thumb && thumb.getAttribute("data-title")) ||
    (view && view.getAttribute("data-title")) ||
    (card.querySelector(".title")
      ? card.querySelector(".title").textContent.replace(/^\s+|\s+$/g, "")
      : "");

  var desc =
    (thumb && thumb.getAttribute("data-desc")) ||
    (view && view.getAttribute("data-desc")) ||
    (dataEl && dataEl.getAttribute("data-desc")) ||
    "";

  openDetail({ yid: yid, title: title, desc: desc });
});
