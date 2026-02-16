export const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || "e2e-test@booklog-test.dev",
  password: process.env.TEST_USER_PASSWORD || "TestPass123!",
  nickname: process.env.TEST_USER_NICKNAME || "E2E테스터",
};

export const UI_TEXT = {
  // Login
  loginHeader: "[ LOGIN ]",
  loginButton: "로그인",
  loginLoading: "로그인 중...",
  welcomeMessage: "픽북에 오신 것을 환영합니다!",

  // Library
  libraryHeader: "서재",
  emptyLibrary: "아직 책이 없어요!",
  goToSearch: "책 검색하러 가기",
  emptyTab: "해당 상태의 책이 없습니다.",
  tabAll: "전체",
  tabWantToRead: "읽고싶은",
  tabReading: "읽는중",
  tabCompleted: "완독",
  tabDropped: "중단",

  // Search
  searchHeader: "책 검색",
  searchPlaceholder: "책 제목, 저자, ISBN으로 검색...",
  addToLibrary: "서재에 추가",
  addedToLibrary: "서재에 추가되었습니다!",
  inLibrary: "서재에 있음",

  // Book Detail
  readingRecord: "독서 기록",
  statusWantToRead: "읽고 싶은",
  statusReading: "읽는 중",
  statusCompleted: "완독",
  statusDropped: "중단",
  completedToast: "완독을 축하합니다! 탑이 높아졌어요!",
  reviewPlaceholder: "이 책에 대한 한 줄 감상을 남겨보세요",

  // Reading Notes
  readingNotes: "독서 메모",
  emptyNotes: "아직 메모가 없습니다.",
  addNote: "메모 추가",
  noteAdded: "메모가 추가되었습니다",
  noteEdited: "메모가 수정되었습니다",
  noteDeleted: "메모가 삭제되었습니다",
  deleteNoteConfirm: "정말 이 메모를 삭제하시겠습니까?",
  save: "저장",
  cancel: "취소",
  edit: "수정",
  delete: "삭제",

  // Delete Book
  deleteFromLibrary: "서재에서 삭제",
  deleteBookTitle: "책 삭제",
  deletedFromLibrary: "서재에서 삭제되었습니다",

  // Profile
  profileHeader: "프로필",
  nickname: "닉네임",
  accountInfo: "계정 정보",
  readingStats: "독서 현황",
  dataExport: "데이터 내보내기",
  nicknamePlaceholder: "닉네임을 입력하세요",
  nicknameSaved: "닉네임이 저장되었습니다",
  nicknameEmpty: "닉네임을 입력해주세요",
  csvDownload: "CSV 다운로드",
  jsonDownload: "JSON 다운로드",
  logout: "로그아웃",

  // Pages
  towerHeader: "책 탑",
  statsHeader: "통계",
  charactersHeader: "캐릭터 도감",

  // Google OAuth
  googleLoginButton: "Google로 로그인",

  // Signup
  signupHeader: "[ SIGNUP ]",
  signupButton: "회원가입",
  signupLoading: "가입 중...",
  signupSubheading: "새로운 모험을 시작하세요!",
  alreadyHaveAccount: "이미 계정이 있으신가요?",

  // Tower
  towerEmpty: "완료한 책이 없어요",
  towerStats: "타워 통계",
  towerTotalHeight: "총 높이",
  towerBooksCompleted: "완독 수",

  // Stats
  yearlyCompleted: "올해 완독",
  totalPagesRead: "총 읽은 페이지",
  monthlyChart: "월별 완독 수",
  genreBreakdown: "장르별 분포",
  readingCalendar: "독서 캘린더",
  noCompletedBooks: "아직 완독한 책이 없습니다",

  // Characters
  collectionStatus: "수집 현황",
  rarityCommon: "일반",
  rarityRare: "레어",
  rarityEpic: "에픽",
  rarityLegendary: "전설",
  noCharactersInTier: "이 등급의 캐릭터가 없습니다.",
};

export const TEST_BOOK = {
  isbn13: "9788966261024",
  title: "클린 코드",
  author: "로버트 C. 마틴",
  publisher: "인사이트",
  page_count: 584,
  category: "프로그래밍",
};

export const TEST_BOOK_2 = {
  isbn13: "9788960777330",
  title: "자바스크립트 패턴과 테스트",
  author: "래리 스펜서",
  publisher: "에이콘출판사",
  page_count: 380,
  category: "프로그래밍",
};

export const TEST_NOTE_CONTENT = "이 부분이 인상 깊었습니다. 클린 코드의 핵심은 가독성이다.";
export const TEST_NOTE_PAGE = "42";
export const TEST_NOTE_EDITED = "수정된 메모: 클린 코드의 핵심은 가독성과 유지보수성이다.";
export const TEST_REVIEW = "코드 품질에 대한 훌륭한 안내서";
export const TEST_NICKNAME = "새닉네임테스트";
