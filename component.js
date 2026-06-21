window.__buildComponent = function (DCLogic) {
  class Component extends DCLogic {
    constructor(props) {
      super(props);
      this.setRoot           = (el) => { this._root     = el; };
      this.setFollower       = (el) => { this._follower = el; };
      this.setDot            = (el) => { this._dot      = el; };
      this.setProjectsSwiper = (el) => { this._swiperEl = el; };
      this.setModalSwiper    = (el) => {
        this._modalSwiperEl = el;
        if (el) {
          requestAnimationFrame(() => this._initModalSwiper());
        } else if (this._modalSwiper) {
          this._modalSwiper.destroy(true, true);
          this._modalSwiper = null;
        }
      };
      this.CLOSE_DELAY = 260;
      this.state = { activeId: null, closing: false, activeTab: 0 };
      this._swiper = null;
      this._modalSwiper = null;
      this._lastTab = 0;
      this._m = { tx: 0, ty: 0, x: 0, y: 0, dx: 0, dy: 0 };

      this.SUB_PROJECTS = [
        { id: 101, title: "커피샵 브랜딩", category: "브랜딩", year: "'22", icon: "☕",
          color: "#FFE4EE", rotate: -2,
          grad: "linear-gradient(135deg,#FFB3CC,#FF7FA8)",
          role: "Brand Designer · 로고, 컬러 시스템, 굿즈",
          summary: "로컬 카페의 브랜드 아이덴티티 디자인 및 굿즈 제작",
          problem: "브랜드가 없어 주변 경쟁 카페 사이에서 인지도가 낮았습니다.",
          approach: ["컨셉 인터뷰 및 무드보드 작성", "로고·타이포그래피·컬러 시스템 정의", "컵홀더·명함·패키지 굿즈 디자인 3종"],
          results: [{ value: "+40%", label: "재방문율" }, { value: "3종", label: "굿즈 출시" }, { value: "★4.9", label: "브랜드 평가" }],
          tags: ["브랜딩", "로고"] },
        { id: 102, title: "명상 앱 UI", category: "모바일", year: "'22", icon: "🧘",
          color: "#FFD6E8", rotate: 1.5,
          grad: "linear-gradient(135deg,#FFD1E0,#FFA6C4)",
          role: "UI Designer · 화면 설계, 인터랙션",
          summary: "마음챙김 명상 앱의 고요하고 직관적인 UI 설계",
          problem: "기존 명상 앱들이 복잡한 UI로 사용자 집중을 방해했습니다.",
          approach: ["사용자 심층 인터뷰 8명 진행", "미니멀한 온보딩과 세션 플로우 재설계", "편안한 컬러·타이포 시스템 정의"],
          results: [{ value: "-52%", label: "UI 요소 수" }, { value: "+38%", label: "세션 완료율" }, { value: "92%", label: "만족도" }],
          tags: ["UI", "웰니스"] },
        { id: 103, title: "레시피 큐레이션", category: "웹", year: "'23", icon: "🍳",
          color: "#FFDDE8", rotate: -1,
          grad: "linear-gradient(135deg,#FFC9DD,#FF8FB3)",
          role: "UX/UI Designer · 정보구조, UI",
          summary: "AI 기반 레시피 추천 서비스 인터페이스 디자인",
          problem: "방대한 레시피가 나열만 되어 있어 원하는 것을 찾기 어려웠습니다.",
          approach: ["AI 추천 알고리즘 기반 큐레이션 플로우 설계", "재료 기반 필터 UX 개선", "반응형 카드 레이아웃 시스템 구축"],
          results: [{ value: "+44%", label: "탐색 완료율" }, { value: "-30%", label: "검색 시간" }, { value: "2.1배", label: "재방문" }],
          tags: ["UX", "AI"] },
      ];

      const g = (a, b) => `linear-gradient(135deg,${a},${b})`;
      this.TAB_LABELS = ["UX/UI 디자인", "SI/BEM/BAS", "실내 디자인", "제품·패키지"];
      this.TAB_PROJECTS = [
        [
          { id:1001, title:"모바일 앱 UX 리뉴얼",      category:"UX/UI", year:"'24", icon:"📱",  grad:g("#FFB3CC","#FF7FA8"), role:"UX/UI Designer · 리서치, 프로토타이핑",  summary:"모바일 앱 전반의 UX를 재설계한 프로젝트입니다.",         problem:"복잡한 네비게이션으로 이탈률이 높았습니다.",          approach:["사용자 인터뷰 진행","화면 흐름 간소화","프로토타입 테스트"],          results:[{value:"+30%",label:"전환율"},{value:"-25%",label:"이탈률"},{value:"4.5★",label:"평점"}],     tags:["UX","모바일"] },
          { id:1002, title:"웹 대시보드 UI 설계",      category:"UX/UI", year:"'24", icon:"💻",  grad:g("#FFD1E0","#FFA6C4"), role:"UI Designer · 정보구조, UI",            summary:"데이터 기반 대시보드 UI 설계 프로젝트입니다.",         problem:"복잡한 데이터를 한눈에 파악하기 어려웠습니다.",       approach:["정보 위계 재설계","차트 컴포넌트 표준화","사용성 테스트"],          results:[{value:"+40%",label:"업무효율"},{value:"-35%",label:"조회시간"},{value:"92%",label:"만족도"}],  tags:["UI","대시보드"] },
          { id:1003, title:"관리자 페이지 리디자인",   category:"UX/UI", year:"'23", icon:"🖥️", grad:g("#FFC9DD","#FF8FB3"), role:"UX/UI Designer · 어드민 UX",           summary:"내부 관리자 페이지 전면 리디자인 프로젝트입니다.",     problem:"사용 빈도 높은 기능이 숨겨져 비효율이 발생했습니다.", approach:["워크플로우 분석","핵심 기능 우선 배치","반응형 레이아웃 적용"],     results:[{value:"-40%",label:"작업시간"},{value:"+22%",label:"처리량"},{value:"88%",label:"만족도"}],   tags:["어드민","리디자인"] },
          { id:1004, title:"전환율 최적화",            category:"UX/UI", year:"'23", icon:"🎯",  grad:g("#FFB3CC","#FF9EC0"), role:"UX/UI Designer · A/B 테스트",          summary:"A/B 테스트 기반 전환율 최적화를 진행했습니다.",       problem:"랜딩 페이지 이탈률이 높고 전환이 낮았습니다.",       approach:["히트맵 분석","A/B 테스트 설계","CTA 최적화"],              results:[{value:"+38%",label:"전환율"},{value:"-30%",label:"이탈률"},{value:"+25%",label:"매출"}],      tags:["CRO","A/B테스트"] },
          { id:1005, title:"검색 UX 최적화",           category:"UX/UI", year:"'23", icon:"🔍",  grad:g("#FFD1E0","#FFB3CC"), role:"UX Designer · 검색 UX",                summary:"검색 기능 UX를 전반적으로 개선했습니다.",             problem:"검색 결과와 필터가 복잡해 원하는 결과를 찾기 어려웠습니다.", approach:["검색 로그 분석","자동완성 도입","필터 UX 간소화"],        results:[{value:"+42%",label:"검색 완료율"},{value:"-38%",label:"재검색률"},{value:"+19%",label:"전환율"}], tags:["검색","필터"] },
          { id:1006, title:"디자인 가이드라인 수립",   category:"UX/UI", year:"'22", icon:"🖌️", grad:g("#FFC9DD","#FFA6C4"), role:"UI Designer · 디자인 시스템",           summary:"제품 전반의 디자인 가이드라인을 수립했습니다.",       problem:"시각적 일관성이 부족해 브랜드 혼선이 있었습니다.",   approach:["컬러·타이포 시스템 정의","컴포넌트 가이드 문서화","팀 교육"],        results:[{value:"120+",label:"컴포넌트"},{value:"5팀",label:"적용"},{value:"✓",label:"일관성 확보"}],    tags:["가이드라인","시스템"] },
          { id:1007, title:"사용성 테스트 및 개선",    category:"UX/UI", year:"'22", icon:"✏️",  grad:g("#FFB3CC","#FF7FA8"), role:"UX Researcher · 리서치",               summary:"사용성 테스트를 통해 핵심 문제점을 발굴·개선했습니다.", problem:"실제 사용자의 불편 포인트를 정확히 파악하지 못했습니다.", approach:["모더레이티드 테스트 10명","문제점 우선순위화","빠른 개선 적용"], results:[{value:"15개",label:"문제 발굴"},{value:"+28%",label:"태스크 성공률"},{value:"4.4★",label:"만족도"}], tags:["리서치","테스트"] },
          { id:1008, title:"데이터 시각화 대시보드",   category:"UX/UI", year:"'22", icon:"📊",  grad:g("#FFD1E0","#FFA6C4"), role:"UI Designer · 데이터 시각화",           summary:"복잡한 통계 데이터를 직관적으로 시각화했습니다.",     problem:"원시 데이터만 나열되어 인사이트 도출이 어려웠습니다.", approach:["데이터 유형 분류","차트 유형 선정","인터랙티브 필터 추가"],      results:[{value:"-55%",label:"분석 시간"},{value:"+44%",label:"의사결정 속도"},{value:"95%",label:"만족도"}], tags:["데이터","시각화"] },
          { id:1009, title:"UI 컴포넌트 라이브러리",   category:"UX/UI", year:"'21", icon:"🎨",  grad:g("#FFC9DD","#FF8FB3"), role:"UI Designer · 컴포넌트",               summary:"재사용 가능한 UI 컴포넌트 라이브러리를 구축했습니다.", problem:"페이지마다 중복 컴포넌트 작업이 많았습니다.",         approach:["공통 컴포넌트 추출","Figma 라이브러리 구성","개발팀과 토큰 동기화"], results:[{value:"-60%",label:"작업 시간"},{value:"80+",label:"컴포넌트"},{value:"12팀",label:"사용"}],     tags:["컴포넌트","라이브러리"] },
          { id:1010, title:"와이어프레임 시스템",       category:"UX/UI", year:"'21", icon:"📐",  grad:g("#FFB3CC","#FF9EC0"), role:"UX Designer · 시스템",                 summary:"팀 전체가 공유하는 와이어프레임 시스템을 구축했습니다.", problem:"팀마다 다른 방식으로 와이어프레임을 작성해 혼선이 있었습니다.", approach:["와이어프레임 키트 제작","문서화 및 가이드 배포","팀 온보딩 워크숍"], results:[{value:"-50%",label:"산출물 시간"},{value:"8팀",label:"도입"},{value:"100%",label:"통일성"}],  tags:["와이어프레임","시스템"] },
        ],
        [
          { id:2001, title:"기업 SI 시스템 UI",        category:"SI",  year:"'24", icon:"🏢",  grad:g("#FFB3CC","#FF7FA8"), role:"UI Designer · SI 시스템",               summary:"대기업 SI 시스템 전체 UI를 설계했습니다.",            problem:"레거시 UI로 업무 효율이 낮았습니다.",                 approach:["현행 업무 흐름 분석","UI 구조 재설계","파일럿 테스트"],           results:[{value:"+35%",label:"업무효율"},{value:"-30%",label:"오류율"},{value:"90%",label:"만족도"}],   tags:["SI","엔터프라이즈"] },
          { id:2002, title:"건물 자동화 대시보드",      category:"BAS", year:"'24", icon:"🏗️", grad:g("#FFD1E0","#FFA6C4"), role:"UX/UI Designer · BAS",                 summary:"빌딩 자동화 시스템 모니터링 대시보드를 설계했습니다.", problem:"시스템 상태를 한 화면에서 파악하기 어려웠습니다.",   approach:["현장 관리자 인터뷰","실시간 데이터 시각화","알림 우선순위 체계"],  results:[{value:"-45%",label:"대응 시간"},{value:"+28%",label:"에너지 절감"},{value:"93%",label:"만족도"}], tags:["BAS","대시보드"] },
          { id:2003, title:"BEM 관리 시스템 UI",       category:"BEM", year:"'23", icon:"📋",  grad:g("#FFC9DD","#FF8FB3"), role:"UI Designer · BEM",                    summary:"건물 에너지 관리 시스템 UI를 재설계했습니다.",        problem:"에너지 소비 데이터 파악에 시간이 오래 걸렸습니다.",  approach:["에너지 지표 우선순위화","실시간 알림 시스템","리포트 자동화"],     results:[{value:"+20%",label:"에너지절감"},{value:"-50%",label:"보고 시간"},{value:"88%",label:"만족도"}], tags:["BEM","에너지"] },
          { id:2004, title:"사이니지 시스템 설계",      category:"SI",  year:"'23", icon:"🖼️", grad:g("#FFB3CC","#FF9EC0"), role:"UI Designer · 사이니지",               summary:"대형 건물 사이니지 콘텐츠 관리 시스템을 설계했습니다.", problem:"여러 화면의 콘텐츠를 개별 관리해야 해 비효율적이었습니다.", approach:["중앙 관리 콘솔 설계","스케줄링 기능 도입","모바일 원격 관리"], results:[{value:"-70%",label:"운영 공수"},{value:"100+",label:"화면 연동"},{value:"95%",label:"만족도"}], tags:["사이니지","CMS"] },
          { id:2005, title:"전시관 인터랙티브 UI",      category:"SI",  year:"'23", icon:"🎪",  grad:g("#FFD1E0","#FFB3CC"), role:"UX/UI Designer · 인터랙션",             summary:"박물관·전시관 키오스크 인터랙티브 UI를 설계했습니다.", problem:"기존 키오스크가 사용하기 어려워 이탈률이 높았습니다.", approach:["관람객 행동 관찰","터치 기반 UX 최적화","멀티미디어 콘텐츠 연동"], results:[{value:"+60%",label:"참여율"},{value:"-40%",label:"이탈률"},{value:"4.7★",label:"만족도"}], tags:["키오스크","인터랙션"] },
          { id:2006, title:"공공기관 시스템 디자인",    category:"SI",  year:"'22", icon:"🏛️", grad:g("#FFC9DD","#FFA6C4"), role:"UX/UI Designer · 공공",                summary:"공공기관 행정 시스템 UI를 개선했습니다.",             problem:"복잡한 메뉴 구조로 민원 처리에 시간이 걸렸습니다.",  approach:["업무 흐름 재구성","접근성 기준 적용","사용자 테스트"],           results:[{value:"-35%",label:"처리 시간"},{value:"WCAG",label:"접근성 충족"},{value:"91%",label:"만족도"}], tags:["공공","접근성"] },
          { id:2007, title:"문서 관리 시스템 UI",       category:"SI",  year:"'22", icon:"🗂️", grad:g("#FFB3CC","#FF7FA8"), role:"UI Designer · DMS",                    summary:"기업 문서 관리 시스템(DMS) UI를 설계했습니다.",      problem:"문서 검색·분류가 비효율적이었습니다.",               approach:["검색 필터 구조 개선","버전 관리 UI 도입","폴더 시각화"],          results:[{value:"-55%",label:"검색 시간"},{value:"+30%",label:"생산성"},{value:"89%",label:"만족도"}],  tags:["DMS","문서관리"] },
          { id:2008, title:"BAS 모니터링 화면",         category:"BAS", year:"'22", icon:"📌",  grad:g("#FFD1E0","#FFA6C4"), role:"UI Designer · 모니터링",               summary:"빌딩 시설 통합 모니터링 화면을 설계했습니다.",        problem:"각 시스템이 분산되어 통합 관제가 어려웠습니다.",     approach:["단일 관제 화면 구성","임계값 알림 시각화","히스토리 데이터 연동"], results:[{value:"-40%",label:"대응 시간"},{value:"100%",label:"통합 관제"},{value:"94%",label:"만족도"}], tags:["모니터링","통합"] },
          { id:2009, title:"시설 관리 앱 설계",         category:"BAS", year:"'21", icon:"🔧",  grad:g("#FFC9DD","#FF8FB3"), role:"UX/UI Designer · 모바일",              summary:"현장 시설 관리자를 위한 모바일 앱을 설계했습니다.",   problem:"현장 점검 시 종이 기록으로 비효율이 발생했습니다.",  approach:["현장 워크플로우 분석","디지털 체크리스트 설계","오프라인 지원 기능"], results:[{value:"-65%",label:"점검 시간"},{value:"0건",label:"누락"},{value:"96%",label:"만족도"}],      tags:["모바일","시설관리"] },
          { id:2010, title:"스마트빌딩 컨트롤 UI",      category:"BAS", year:"'21", icon:"⚙️",  grad:g("#FFB3CC","#FF9EC0"), role:"UX/UI Designer · IoT",                 summary:"스마트빌딩 통합 제어 UI를 설계했습니다.",             problem:"조명·냉난방·보안을 별도 시스템으로 제어해야 했습니다.", approach:["통합 제어 아키텍처 설계","직관적 시나리오 기반 UI","음성 제어 연동"], results:[{value:"+25%",label:"에너지 절감"},{value:"3→1개",label:"앱 통합"},{value:"97%",label:"만족도"}], tags:["스마트빌딩","IoT"] },
        ],
        [
          { id:3001, title:"리빙룸 인테리어 제안",      category:"실내", year:"'24", icon:"🛋️", grad:g("#FFB3CC","#FF7FA8"), role:"Interior Designer · 주거",              summary:"모던 미니멀 컨셉의 리빙룸 인테리어를 제안했습니다.",  problem:"넓지만 활용도가 낮고 어수선한 공간이었습니다.",      approach:["라이프스타일 인터뷰","공간 동선 재구성","소재·컬러 컨셉 제안"],   results:[{value:"+40%",label:"공간 활용"},{value:"✓",label:"미니멀 구현"},{value:"★5.0",label:"만족도"}], tags:["리빙","미니멀"] },
          { id:3002, title:"소형 아파트 공간 기획",     category:"실내", year:"'24", icon:"🏠",  grad:g("#FFD1E0","#FFA6C4"), role:"Interior Designer · 주거",              summary:"25평 아파트의 공간 효율을 극대화한 기획안입니다.",    problem:"좁은 면적으로 수납과 생활 공간이 부족했습니다.",     approach:["빌트인 수납 설계","복합 기능 가구 제안","컬러로 공간 확장감 연출"], results:[{value:"+60%",label:"수납 공간"},{value:"✓",label:"개방감 확보"},{value:"★4.9",label:"만족도"}], tags:["소형","공간기획"] },
          { id:3003, title:"그린 오피스 환경 설계",     category:"실내", year:"'23", icon:"🪴",  grad:g("#FFC9DD","#FF8FB3"), role:"Interior Designer · 오피스",            summary:"자연 친화적 오피스 환경을 설계했습니다.",             problem:"삭막한 사무 환경으로 직원 만족도가 낮았습니다.",     approach:["바이오필릭 디자인 적용","그린월·식물 배치 계획","자연채광 극대화"], results:[{value:"+32%",label:"직원 만족"},{value:"-15%",label:"결근율"},{value:"✓",label:"그린 인증"}], tags:["오피스","바이오필릭"] },
          { id:3004, title:"조명 컨셉 디자인",          category:"실내", year:"'23", icon:"💡",  grad:g("#FFB3CC","#FF9EC0"), role:"Lighting Designer",                     summary:"공간별 맞춤형 조명 컨셉을 수립했습니다.",             problem:"획일적인 조명으로 공간의 분위기가 없었습니다.",       approach:["공간 용도별 조도 계획","레이어드 조명 설계","스마트 조명 시스템 연동"], results:[{value:"-20%",label:"전력 소비"},{value:"+45%",label:"공간 만족"},{value:"✓",label:"분위기 연출"}], tags:["조명","컨셉"] },
          { id:3005, title:"카페 인테리어 디자인",      category:"실내", year:"'23", icon:"🪟",  grad:g("#FFD1E0","#FFB3CC"), role:"Interior Designer · 상업",              summary:"로컬 카페의 브랜드 정체성을 담은 인테리어를 설계했습니다.", problem:"개성 없는 공간으로 SNS 노출이 없었습니다.",        approach:["브랜드 무드 분석","포토존·시그니처 구역 설계","소재 믹스 앤 매치"], results:[{value:"+200%",label:"SNS 노출"},{value:"+55%",label:"방문객"},{value:"✓",label:"브랜드 일치"}], tags:["카페","브랜드"] },
          { id:3006, title:"호텔 객실 리뉴얼",          category:"실내", year:"'22", icon:"🛏️", grad:g("#FFC9DD","#FFA6C4"), role:"Interior Designer · 숙박",              summary:"부티크 호텔 객실 인테리어를 전면 리뉴얼했습니다.",    problem:"노후화된 인테리어로 리뷰 평점이 하락했습니다.",      approach:["투숙객 리뷰 분석","타입별 테마 룸 설계","기능성·심미성 균형"],   results:[{value:"+1.2점",label:"리뷰 평점"},{value:"+40%",label:"예약률"},{value:"✓",label:"리뉴얼 완료"}], tags:["호텔","럭셔리"] },
          { id:3007, title:"레스토랑 공간 기획",        category:"실내", year:"'22", icon:"🍽️", grad:g("#FFB3CC","#FF7FA8"), role:"Interior Designer · 식음",              summary:"파인다이닝 레스토랑의 공간 경험을 설계했습니다.",     problem:"음식의 퀄리티에 비해 공간이 경험을 받쳐주지 못했습니다.", approach:["다이닝 경험 시나리오 수립","테이블 배치 최적화","앰비언스 조명·음향 계획"], results:[{value:"+65%",label:"예약 대기"},{value:"+80%",label:"SNS 언급"},{value:"추천",label:"미슐랭 빕"}], tags:["레스토랑","파인다이닝"] },
          { id:3008, title:"욕실 공간 리모델링",        category:"실내", year:"'22", icon:"🚿",  grad:g("#FFD1E0","#FFA6C4"), role:"Interior Designer · 주거",              summary:"기능성과 감성을 모두 갖춘 욕실 리모델링을 진행했습니다.", problem:"좁고 어두운 구조로 사용 불편이 컸습니다.",          approach:["공간 동선 최적화","밝은 타일·조명 조합","수납 빌트인 설계"],     results:[{value:"+50%",label:"수납 공간"},{value:"✓",label:"밝기 개선"},{value:"★5.0",label:"만족도"}], tags:["욕실","리모델링"] },
          { id:3009, title:"사무공간 환경 개선",        category:"실내", year:"'21", icon:"🪑",  grad:g("#FFC9DD","#FF8FB3"), role:"Interior Designer · 오피스",            summary:"직원 복지 향상을 위한 사무 공간 환경을 개선했습니다.", problem:"오픈형 사무공간에서 집중력 저하 민원이 많았습니다.",  approach:["집중존·협업존·휴식존 분리","방음 부스 도입","인체공학 가구 적용"], results:[{value:"+28%",label:"집중력"},{value:"+35%",label:"만족도"},{value:"-20%",label:"병가율"}], tags:["오피스","웰빙"] },
          { id:3010, title:"갤러리 전시 공간 디자인",   category:"실내", year:"'21", icon:"🎨",  grad:g("#FFB3CC","#FF9EC0"), role:"Interior Designer · 전시",              summary:"아트 갤러리 전시 공간을 새롭게 기획했습니다.",        problem:"작품 배치와 동선이 관람 경험을 방해했습니다.",       approach:["관람 동선 재설계","조명으로 작품 연출 강화","인터랙티브 구역 추가"], results:[{value:"+90%",label:"관람객"},{value:"+45%",label:"체류시간"},{value:"✓",label:"수상"}], tags:["갤러리","전시"] },
        ],
        [
          { id:4001, title:"친환경 패키지 디자인",      category:"패키지", year:"'24", icon:"📦",  grad:g("#FFB3CC","#FF7FA8"), role:"Package Designer · 친환경",            summary:"100% 재활용 가능한 친환경 패키지를 디자인했습니다.",  problem:"기존 패키지가 환경 기준을 충족하지 못했습니다.",     approach:["대체 소재 리서치","구조 경량화 설계","인증 취득 절차"],          results:[{value:"-80%",label:"플라스틱"},{value:"FSC",label:"인증 취득"},{value:"+30%",label:"브랜드 호감"}], tags:["친환경","지속가능"] },
          { id:4002, title:"시즌 기프트 패키지",        category:"패키지", year:"'24", icon:"🎁",  grad:g("#FFD1E0","#FFA6C4"), role:"Package Designer · 기프트",            summary:"연말 시즌 한정 프리미엄 기프트 패키지를 디자인했습니다.", problem:"시즌 한정 제품의 차별성이 부족했습니다.",           approach:["시즌 컨셉 무드보드","특수 인쇄·후가공 적용","세트 구성 기획"],   results:[{value:"+120%",label:"기프트 매출"},{value:"완판",label:"한정판"},{value:"★4.9",label:"만족도"}], tags:["기프트","시즌한정"] },
          { id:4003, title:"쇼핑백 브랜딩 디자인",      category:"패키지", year:"'23", icon:"🛍️", grad:g("#FFC9DD","#FF8FB3"), role:"Brand/Package Designer",               summary:"리테일 브랜드의 쇼핑백 패키지를 디자인했습니다.",     problem:"볼품없는 쇼핑백으로 브랜드 이미지가 저하됐습니다.",  approach:["브랜드 아이덴티티 반영","소재·구조 최적화","대량 생산 적용"],    results:[{value:"+50%",label:"브랜드 인지"},{value:"+25%",label:"재사용률"},{value:"✓",label:"광고 효과"}], tags:["쇼핑백","브랜딩"] },
          { id:4004, title:"음료 용기 제품 디자인",     category:"제품",   year:"'23", icon:"🍶",  grad:g("#FFB3CC","#FF9EC0"), role:"Product Designer · 용기",              summary:"새로운 음료 브랜드를 위한 용기 형태를 디자인했습니다.", problem:"기성 용기로는 브랜드 차별화가 어려웠습니다.",        approach:["인체공학 그립감 설계","성형 공법 검토","브랜드 컬러 적용"],      results:[{value:"+40%",label:"선호도"},{value:"특허",label:"형태 등록"},{value:"+35%",label:"매출"}],     tags:["용기","제품디자인"] },
          { id:4005, title:"뷰티 패키지 디자인",        category:"패키지", year:"'23", icon:"🧴",  grad:g("#FFD1E0","#FFB3CC"), role:"Package Designer · 뷰티",              summary:"프리미엄 뷰티 브랜드 패키지 라인업을 디자인했습니다.", problem:"패키지가 제품의 프리미엄 이미지를 표현하지 못했습니다.", approach:["럭셔리 소재·후가공 적용","일관된 라인업 설계","소비자 테스트"], results:[{value:"+60%",label:"구매 전환"},{value:"편집샵",label:"입점"},{value:"★4.8",label:"만족도"}], tags:["뷰티","럭셔리"] },
          { id:4006, title:"라벨 및 태그 디자인",       category:"패키지", year:"'22", icon:"🏷️", grad:g("#FFC9DD","#FFA6C4"), role:"Package Designer · 라벨",              summary:"다양한 제품군에 적용 가능한 라벨·태그 시스템을 설계했습니다.", problem:"제품마다 달랐던 라벨이 브랜드 혼선을 초래했습니다.", approach:["라벨 시스템 표준화","인쇄 사양 통일","적용 가이드 배포"],       results:[{value:"✓",label:"브랜드 통일"},{value:"-30%",label:"제작 비용"},{value:"50+",label:"SKU 적용"}], tags:["라벨","시스템"] },
          { id:4007, title:"식품 용기 패키지",          category:"패키지", year:"'22", icon:"🫙",  grad:g("#FFB3CC","#FF7FA8"), role:"Package Designer · 식품",              summary:"건강식품 브랜드 용기 패키지를 새롭게 디자인했습니다.", problem:"경쟁 제품과 차별점이 없어 진열대에서 눈에 띄지 않았습니다.", approach:["소비자 심리 리서치","색상·형태 차별화","정보 위계 재설계"],    results:[{value:"+45%",label:"구매율"},{value:"+70%",label:"브랜드 인지"},{value:"✓",label:"POP 수상"}], tags:["식품","패키지"] },
          { id:4008, title:"프리미엄 메일러 박스",       category:"패키지", year:"'22", icon:"📫",  grad:g("#FFD1E0","#FFA6C4"), role:"Package Designer · D2C",               summary:"D2C 브랜드를 위한 언박싱 경험 중심 메일러 박스를 디자인했습니다.", problem:"평범한 배송 박스로 브랜드 첫 인상이 약했습니다.",  approach:["언박싱 시나리오 설계","내지·인서트 기획","특수 코팅·오프셋 인쇄"], results:[{value:"+200%",label:"언박싱 영상"},{value:"+55%",label:"재구매율"},{value:"★5.0",label:"만족도"}], tags:["D2C","언박싱"] },
          { id:4009, title:"리본·포장지 디자인",        category:"패키지", year:"'21", icon:"🎀",  grad:g("#FFC9DD","#FF8FB3"), role:"Package Designer · 패션",              summary:"패션 브랜드의 시즌 포장재 디자인을 진행했습니다.",    problem:"매 시즌 동일한 포장으로 특별함이 없었습니다.",       approach:["시즌 아트워크 제작","리본·박스·티슈 통합 설계","생산 품질 관리"], results:[{value:"+80%",label:"선물 구매"},{value:"SNS",label:"바이럴"},{value:"✓",label:"시즌 교체"}], tags:["패션","포장"] },
          { id:4010, title:"어린이 음료 패키지",        category:"패키지", year:"'21", icon:"🧃",  grad:g("#FFB3CC","#FF9EC0"), role:"Package Designer · 어린이",            summary:"어린이 타깃 음료 브랜드의 패키지를 리뉴얼했습니다.",  problem:"어린이에게 어필하지 못해 선호도가 낮았습니다.",      approach:["어린이 타깃 리서치","캐릭터·일러스트 적용","안전 소재 인증"],    results:[{value:"+90%",label:"어린이 선호"},{value:"+60%",label:"매출"},{value:"✓",label:"안전 인증"}], tags:["어린이","캐릭터"] },
        ],
      ];
    }

    componentDidMount() {
      this._raf = requestAnimationFrame(this.tick);
      window.addEventListener("mousemove", this.onMouse);
      requestAnimationFrame(() => this._initSwiper());
    }

    componentDidUpdate() {
      const shouldHide = this.state.activeId != null;
      if (document.body.style.overflow !== (shouldHide ? "hidden" : "")) {
        document.body.style.overflow = shouldHide ? "hidden" : "";
      }
      if (this._lastTab !== this.state.activeTab) {
        this._lastTab = this.state.activeTab;
        requestAnimationFrame(() => this._initSwiper());
      }
    }

    componentWillUnmount() {
      cancelAnimationFrame(this._raf);
      window.removeEventListener("mousemove", this.onMouse);
      clearTimeout(this._closeT);
      document.body.style.overflow = "";
      if (this._swiper) { this._swiper.destroy(true, true); this._swiper = null; }
      if (this._modalSwiper) { this._modalSwiper.destroy(true, true); this._modalSwiper = null; }
    }

    _initModalSwiper() {
      if (this._modalSwiper) { this._modalSwiper.destroy(true, true); this._modalSwiper = null; }
      const el = this._modalSwiperEl;
      if (!el || typeof Swiper === "undefined") return;
      this._modalSwiper = new Swiper(el, {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        navigation: { prevEl: ".modal-thumb-prev", nextEl: ".modal-thumb-next" },
        pagination: { el: ".modal-thumb-pagination", clickable: true },
        observer: true,
        observeParents: true,
      });
    }

    _initSwiper() {
      if (this._swiper) { this._swiper.destroy(true, true); this._swiper = null; }
      const el = this._swiperEl;
      if (!el || typeof Swiper === "undefined") return;
      this._swiper = new Swiper(el, {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 24,
        loop: true,
        navigation: { prevEl: ".projects-btn-prev", nextEl: ".projects-btn-next" },
        pagination: { el: ".projects-pagination", clickable: true, dynamicBullets: false },
        breakpoints: {
          0:   { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 16 },
          640: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
          960: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24 },
        },
        observer: true,
        observeParents: true,
      });
    }

    onMouse = (e) => {
      this._m.tx = e.clientX;
      this._m.ty = e.clientY;
    };

    tick = () => {
      const m = this._m;
      m.x  += (m.tx - m.x)  * 0.2;
      m.y  += (m.ty - m.y)  * 0.2;
      m.dx += (m.tx - m.dx) * 0.09;
      m.dy += (m.ty - m.dy) * 0.09;
      const f = this._follower;
      if (f) f.style.transform = `translate(${m.x}px,${m.y}px) translate(-50%,-50%)`;
      const d = this._dot;
      if (d) d.style.transform = `translate(${m.dx}px,${m.dy}px) translate(-50%,-50%)`;
      this._raf = requestAnimationFrame(this.tick);
    };

    setTab = (i) => this.setState({ activeTab: i });

    closeModal = () => {
      if (this.state.closing) return;
      this.setState({ closing: true });
      this._closeT = setTimeout(
        () => this.setState({ activeId: null, closing: false }),
        this.CLOSE_DELAY
      );
    };

    stop = (e) => e.stopPropagation();

    renderVals() {
      const accent      = this.props.primaryColor || "#FF4D8D";
      const activeTab   = this.state.activeTab;
      const tabProjects = this.TAB_PROJECTS[activeTab] || [];

      const open = (id) => () => {
        clearTimeout(this._closeT);
        this.setState({ activeId: id, closing: false });
      };

      const tabs = this.TAB_LABELS.map((label, i) => ({
        label,
        click: () => this.setTab(i),
        style: i === activeTab
          ? `background:${accent};color:#fff;box-shadow:0 8px 20px rgba(255,77,141,.35);`
          : `background:#fff;color:#7a5867;box-shadow:0 4px 14px rgba(255,77,141,.13);`,
      }));

      const projects = tabProjects.map((p) => ({
        ...p,
        open: open(p.id),
        img: p.img || "./1.jpg",
        kpi: (p.results && p.results[0]) || { value: "", label: "" },
      }));
      const subProjects = this.SUB_PROJECTS.map((p) => ({
        ...p,
        open: open(p.id),
        img: p.img || "./1.jpg",
        kpi: (p.results && p.results[0]) || { value: "", label: "" },
      }));

      const allPool = this.SUB_PROJECTS
        .concat(this.TAB_PROJECTS.reduce((acc, arr) => acc.concat(arr), []));
      const foundProject = allPool.find((p) => p.id === this.state.activeId) || null;
      // 갤러리 이미지: 프로젝트에 images 배열이 있으면 사용, 없으면 기본 10장.
      // 추후 각 프로젝트 데이터에 images: ["./a.jpg", "./b.jpg", ...] 를 넣으면 교체됩니다.
      const defaultGallery = Array.from({ length: 10 }, () => "./1.jpg");
      const activeProject = foundProject
        ? {
            ...foundProject,
            img: foundProject.img || "./1.jpg",
            images: (foundProject.images && foundProject.images.length)
              ? foundProject.images
              : defaultGallery,
          }
        : null;

      return {
        setRoot:           this.setRoot,
        setFollower:       this.setFollower,
        setDot:            this.setDot,
        setProjectsSwiper: this.setProjectsSwiper,
        setModalSwiper:    this.setModalSwiper,
        closeModal:        this.closeModal,
        stop:              this.stop,
        accent,
        ownerName: this.props.ownerName || "유주연",
        role:      this.props.role      || "UX/UI 디자이너",
        tagline:   this.props.tagline   || "UI/UX 디자인 경험을 갖춘 8년차 디자이너",
        email:     this.props.email     || "hello@yujuyeon.design",
        tabs,
        projects,
        subProjects,
        modalOpen:    this.state.activeId != null,
        activeProject,
        modalAnim: this.state.closing
          ? "popOut .26s ease forwards"
          : "popBounce .5s cubic-bezier(0.34,1.56,0.64,1)",
        backdropAnim: this.state.closing
          ? "fadeOut .26s ease forwards"
          : "fadeIn .25s ease",
      };
    }
  }

  return Component;
};
