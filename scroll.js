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
    // 섹션 상단을 화면 맨 위(top:0)에 맞춘다 — 100vh 섹션이 뷰포트를 꽉 채우고
    // 반투명 고정 네비가 그 위에 겹쳐지도록 (네비 높이만큼 내리지 않음)
    var top = secs[idx].getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    busyTimer = setTimeout(clearBusy, BUSY_MS);
  }

  function refreshIdx() {
    if (busy) return;
    var secs = getSections();
    if (secs.length === 0) return;
    var nh = navH();
    var line = nh + (window.innerHeight - nh) / 2; // 네비 아래 뷰포트의 중앙선
    var idx = 0;
    var found = false;
    // 중앙선을 포함하는 섹션이 현재 섹션 (섹션 높이가 들쭉날쭉해도 견고)
    for (var i = 0; i < secs.length; i++) {
      var r = secs[i].getBoundingClientRect();
      if (r.top <= line && r.bottom > line) { idx = i; found = true; break; }
    }
    // 포함 섹션이 없으면(렌더 직후 등) 네비선을 지난 마지막 섹션으로 폴백
    if (!found) {
      for (var j = 0; j < secs.length; j++) {
        if (secs[j].getBoundingClientRect().top <= nh + 1) idx = j;
      }
    }
    activeIdx = idx;
  }

  function onWheel(e) {
    if (!isDesktop()) return;

    // 모달(프로젝트 상세 팝업)이 열려 있으면 원스크롤 가로채기 중단 → 내부 스크롤 허용
    if (document.querySelector('.modal-backdrop')) return;

    var secs = getSections();

    // 콘텐츠가 아직 렌더되지 않았으면 가로채지 않고 네이티브 스크롤 허용
    // (처음 로드 시 휠을 막아버려 스크롤이 멈추는 문제 방지)
    if (secs.length === 0) return;

    // 휠을 굴리는 시점엔 레이아웃이 올바르므로 현재 위치로 activeIdx 재동기화
    // (React 비동기 마운트 중 잘못 잡힌 activeIdx로 첫 스크롤이 먹통되는 문제 방지)
    refreshIdx();

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
    refreshIdx(); // 현재 위치로 동기화 후 이동
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(activeIdx + 1); }
    if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { e.preventDefault(); goTo(activeIdx - 1); }
  }

  function onScrollEnd() {
    if (busy) { clearTimeout(busyTimer); clearBusy(); refreshIdx(); }
  }

  // 앵커 클릭 처리: document에 이벤트 위임으로 한 번만 등록한다.
  // (개별 <a>에 붙이면 React 리렌더 시 노드 교체로 리스너가 사라져,
  //  메뉴 클릭이 네이티브 #앵커 점프로 떨어지며 휠 스크롤과 위치가 어긋난다)
  function onAnchorClick(e) {
    if (!isDesktop()) return;
    var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!link) return;
    var idx = SECTION_IDS.indexOf(link.getAttribute('href').slice(1));
    if (idx >= 0) { e.preventDefault(); goTo(idx); }
  }

  // React 비동기 렌더링 완료 대기 — 첫 콘텐츠가 나타나면 위치만 동기화
  function waitForContent() {
    if (document.querySelector('a[href^="#"]')) { refreshIdx(); return; }
    var obs = new MutationObserver(function () {
      if (document.querySelector('a[href^="#"]')) {
        obs.disconnect();
        refreshIdx();
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  document.addEventListener('DOMContentLoaded', waitForContent);
  document.addEventListener('click',   onAnchorClick);
  window.addEventListener('wheel',     onWheel,     { passive: false });
  window.addEventListener('keydown',   onKeyDown);
  window.addEventListener('scroll',    refreshIdx,  { passive: true });
  window.addEventListener('scrollend', onScrollEnd, { passive: true });
})();
