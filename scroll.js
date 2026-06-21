// PC 전용 원스크롤 (1280px 이상)
(function () {
  var BREAKPOINT = 1280;
  var SECTION_IDS = ['hero', 'about', 'sub-projects', 'projects', 'skills', 'career', 'contact'];
  var CAREER_IDX = SECTION_IDS.indexOf('career');
  var activeIdx = 0;
  var busy = false;
  var BUSY_MS = 1000;
  var lastWheelTime = 0;
  var busyTimer = null;

  function isDesktop() { return window.innerWidth >= BREAKPOINT; }

  function getSections() {
    return SECTION_IDS.map(function (id) { return document.getElementById(id); }).filter(Boolean);
  }

  function navH() {
    var nav = document.querySelector('.nav');
    return nav ? nav.offsetHeight : 70;
  }

  function clearBusy() { busy = false; busyTimer = null; }

  function goTo(idx) {
    var secs = getSections();
    if (idx < 0 || idx >= secs.length) return;
    // 커리어로 이동할 때 내부 스크롤 맨 위로 초기화
    if (idx === CAREER_IDX && secs[CAREER_IDX]) {
      secs[CAREER_IDX].scrollTop = 0;
    }
    activeIdx = idx;
    busy = true;
    clearTimeout(busyTimer);
    var top = secs[idx].getBoundingClientRect().top + window.scrollY - navH();
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    busyTimer = setTimeout(clearBusy, BUSY_MS);
  }

  function refreshIdx() {
    if (busy) return;
    var secs = getSections();
    var nh = navH();
    activeIdx = 0;
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].getBoundingClientRect().top - nh <= window.innerHeight * 0.5) activeIdx = i;
    }
  }

  function onWheel(e) {
    if (!isDesktop()) return;

    // 모달(프로젝트 상세 팝업)이 열려 있으면 원스크롤 가로채기 중단 → 내부 스크롤 허용
    if (document.querySelector('.modal-backdrop')) return;

    var secs = getSections();

    // ── 커리어 섹션 ──────────────────────────────────────────
    if (activeIdx === CAREER_IDX) {
      var careerEl = secs[CAREER_IDX];
      if (careerEl) {
        var atTop    = careerEl.scrollTop <= 1;
        var atBottom = careerEl.scrollTop + careerEl.clientHeight >= careerEl.scrollHeight - 4;

        // 항상 window 스크롤은 막고, career 내부를 직접 조작
        e.preventDefault();

        if ((e.deltaY > 0 && atBottom) || (e.deltaY < 0 && atTop)) {
          // 커리어 끝 → 다음/이전 섹션으로 이동
          if (!busy) {
            var now = Date.now();
            if (now - lastWheelTime >= 100 && Math.abs(e.deltaY) >= 30) {
              lastWheelTime = now;
              goTo(e.deltaY > 0 ? activeIdx + 1 : activeIdx - 1);
            }
          }
        } else {
          // 커리어 내부 스크롤 직접 제어
          careerEl.scrollTop += e.deltaY;
        }
        return;
      }
    }

    // ── 일반 섹션: 원스크롤 ──────────────────────────────────
    e.preventDefault();
    if (busy) return;
    var now = Date.now();
    if (now - lastWheelTime < 100) return;
    if (Math.abs(e.deltaY) < 30) return;
    lastWheelTime = now;
    if (e.deltaY > 0) goTo(activeIdx + 1);
    else              goTo(activeIdx - 1);
  }

  function onKeyDown(e) {
    if (!isDesktop()) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    // 모달이 열려 있으면 키보드 이동도 중단
    if (document.querySelector('.modal-backdrop')) return;
    if (busy) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(activeIdx + 1); }
    if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { e.preventDefault(); goTo(activeIdx - 1); }
  }

  function onScrollEnd() {
    if (busy) { clearTimeout(busyTimer); clearBusy(); refreshIdx(); }
  }

  function interceptAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (!isDesktop()) return;
        var idx = SECTION_IDS.indexOf(link.getAttribute('href').slice(1));
        if (idx >= 0) { e.preventDefault(); goTo(idx); }
      });
    });
  }

  // React 비동기 렌더링 완료 대기
  function waitForContent() {
    if (document.querySelector('a[href^="#"]')) { refreshIdx(); interceptAnchors(); return; }
    var obs = new MutationObserver(function () {
      if (document.querySelector('a[href^="#"]')) {
        obs.disconnect();
        refreshIdx();
        interceptAnchors();
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  document.addEventListener('DOMContentLoaded', waitForContent);
  window.addEventListener('wheel',     onWheel,     { passive: false });
  window.addEventListener('keydown',   onKeyDown);
  window.addEventListener('scroll',    refreshIdx,  { passive: true });
  window.addEventListener('scrollend', onScrollEnd, { passive: true });
})();
