import { useState, useEffect, useCallback } from "react";
import { dbGet, dbSet } from "./firebase";

const REQUEST_DATA = {"신성근":"- 현장 점검후 부적합사항 조치관련 현장설명서 개정 및 후속조치\n\n- 욕실장 하자다발 관련  하자발생현장 검수 진행 _ 랩스 협업 (본부장님 지시사항)  → 원인파익 및 해결방안 유관팀 협의 진행\n\n- 타겟점검에 대한 신규아이템 발굴 및 체크리스트 반영 (리비젼관리_ AS,소송관련 항목들은 정기 업데이트가아닌 수시로)\n\n- 품질우수현장 인증서 (안전협의)_ 검토 (본부장님 지시사항)\n\n- 품질협의체 진행사항 모니터링 (담당 이정호M)\n\n- 설계 통합 플랫폼(이은주M) _ 천안6단지 파일럿테스트 적극 참여 / 의견개진","박정호":"- 통합 품질데이터 구조도 관련  유관파트와 회의일정 수립 및 진행사항 리뷰에 체크 / 목표일자 관리\n\n - 데이터 적기제공에 대한 계획안 수립 / 보고\n \n- 창떨림 방지 보강여부를 전수조사 확인할수 있도록 바랍니다 매니저 활용등으로 조사결과 보고필요 (본부장님 보고 할것)","박찬우":"아침 8시~9시 트리거 작동확인","배춘호":"- 레미콘 사전점검 종합보고서. 품질관리 맵 관련 목표 일자 관리","이정호":"- 품질협의체 상정안건 LIST 정리\n\n- 복층유리 아르곤가스 측정기 등 신규장비 / 점검방법 검토 (본부장님 지시시항)\n\n- 타겟점검에 대한 신규아이템 발굴 및 체크리스트 반영 (리비젼관리_ AS,소송관련 항목들은 정기 업데이트가아닌 수시로)\n\n- [본부장님 지시사항] 광주센테니얼_  가구 래핑 불량사진 첨부해서 업체 공문 발송 지시 후 본부장님 보고할것\n\n- 욕실장 거울변색 / 지하주차장 천장 단열재 탈락에 대한 품질협의체 안건 상정 및 후속조치 시행 (5/29)","한진헌":"","류지수":"","이희윤":"-  품질관련 target 점검 1건 1/4분기 실행","장효린":"- 판결보고 (엘포트, 평촌더샵, DMC센트럴) + 소송리스크 저감을 위한 핵심이행사항 보고","박형건":"-  판결보고 (엘포트, 평촌더샵, DMC센트럴) + 소송리스크 저감을 위한 핵심이행사항 보고","임병근":"- 소송핵심관리 검토용역 체크리스트 보고\n\n - 방화문 소송 ISSUE F/U","조성우":"- 부산서면 / 타일 균열들뜸 하자에 대한 하심위 접수 모니터링 (하자실사시 보수여부 결정)\n\n- 손끼임 방지재 관련 병점 시공시 _ 관리사무소와 긴밀협의지시(본부장님)_ 모든것은 관리사무소가 소요량 및 입주자 확인서명..등등등\n\n - 하자관련 협력회사 처리지연에 대한 제재방안 강구 _ 외주구매팀 요청사항\n\n - 조경직원 충원에 대한 협의진행 / 고사목 하자처리 Process 수립 / 수목유지관리비 현실화 검토\n\n - [본부장님 지시사항] 품질팀 대쉬보드 구축 지연","정경주":"- 고객센터 피드백 강화방안 수립 _ 상시 / 유관팀 협업 프로세스 정리 등\n\n- 소송핵심관리 검토 용역 _ 1차 보고서 취합 및 브리핑 준비    →   후속현장 입찰 시행 일정 수립\n\n- 준공현장 골조 균열 저감을 위한 공용부 점검 강화 _ 랩스 협의\n   : 균열저감 / 운영효율화 관련한 기초자료 수집 _ 랩스협업 (조사결과 데이터 수집 / 6개월, 1~3년 등)\n\n - 하자관련 협력회사 처리지연에 대한 제재방안 강구 _ 외주구매팀 요청사항\n\n - 소송핵심관리 검토용역 조경부위에 대한 모니터링 강화 및 준공도서 일치 여부 본부장님 보고 (춘천레이크시티 시행)","김성진":"- 원인불명 하자 모니터링 (오픈하우스 시행단지/ 준공 초기 현장)\n\n - 하자관련 협력회사 처리지연에 대한 제재방안 강구 _ 외주구매팀 요청사항\n\n - 잔공사 편성 시기 및 집행에 대해 변경관리 UNIT과 협의","이규현":"- 원인불명 하자 모니터링 (오픈하우스 시행단지/ 준공 초기 현장)\n\n - CS 업무처리 개선안 보고 _ 원인불명하자처리 / 입주초기 R&R","박성준":"- 원인불명 하자 처리 프로세스 파일럿 시행안 작성 (오픈하우스 시행단지/ 준공 초기 현장)\n\n - 춘천아이파크 스카이 라운지 투어 시 비상조치 및 운영계획 철저 수립 (본부장님)\n\n - NCSI, SQ 인증 준비사항 및 심사계획 보고"};

const WORK_DATA = {"신성근":[],"박정호":[],"박찬우":[],"배춘호":[],"이정호":[],"한진헌":[],"류지수":[],"이희윤":[],"장효린":[],"박형건":[],"임병근":[],"조성우":[],"정경주":[],"김성진":[],"이규현":[],"박성준":[]};


const dbGet = async (collection, docId) => {
  try {
    const db = await initFirebase();
    const doc = await db.collection(collection).doc(docId).get();
    return doc.exists ? doc.data() : null;
  } catch(e) { console.error('dbGet 오류:', e); return null; }
};

const dbSet = async (collection, docId, data) => {
  try {
    const db = await initFirebase();
    await db.collection(collection).doc(docId).set(data, { merge: true });
    return true;
  } catch(e) { console.error('dbSet 오류:', e); return false; }
};



const MEMBERS = {
  QC: {
    label: "QC 파트", color: "#8b5e3c",
    members: [
      { name: "신성근", 전략:70, 업무:30, 개인:0, goals: [
        { cat:"전략", 과제:"예측기반의 타겟점검 운영", 배점:40, 내용:"현장 품질관리 핵심사항에 대한 타겟점검 시행 및 F/B\n: 핵심 품질관리 시행안 작성 및 배포\n: 품질협의체 운영을 통한 신속한 F/B 시행" },
        { cat:"전략", 과제:"건설 DX (클라우드 기반 도서검토)", 배점:30, 내용:"클라우드 기반의 초기 도서검토 프로세스 개선" },
        { cat:"업무", 과제:"골조/타일 하자비용 저감", 배점:30, 내용:"품질점검 부적합사항에 대한 협력사 책임강화\n: 부적합사항 발생 및 미조치 시 제재방안 개정" },
      ]},
      { name: "박정호", 전략:70, 업무:0, 개인:30, goals: [
        { cat:"전략", 과제:"예측기반의 타겟점검 운영", 배점:20, 내용:"건축비구조요소 내진설계 타겟점검 강화 및 교육 실시\n: 조적, 석공사, 금속천장 점검 전 사전교육 시행" },
        { cat:"전략", 과제:"건설 DX (품질데이터 JIT 제공)", 배점:50, 내용:"① 통합 품질 데이터 구축: 공종별 자료 분류 및 취합\n② 품질데이터 Just-In-Time 제공: 현장 필요 시점에 공종별 데이터 제공 시스템 구축" },
        { cat:"개인", 과제:"부적합보고서(NCR) 발행 전산화 관리", 배점:30, 내용:"부적합보고서(NCR) 발행 전산화 관리" },
      ]},
      { name: "박찬우", 전략:70, 업무:30, 개인:0, goals: [
        { cat:"전략", 과제:"예측기반의 타겟점검 운영", 배점:30, 내용:"실무 괴리 항목 발굴을 통한 점검항목 신설 및 품질협의체 안건 발굴\n: 시공지침-현장실무간 불일치 사례를 협의체 안건으로 상정\n: 하자소송 및 반복지적사항을 바탕으로 한 점검항목 신설" },
        { cat:"전략", 과제:"건설 DX (I-QMS 적용 및 이관)", 배점:40, 내용:"품질점검 I-QMS 적용 및 이관\n: 점검결과 및 결재 I-QMS시스템 적용" },
        { cat:"업무", 과제:"골조/타일 하자비용 저감", 배점:30, 내용:"실전 노하우 기반 골조·타일 하자 예방 및 품질 지식 전파\n: 최근 2개년 점검/하자사례분석\n: 우수작업자 및 관리자의 노하우 발굴 및 현장 전파" },
      ]},
      { name: "이정호", 전략:40, 업무:20, 개인:40, goals: [
        { cat:"전략", 과제:"예측기반의 타겟점검 운영", 배점:40, 내용:"① 소송·비용으로 확대될 가능성 높은 공종 선별 및 점검시행 (30%)\n: 점검항목 제·개정, 점검계획안 수립 등\n② COP매니저를 활용한 현장 자율 운영 체계 시행 및 모니터링 (10%)" },
        { cat:"업무", 과제:"골조/타일 하자비용 저감", 배점:20, 내용:"골조공사 하자저감을 위한 품질협의체 안건 상정 및 개선안 도출" },
        { cat:"개인", 과제:"품질협의체 개선 운영", 배점:40, 내용:"품질협의체 개선 운영" },
      ]},
      { name: "한진헌", 전략:100, 업무:0, 개인:0, goals: [
        { cat:"전략", 과제:"예측기반의 타겟점검 운영", 배점:50, 내용:"2025년 하자 중 주요 반복하자 12개 항목을 선별하여 타겟점검에 반영\n→ 반복하자 사전예방 및 재발률 감소" },
        { cat:"전략", 과제:"준공도서 사전검토 (업무체계 개선)", 배점:40, 내용:"점검 시 각 현장의 의견을 수렴한 설계/시공 기준 및 표준상세도 개선안 협의·반영\n초기~준공 점검시 샵도면 적정성 및 준공도면 반영 확인" },
        { cat:"전략", 과제:"건설 DX (I-QMS 이관)", 배점:10, 내용:"I-QMS 기반 보고서 작성, 품질점검 데이터 및 기술자료 전현장 공유" },
      ]},
      { name: "류지수", 전략:100, 업무:0, 개인:0, goals: [
        { cat:"전략", 과제:"전기공종 타겟점검 및 리스크 저감", 배점:50, 내용:"전기공종 고위험 품질항목을 사전 도출하고 타겟점검 및 후속조치 관리를 통해 반복·고비용 하자 리스크 저감" },
        { cat:"전략", 과제:"준공도서 사전검토 (전기·통신·소방)", 배점:30, 내용:"전기·통신·소방전기 준공도서의 적합성을 사전 검토하고 누락·상이·오기 사항을 유형화하여 준공단계 품질 리스크 예방" },
        { cat:"전략", 과제:"건설 DX (전기공종 데이터화)", 배점:20, 내용:"전기공종 점검결과, NCR, VOC, 하자 이슈를 데이터화하고 클라우드 기반 품질관리 및 I-CLICK 개선과 연계하여 재발방지 체계 구축" },
      ]},
      { name: "이희윤", 전략:60, 업무:0, 개인:40, goals: [
        { cat:"전략", 과제:"예측기반의 타겟점검 운영", 배점:60, 내용:"초기/진행/준공별 공정에 적합한 점검 시행" },
        { cat:"개인", 과제:"품질관리비 표준예산(안) 개정", 배점:20, 내용:"품질관리비 표준예산(안) 개정" },
        { cat:"개인", 과제:"표준 품질관리계획서 개정 및 배포", 배점:20, 내용:"표준 품질관리계획서 개정 및 배포" },
      ]},
      { name: "배춘호", 전략:40, 업무:40, 개인:20, goals: [
        { cat:"전략", 과제:"예측기반의 타겟점검 운영", 배점:40, 내용:"각 현장별 주요진행 공정에 대한 중점점검 관리 (도로, 철도, 항만 등 공사별 주 진행공종)" },
        { cat:"업무", 과제:"BS하자 처리율 개선", 배점:40, 내용:"주요하자 발생항목에 대한 중점관리 (인프라 하자처리 항목 참조)" },
        { cat:"개인", 과제:"전국 지방 레미콘사 주요 현황 관리", 배점:20, 내용:"전국 지방 레미콘사 주요 현황 관리" },
      ]},
    ]
  },
  BS: {
    label: "BS 파트", color: "#6b4226",
    members: [
      { name: "김성진", 전략:30, 업무:60, 개인:10, goals: [
        { cat:"전략", 과제:"건설 DX (AI VOC 기반 현장관리)", 배점:30, 내용:"AI VOC 기반 지능형 현장 관리 체계" },
        { cat:"업무", 과제:"BS하자 처리율 개선", 배점:20, 내용:"입주 전 원인불명, 자재건 하자처리율 상승 (10%→30%)" },
        { cat:"업무", 과제:"고객 불만율 관리 (SNS 비대면 응대)", 배점:20, 내용:"정보 전달 방식을 다각화하여 비대면 상시응대 강화 (SNS 채널 운영)" },
        { cat:"업무", 과제:"고객 불만율 관리 (아이파크데이 개편)", 배점:20, 내용:"기존 제공되었던 서비스 항목에 대한 전면 개편 (아이파크데이)" },
        { cat:"개인", 과제:"오픈하우스 및 입주안내 영상 제작", 배점:10, 내용:"오픈하우스 및 입주안내 영상 제작" },
      ]},
      { name: "박성준", 전략:20, 업무:60, 개인:20, goals: [
        { cat:"전략", 과제:"건설 DX (인수인계 자료 관리 개선)", 배점:20, 내용:"인수인계 자료 관리 개선안 (R&R, 인수인계 자료 재검토)" },
        { cat:"업무", 과제:"BS하자 처리율 개선", 배점:40, 내용:"입주 전 원인불명, 자재건 하자처리율 상승 (10%→30%)" },
        { cat:"업무", 과제:"고객 불만율 관리 (홈케어·기프트 개편)", 배점:20, 내용:"기존 제공되었던 서비스 항목에 대한 전면 개편 (홈케어, 기프트)" },
        { cat:"개인", 과제:"협력사 선정·평가 방식 개선", 배점:20, 내용:"협력사 선정(입찰) 및 평가 방식 개선, F/B 결과보고" },
      ]},
      { name: "이규현", 전략:60, 업무:40, 개인:0, goals: [
        { cat:"전략", 과제:"예측기반의 타겟점검 운영", 배점:20, 내용:"현장 자율 운영 체계 구축 (COP매니저 운영 모니터링 및 F/B)" },
        { cat:"전략", 과제:"건설 DX", 배점:40, 내용:"DATA LAB CS현황 대시보드 개선\n품질데이터 구조도 수립 및 적기 제공 시스템 구축" },
        { cat:"업무", 과제:"BS하자 처리율 개선", 배점:40, 내용:"입주초기 하자, 민원에 대한 R&R 재정립" },
      ]},
    ]
  },
  AS: {
    label: "AS 파트", color: "#a0785a",
    members: [
      { name: "조성우", 전략:30, 업무:70, 개인:0, goals: [
        { cat:"전략", 과제:"건설 DX (아이클릭 고도화)", 배점:15, 내용:"아이클릭 Data 활용 고도화 (Snowflake 연동한 데이터 활용체계 구축)" },
        { cat:"전략", 과제:"건설 DX (위젯형 대시보드)", 배점:15, 내용:"품질팀 위젯형 업무 대시보드 구축 (QC/BS/AS/소송)" },
        { cat:"업무", 과제:"골조/타일 하자비용 저감 (하자보수 절차)", 배점:20, 내용:"센터 전결공사에 대한 하자보수 절차 개선" },
        { cat:"업무", 과제:"고객 불만율 관리 (VOC·해피콜)", 배점:25, 내용:"VOC 및 해피콜 운영 개선" },
        { cat:"업무", 과제:"고객 불만율 관리 (장기 미처리)", 배점:25, 내용:"하자처리 소요일 및 장기 미처리 개선" },
      ]},
      { name: "정경주", 전략:50, 업무:50, 개인:0, goals: [
        { cat:"전략", 과제:"준공도서 사전검토 (소송핵심관리 용역)", 배점:50, 내용:"소송핵심관리검토 용역 개선 및 시행" },
        { cat:"업무", 과제:"골조/타일 하자비용 저감 (분류체계 표준화)", 배점:25, 내용:"골조 하자 분류체계 표준화 및 시스템 구축" },
        { cat:"업무", 과제:"골조/타일 하자비용 저감 (균열조사~보수)", 배점:25, 내용:"준공 전후 균열조사~보수 절차 개선" },
      ]},
    ]
  },
  소송: {
    label: "소송 파트", color: "#5c3317",
    members: [
      { name: "장효린", 전략:50, 업무:50, 개인:0, goals: [
        { cat:"전략", 과제:"준공도서 사전검토 (소송핵심관리 현장평가)", 배점:25, 내용:"소송핵심관리 용역개선 및 현장 평가안 수립" },
        { cat:"전략", 과제:"건설 DX (하자소송 DB)", 배점:25, 내용:"AI기반의 하자소송 분석 DB화 추진" },
        { cat:"업무", 과제:"골조/타일 하자비용 저감 (구상권 청구)", 배점:25, 내용:"협력업체 및 보증사 구상권 청구" },
        { cat:"업무", 과제:"골조/타일 하자비용 저감 (하자저감 대책)", 배점:25, 내용:"골조/타일 하자 저감 대책 수립 (유관팀 협조)" },
      ]},
      { name: "박형건", 전략:50, 업무:50, 개인:0, goals: [
        { cat:"전략", 과제:"예측기반의 타겟점검 운영 (선제적 중점관리)", 배점:25, 내용:"주요 판결 및 감정 사례 분석을 통한 선제적 중점 관리 리스트 수립" },
        { cat:"전략", 과제:"준공도서 사전검토 (소송대응 협의체)", 배점:25, 내용:"준공(예정포함) 사업지 소송대응 협의체 구성 및 운영" },
        { cat:"업무", 과제:"골조/타일 하자비용 저감 (판결 Feedback)", 배점:25, 내용:"판결 Feedback 유관팀 개선요청, 협의" },
        { cat:"업무", 과제:"골조/타일 하자비용 저감 (소송사례 교육)", 배점:25, 내용:"소송사례 교육" },
      ]},
      { name: "임병근", 전략:45, 업무:55, 개인:0, goals: [
        { cat:"전략", 과제:"예측기반의 타겟점검 운영 (점검항목 신설)", 배점:25, 내용:"주요 판결 및 감정 사례 분석을 통한 중점 관리 리스트 수립" },
        { cat:"전략", 과제:"건설 DX (판결금 정량 DB)", 배점:20, 내용:"AI 기반 하자소송 통합 DB 구축 및 항목별 판결금 정량 데이터화" },
        { cat:"업무", 과제:"골조/타일 하자비용 저감 (소송비 분석)", 배점:25, 내용:"골조 타일 공종별 소송 투입비용 분석 및 최소화 방안 수립" },
        { cat:"업무", 과제:"골조 및 타일 소송비 유관부서 Feedback", 배점:30, 내용:"골조 및 타일 공종 소송비 투입 분석 및 유관부서 Feedback" },
      ]},
    ]
  }
};

const CAT_COLOR = { 전략:"#8b5e3c", 업무:"#6b4226", 개인:"#a0785a" };
const CAT_BG    = { 전략:"#f5ede4", 업무:"#e8d5c0", 개인:"#f0e6d8" };
const rateColor = (r) => r >= 80 ? "#4a7c59" : r >= 50 ? "#b8860b" : r > 0 ? "#c0703a" : "#bba080";

function calcRate(goals) {
  const tot  = goals.reduce((s,g) => s + g.배점, 0);
  const done = goals.reduce((s,g) => s + (g.실적||0), 0);
  return tot === 0 ? 0 : Math.round((done/tot)*100);
}


// ── 업무현황 패널 ────────────────────────────────────────────────────────
const EMPTY_FORM = { 업무:"", 요청부서:"", 접수일:"", 목표일:"", 완료일:"", 상태:"진행중", 리뷰:"" };
const 상태목록 = ["진행중","완료","검토중","보류","취소"];
const 상태색 = { "진행중":"#b8860b", "완료":"#4a7c59", "검토중":"#8b5e3c", "보류":"#a08060", "취소":"#c0703a" };
const 상태배경 = { "진행중":"#fef8e7", "완료":"#e8f5ed", "검토중":"#f5ede4", "보류":"#f5f0eb", "취소":"#fdf0eb" };

function WorkPanel({ name, partColor, workData, setWorkData, reqData, setReqData }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editIdx, setEditIdx] = useState(null);
  const [filterState, setFilterState] = useState("진행중");
  const [detailIdx, setDetailIdx] = useState(null); // 이력 모달용
  const [searchQuery, setSearchQuery] = useState("");

  const tasks = workData[name] || [];

  const today = new Date().toISOString().slice(0,10);

  const saveTask = () => {
    if (!form.업무.trim()) return;
    setWorkData(prev => {
      const list = [...(prev[name] || [])];
      const now = new Date().toISOString().slice(0,16).replace("T"," ");
      if (editIdx !== null) {
        const prev_t = list[editIdx];
        const log = { 시각:now, 변경전상태:prev_t.상태, 변경후상태:form.상태, 메모:form.리뷰 };
        const logs = [...(prev_t.이력||[]), log];
        list[editIdx] = { ...form, 이력:logs };
      } else {
        list.push({ ...form, 접수일: form.접수일 || today, 이력:[{ 시각:now, 변경전상태:"", 변경후상태:form.상태, 메모:form.리뷰||"신규 등록" }] });
      }
      const next = { ...prev, [name]: list };
      dbSet('work', name, { tasks: list });
      return next;
    });
    setForm(EMPTY_FORM); setShowForm(false); setEditIdx(null);
  };

  const addLog = (idx, memo) => {
    setWorkData(prev => {
      const list = [...(prev[name] || [])];
      const t = list[idx];
      const now = new Date().toISOString().slice(0,16).replace("T"," ");
      list[idx] = { ...t, 이력:[...(t.이력||[]), { 시각:now, 변경전상태:t.상태, 변경후상태:t.상태, 메모:memo }] };
      const next = { ...prev, [name]: list };
      dbSet('work', name, { tasks: list });
      return next;
    });
  };

  const changeStatus = (idx, newState) => {
    setWorkData(prev => {
      const list = [...(prev[name] || [])];
      const t = list[idx];
      const now = new Date().toISOString().slice(0,16).replace("T"," ");
      const log = { 시각:now, 변경전상태:t.상태, 변경후상태:newState, 메모:`상태 변경: ${t.상태} → ${newState}` };
      list[idx] = { ...t, 상태:newState, 완료일: newState==="완료" ? today : t.완료일, 이력:[...(t.이력||[]), log] };
      const next = { ...prev, [name]: list };
      dbSet('work', name, { tasks: list });
      return next;
    });
  };

  const deleteTask = (i) => {
    setWorkData(prev => {
      const list = [...(prev[name] || [])];
      list.splice(i, 1);
      const next = { ...prev, [name]: list };
      dbSet('work', name, { tasks: list });
      return next;
    });
  };

  const startEdit = (i) => {
    setForm({ ...tasks[i] });
    setEditIdx(i);
    setShowForm(true);
  };

  // 완료일 비어있으면 진행중으로 취급
  const effectiveState = (t) => (!t.완료일 && t.상태 !== "완료" && t.상태 !== "보류" && t.상태 !== "취소") ? "진행중" : t.상태;
  const filtered = (filterState === "전체" ? tasks : tasks.filter(t => effectiveState(t) === filterState))
    .filter(t => !searchQuery.trim() || t.업무.includes(searchQuery) || (t.요청부서||"").includes(searchQuery) || (t.리뷰||"").includes(searchQuery));
  const counts = 상태목록.reduce((acc,s) => { acc[s] = tasks.filter(t => effectiveState(t) === s).length; return acc; }, {});

  return (
    <div style={{ width:"50%", display:"flex", flexDirection:"column", background:"#fdf8f4", borderLeft:"1px solid #d4b896" }}>

      {/* 헤더 + 추가버튼 */}
      <div style={{ padding:"12px 20px", borderBottom:"2px solid #d4b896", background:"#f0e6d8", flexShrink:0 }}>
        <div style={{ fontSize:"10px", color:"#a08060", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"2px" }}>2026 개인별 업무현황</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"8px" }}>
          <div style={{ fontSize:"14px", fontWeight:"700", color:"#5c3317" }}>업무 현황</div>
          <button onClick={() => { setForm({...EMPTY_FORM, 접수일:today}); setEditIdx(null); setShowForm(v=>!v); }}
            style={{ padding:"4px 12px", background: showForm?"#c4a882":partColor, color:"#fff", border:"none",
              borderRadius:"12px", fontSize:"11px", fontWeight:"700", cursor:"pointer" }}>
            {showForm ? "✕ 닫기" : "+ 신규 업무"}
          </button>
        </div>
        {/* 팀장 요청사항 */}
        <ReqSection name={name} reqData={reqData} setReqData={setReqData} partColor={partColor} />
        {/* 검색창 */}
        <div style={{ position:"relative", marginBottom:"6px" }}>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="업무명, 요청부서, 리뷰 검색..."
            style={{ width:"100%", padding:"5px 28px 5px 8px", border:"1px solid #d4b896",
              borderRadius:"6px", fontSize:"11px", color:"#3b1f0a", background:"#faf6f1",
              boxSizing:"border-box", outline:"none" }} />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}
              style={{ position:"absolute", right:"6px", top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", cursor:"pointer", color:"#a08060", fontSize:"13px", lineHeight:1 }}>✕</button>
          )}
        </div>
        {/* 상태 필터 탭 */}
        <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>
          {["전체",...상태목록].map(s => {
            const cnt = s==="전체" ? tasks.length : (counts[s]||0);
            const isA = filterState===s;
            return (
              <button key={s} onClick={()=>setFilterState(s)}
                style={{ padding:"2px 8px", border:"none", borderRadius:"10px", cursor:"pointer", fontSize:"9px", fontWeight: isA?"700":"400",
                  background: isA ? (s==="전체"?"#8b5e3c":(상태배경[s]||"#f0e6d8")) : "#ffffff",
                  color: isA ? (s==="전체"?"#fff":(상태색[s]||"#8b6a4a")) : "#a08060",
                  outline: isA ? `1px solid ${s==="전체"?"#8b5e3c":(상태색[s]||"#c4a882")}` : "none" }}>
                {s} {cnt > 0 ? `(${cnt})` : ""}
              </button>
            );
          })}
        </div>
      </div>

      {/* 신규 입력 폼 */}
      {showForm && (
        <div style={{ padding:"14px 18px", borderBottom:"2px solid #c4a882", background:"#fff8f2", flexShrink:0 }}>
          <div style={{ fontSize:"10px", color:"#8b5e3c", fontWeight:"700", marginBottom:"8px" }}>
            {editIdx !== null ? "✏️ 업무 수정" : "📝 신규 업무 등록"}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px", marginBottom:"6px" }}>
            <div style={{ gridColumn:"1/-1" }}>
              <div style={{ fontSize:"9px", color:"#a08060", marginBottom:"2px" }}>업무내용 *</div>
              <input value={form.업무} onChange={e=>setForm(p=>({...p,업무:e.target.value}))}
                placeholder="업무 내용을 입력하세요"
                style={{ width:"100%", padding:"5px 8px", border:"1px solid #c4a882", borderRadius:"4px",
                  fontSize:"12px", color:"#3b1f0a", background:"#faf6f1", boxSizing:"border-box", outline:"none" }} />
            </div>
            <div>
              <div style={{ fontSize:"9px", color:"#a08060", marginBottom:"2px" }}>요청부서</div>
              <input value={form.요청부서} onChange={e=>setForm(p=>({...p,요청부서:e.target.value}))}
                placeholder="예) 품질팀"
                style={{ width:"100%", padding:"5px 8px", border:"1px solid #d4b896", borderRadius:"4px",
                  fontSize:"11px", color:"#3b1f0a", background:"#faf6f1", boxSizing:"border-box", outline:"none" }} />
            </div>
            <div>
              <div style={{ fontSize:"9px", color:"#a08060", marginBottom:"2px" }}>진행상태</div>
              <select value={form.상태} onChange={e=>setForm(p=>({...p,상태:e.target.value}))}
                style={{ width:"100%", padding:"5px 8px", border:"1px solid #d4b896", borderRadius:"4px",
                  fontSize:"11px", color:"#3b1f0a", background:"#faf6f1", outline:"none" }}>
                {상태목록.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:"9px", color:"#a08060", marginBottom:"2px" }}>접수일</div>
              <input type="date" value={form.접수일} onChange={e=>setForm(p=>({...p,접수일:e.target.value}))}
                style={{ width:"100%", padding:"5px 8px", border:"1px solid #d4b896", borderRadius:"4px",
                  fontSize:"11px", color:"#3b1f0a", background:"#faf6f1", boxSizing:"border-box", outline:"none" }} />
            </div>
            <div>
              <div style={{ fontSize:"9px", color:"#a08060", marginBottom:"2px" }}>목표일</div>
              <input type="date" value={form.목표일} onChange={e=>setForm(p=>({...p,목표일:e.target.value}))}
                style={{ width:"100%", padding:"5px 8px", border:"1px solid #d4b896", borderRadius:"4px",
                  fontSize:"11px", color:"#3b1f0a", background:"#faf6f1", boxSizing:"border-box", outline:"none" }} />
            </div>
            <div>
              <div style={{ fontSize:"9px", color:"#a08060", marginBottom:"2px" }}>완료일</div>
              <input type="date" value={form.완료일} onChange={e=>setForm(p=>({...p,완료일:e.target.value}))}
                style={{ width:"100%", padding:"5px 8px", border:"1px solid #d4b896", borderRadius:"4px",
                  fontSize:"11px", color:"#3b1f0a", background:"#faf6f1", boxSizing:"border-box", outline:"none" }} />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <div style={{ fontSize:"9px", color:"#a08060", marginBottom:"2px" }}>Review / 특이사항</div>
              <textarea value={form.리뷰} onChange={e=>setForm(p=>({...p,리뷰:e.target.value}))}
                placeholder="진행 특이사항, 결과 등" rows={2}
                style={{ width:"100%", padding:"5px 8px", border:"1px solid #d4b896", borderRadius:"4px",
                  fontSize:"11px", color:"#3b1f0a", background:"#faf6f1", boxSizing:"border-box",
                  resize:"vertical", fontFamily:"inherit", outline:"none" }} />
            </div>
          </div>
          <div style={{ display:"flex", gap:"6px", justifyContent:"flex-end" }}>
            <button onClick={()=>{ setShowForm(false); setForm(EMPTY_FORM); setEditIdx(null); }}
              style={{ padding:"5px 14px", background:"#e8d5c0", border:"none", borderRadius:"10px",
                fontSize:"11px", color:"#6b4226", cursor:"pointer", fontWeight:"600" }}>취소</button>
            <button onClick={saveTask}
              style={{ padding:"5px 16px", background:partColor, border:"none", borderRadius:"10px",
                fontSize:"11px", color:"#fff", cursor:"pointer", fontWeight:"700" }}>
              {editIdx !== null ? "수정 저장" : "등록"}
            </button>
          </div>
        </div>
      )}

      {/* 업무 목록 */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 18px", position:"relative" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", color:"#c4a882", fontSize:"12px", marginTop:"40px" }}>
            {filterState === "전체" ? "등록된 업무가 없습니다" : `${filterState} 업무가 없습니다`}
          </div>
        )}
        {[...filtered].reverse().map((t, fi) => {
          const realIdx = tasks.indexOf(t);
          const es = effectiveState(t);
          const bc = 상태색[es] || "#8b6a4a";
          const bg = 상태배경[es] || "#f0e6d8";
          const logCount = (t.이력||[]).length;
          return (
            <div key={fi}
              onClick={() => setDetailIdx(realIdx)}
              style={{ background:"#ffffff", border:"1px solid #d4b896",
                borderLeft:`3px solid ${bc}`, borderRadius:"5px", padding:"9px 11px", marginBottom:"7px",
                cursor:"pointer", transition:"box-shadow 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow="0 2px 8px #c4a88244"}
              onMouseLeave={e => e.currentTarget.style.boxShadow="none"}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"4px" }}>
                <div style={{ fontSize:"12px", fontWeight:"600", color:"#3b1f0a", flex:1, lineHeight:"1.4", marginRight:"6px" }}>
                  <span style={{ color:"#c4a882", fontWeight:"700", marginRight:"5px", fontSize:"11px" }}>#{realIdx+1}</span>
                  {t.업무}
                </div>
                <div style={{ display:"flex", gap:"4px", flexShrink:0 }} onClick={e=>e.stopPropagation()}>
                  {logCount > 0 && (
                    <span style={{ padding:"2px 6px", background:"#f0e6d8", borderRadius:"6px",
                      fontSize:"10px", color:"#8b5e3c", fontWeight:"700" }}>이력 {logCount}</span>
                  )}
                  <button onClick={e=>{ e.stopPropagation(); startEdit(realIdx); }}
                    style={{ padding:"2px 6px", background:"#f0e6d8", border:"none", borderRadius:"6px",
                      fontSize:"10px", color:"#8b5e3c", cursor:"pointer", fontWeight:"600" }}>수정</button>
                  <button onClick={e=>{ e.stopPropagation(); deleteTask(realIdx); }}
                    style={{ padding:"2px 6px", background:"#fdf0eb", border:"none", borderRadius:"6px",
                      fontSize:"9px", color:"#c0703a", cursor:"pointer", fontWeight:"600" }}>삭제</button>
                </div>
              </div>
              <div style={{ display:"flex", gap:"5px", flexWrap:"wrap", marginBottom: t.리뷰 ? "4px" : "0" }}>
                {t.요청부서 && <span style={{ fontSize:"9px", background:"#f0e6d8", color:"#8b5e3c", padding:"1px 6px", borderRadius:"8px" }}>{t.요청부서}</span>}
                {t.접수일 && <span style={{ fontSize:"9px", color:"#a08060" }}>접수 {t.접수일}</span>}
                {t.목표일 && <span style={{ fontSize:"9px", color:"#a08060" }}>목표 {t.목표일}</span>}
                {t.완료일 && <span style={{ fontSize:"9px", color:"#4a7c59" }}>완료 {t.완료일}</span>}
                {t.상태 && <span style={{ fontSize:"9px", fontWeight:"700",
                  color:bc, background:bg, padding:"1px 6px", borderRadius:"8px" }}>{es}</span>}
              </div>
              {t.리뷰 && <div style={{ fontSize:"10px", color:"#7a5c40", lineHeight:"1.4", marginTop:"3px" }}>{t.리뷰}</div>}
              <div style={{ fontSize:"9px", color:"#c4a882", marginTop:"4px" }}>클릭하여 상세 이력 보기 →</div>
            </div>
          );
        })}
      </div>

      {/* ── 이력 모달 ── */}
      {detailIdx !== null && tasks[detailIdx] && (
        <DetailModal
          task={tasks[detailIdx]}
          taskIdx={detailIdx}
          partColor={partColor}
          onClose={() => setDetailIdx(null)}
          onChangeStatus={(idx, s) => { changeStatus(idx, s); setDetailIdx(null); }}
          onAddLog={(idx, memo) => { addLog(idx, memo); setDetailIdx(null); }}
        />
      )}

    </div>
  );
}

// ── 팀장 요청사항 컴포넌트 ─────────────────────────────────────────────
function ReqSection({ name, reqData, setReqData, partColor }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const text = reqData[name] || "";

  const startEdit = () => { setDraft(text); setEditing(true); };
  const save = () => {
    setReqData(prev => ({ ...prev, [name]: draft }));
    setEditing(false);
  };

  if (!text.trim() && !editing) return (
    <div style={{ marginBottom:"8px" }}>
      <button onClick={startEdit}
        style={{ fontSize:"9px", color:"#d4842a", background:"none", border:"1px dashed #e8a44a",
          borderRadius:"4px", padding:"3px 10px", cursor:"pointer" }}>
        + 팀장 요청사항 추가
      </button>
    </div>
  );

  return (
    <div style={{ background:"#fff3e0", border:"1px solid #e8a44a", borderLeft:"3px solid #d4842a",
      borderRadius:"5px", padding:"8px 12px", marginBottom:"8px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"5px" }}>
        <div style={{ fontSize:"9px", color:"#b8650a", fontWeight:"700", display:"flex", alignItems:"center", gap:"4px" }}>
          <span>📋</span> 팀장 요청사항
        </div>
        {!editing ? (
          <button onClick={startEdit}
            style={{ fontSize:"9px", color:"#d4842a", background:"#ffe0b2", border:"none",
              borderRadius:"6px", padding:"2px 8px", cursor:"pointer", fontWeight:"600" }}>수정</button>
        ) : (
          <div style={{ display:"flex", gap:"4px" }}>
            <button onClick={() => setEditing(false)}
              style={{ fontSize:"9px", color:"#8b6a4a", background:"#e8d5c0", border:"none",
                borderRadius:"6px", padding:"2px 8px", cursor:"pointer", fontWeight:"600" }}>취소</button>
            <button onClick={save}
              style={{ fontSize:"9px", color:"#fff", background:partColor, border:"none",
                borderRadius:"6px", padding:"2px 8px", cursor:"pointer", fontWeight:"700" }}>저장</button>
          </div>
        )}
      </div>
      {!editing ? (
        <div style={{ fontSize:"10px", color:"#5a3a0a", lineHeight:"1.8" }}>
          {text.trim().split("\n").filter(l => l.trim()).map((line, i) => (
            <div key={i} style={{ display:"flex", gap:"5px", marginBottom:"2px" }}>
              <span style={{ color:"#d4842a", fontWeight:"700", flexShrink:0, minWidth:"14px" }}>{i+1}.</span>
              <span>{line.trim()}</span>
            </div>
          ))}
        </div>
      ) : (
        <textarea value={draft} onChange={e => setDraft(e.target.value)}
          rows={5}
          style={{ width:"100%", padding:"6px 8px", border:"1px solid #e8a44a", borderRadius:"4px",
            fontSize:"10px", color:"#3b1f0a", background:"#fffaf5", resize:"vertical",
            boxSizing:"border-box", fontFamily:"inherit", outline:"none", lineHeight:"1.7" }} />
      )}
    </div>
  );
}


// ── 결과물 모달 컴포넌트 ──────────────────────────────────────────────────
const RESULT_GROUPS = {
  전략: [
    { label:"예측기반 타겟점검", match: t => t.includes("예측기반") || t.includes("타겟점검") || t.includes("전기공종 타겟") || t.includes("레미콘") },
    { label:"건설 DX",          match: t => t.includes("건설 DX") || t.includes("I-QMS") },
    { label:"소송핵심관리",     match: t => t.includes("준공도서") || t.includes("소송핵심") || t.includes("소송대응") || t.includes("전기·통신") },
  ],
  업무: [
    { label:"하자비용 저감",    match: t => t.includes("골조") || t.includes("타일") },
    { label:"BS 하자 개선",     match: t => t.includes("BS하자") },
    { label:"고객불만율 관리",  match: t => t.includes("고객") || t.includes("VOC") || t.includes("홈케어") || t.includes("아이파크") || t.includes("SNS") },
  ],
  개인: [
    { label:"개인 목표", match: () => true },
  ],
};

function ResultModal({ cat, allData, onClose }) {
  const color = cat==="전략"?"#8b5e3c":cat==="업무"?"#6b4226":"#a0785a";
  const groups = RESULT_GROUPS[cat];
  const [activeGroup, setActiveGroup] = useState("all");
  // 묶기 상태: { groupIdx: [ [idx들], [idx들], ... ] }
  const [mergedMap, setMergedMap] = useState({});
  // 선택된 체크박스
  const [selected, setSelected] = useState([]);
  // 편집 중인 merged 결과물 텍스트
  const [editMerge, setEditMerge] = useState({});

  const allRows = [];
  Object.entries(MEMBERS).forEach(([pk, pd]) => {
    (allData[pk]||[]).forEach(m => {
      m.goals.filter(g => g.cat === cat && g.배점 > 0).forEach(g => {
        allRows.push({ part: pd.label.replace(" 파트",""), partColor: pd.color,
          name: m.name, 과제: g.과제, 배점: g.배점, 결과: g.결과||"" });
      });
    });
  });

  const getRows = (g) => allRows.filter(r => g.match(r.과제));
  const getTotal = (g) => new Set(getRows(g).map(r => r.name)).size;

  // 묶기 처리된 행 목록 반환
  const getMergedRows = (gi) => {
    const rows = getRows(groups[gi]).filter(r => r.결과.trim());
    const merged = mergedMap[gi] || [];
    const usedIdx = new Set(merged.flat());
    const result = [];
    // 묶인 그룹들
    merged.forEach((idxArr, mi) => {
      const members = idxArr.map(i => rows[i]);
      result.push({
        type: "merged",
        mi,
        gi,
        members,
        text: editMerge[`${gi}_${mi}`] !== undefined ? editMerge[`${gi}_${mi}`] : members[0].결과,
      });
    });
    // 묶이지 않은 개별 행
    rows.forEach((r, i) => {
      if (!usedIdx.has(i)) {
        result.push({ type: "single", idx: i, gi, row: r });
      }
    });
    return result;
  };

  const getDoneCount = (g, gi) => {
    if (!getRows(g).filter(r=>r.결과.trim()).length) return 0;
    return getMergedRows(gi).length;
  };

  const handleMerge = (gi) => {
    if (selected.filter(s=>s.gi===gi).length < 2) return;
    const idxArr = selected.filter(s=>s.gi===gi).map(s=>s.idx);
    setMergedMap(prev => ({
      ...prev,
      [gi]: [...(prev[gi]||[]), idxArr]
    }));
    setSelected(prev => prev.filter(s=>s.gi!==gi));
  };

  const handleUnmerge = (gi, mi) => {
    setMergedMap(prev => {
      const arr = [...(prev[gi]||[])];
      arr.splice(mi, 1);
      return { ...prev, [gi]: arr };
    });
    setEditMerge(prev => { const n={...prev}; delete n[`${gi}_${mi}`]; return n; });
  };

  const toggleSelect = (gi, idx) => {
    setSelected(prev => {
      const exists = prev.find(s=>s.gi===gi&&s.idx===idx);
      if (exists) return prev.filter(s=>!(s.gi===gi&&s.idx===idx));
      return [...prev, {gi, idx}];
    });
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(59,26,10,0.5)", zIndex:2000,
      display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={onClose}>
      <div style={{ background:"#faf6f1", borderRadius:"12px", width:"640px", maxWidth:"94vw",
        maxHeight:"88vh", display:"flex", flexDirection:"column", boxShadow:"0 10px 40px rgba(91,51,23,0.3)" }}
        onClick={e => e.stopPropagation()}>

        {/* 헤더 */}
        <div style={{ padding:"14px 20px", background:color, borderRadius:"12px 12px 0 0",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.7)", letterSpacing:"1px", marginBottom:"1px" }}>2026 품질팀</div>
            <div style={{ fontSize:"15px", fontWeight:"700", color:"#fff" }}>
              {cat==="전략"?"전략":cat==="업무"?"업무":"개인"} 목표 결과물(승인본)
            </div>
          </div>
          <button onClick={onClose}
            style={{ background:"none", border:"none", fontSize:"20px", color:"rgba(255,255,255,0.8)", cursor:"pointer" }}>✕</button>
        </div>

        {/* 그룹 버튼 */}
        <div style={{ padding:"12px 20px 10px", borderBottom:"1px solid #d4b896", display:"flex", gap:"8px", flexWrap:"wrap" }}>
          {groups.map((g, gi) => {
            const done  = getDoneCount(g, gi);
            const total = getTotal(g);
            const isActive = activeGroup === gi;
            return (
              <button key={gi} onClick={() => setActiveGroup(isActive ? "all" : gi)}
                style={{ display:"flex", alignItems:"center", gap:"5px", padding:"6px 14px",
                  background: isActive ? color : "#fff",
                  border: `1.5px solid ${isActive ? color : "#d4b896"}`,
                  borderRadius:"20px", cursor:"pointer", transition:"all 0.15s",
                  color: isActive ? "#fff" : "#5c3317", fontWeight:"600", fontSize:"12px" }}>
                {g.label}
                <span style={{ background: isActive?"rgba(255,255,255,0.3)":color+"18",
                  color: isActive?"#fff":color,
                  fontSize:"10px", fontWeight:"800", padding:"1px 7px", borderRadius:"10px",
                  border: isActive?"none":`1px solid ${color}40` }}>
                  {done}<span style={{ fontSize:"9px", fontWeight:"500", opacity:0.8 }}>/{total}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* 본문 */}
        <div style={{ flex:1, overflowY:"auto", padding:"14px 20px" }}>
          {groups.map((g, gi) => {
            const isHighlight = activeGroup === gi || activeGroup === "all";
            if (activeGroup !== "all" && activeGroup !== gi) return null;
            const mergedRows = getMergedRows(gi);
            const hasResult = mergedRows.length > 0;
            const selForGroup = selected.filter(s=>s.gi===gi);

            return (
              <div key={gi} style={{ marginBottom:"16px", opacity: !isHighlight ? 0.35 : 1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"7px" }}>
                  <div style={{ width:"3px", height:"14px", background: activeGroup===gi?color:"#c4a882", borderRadius:"2px" }} />
                  <span style={{ fontSize:"12px", fontWeight:"700", color: activeGroup===gi?color:"#8b6a4a" }}>{g.label}</span>
                  {selForGroup.length >= 2 && (
                    <button onClick={() => handleMerge(gi)}
                      style={{ padding:"2px 10px", background:color, border:"none", borderRadius:"10px",
                        fontSize:"10px", color:"#fff", cursor:"pointer", fontWeight:"700" }}>
                      ✂ {selForGroup.length}개 묶기
                    </button>
                  )}
                  {selForGroup.length === 1 && (
                    <span style={{ fontSize:"10px", color:"#a08060" }}>하나 더 선택하면 묶기 가능</span>
                  )}
                </div>

                {!hasResult ? (
                  <div style={{ fontSize:"11px", color:"#c4a882", padding:"8px 0" }}>결과물 없음</div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                    {mergedRows.map((item, ii) => {
                      if (item.type === "merged") {
                        const editKey = `${gi}_${item.mi}`;
                        const isEditing = editMerge[editKey] !== undefined;
                        return (
                          <div key={ii} style={{ background:"#fff8f0", border:`1.5px solid ${color}`,
                            borderLeft:`4px solid ${color}`, borderRadius:"6px", padding:"10px 12px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"5px", marginBottom:"6px", flexWrap:"wrap" }}>
                              <span style={{ fontSize:"9px", color:"#fff", background:color,
                                padding:"1px 7px", borderRadius:"8px", fontWeight:"700" }}>
                                {item.members.length}명 묶음
                              </span>
                              {item.members.map((m,mi) => (
                                <span key={mi} style={{ display:"flex", alignItems:"center", gap:"3px" }}>
                                  <span style={{ fontSize:"9px", fontWeight:"700", color:m.partColor,
                                    background:m.partColor+"18", padding:"1px 5px", borderRadius:"5px" }}>{m.part}</span>
                                  <span style={{ fontSize:"11px", fontWeight:"600", color:"#3b1f0a" }}>{m.name}</span>
                                </span>
                              ))}
                              <button onClick={() => handleUnmerge(gi, item.mi)}
                                style={{ marginLeft:"auto", padding:"1px 8px", background:"#fdf0eb",
                                  border:"none", borderRadius:"8px", fontSize:"9px",
                                  color:"#c0703a", cursor:"pointer", fontWeight:"600" }}>묶기 해제</button>
                            </div>
                            {isEditing ? (
                              <div>
                                <textarea value={editMerge[editKey]}
                                  onChange={e => setEditMerge(prev=>({...prev,[editKey]:e.target.value}))}
                                  rows={3}
                                  style={{ width:"100%", padding:"6px 8px", border:`1px solid ${color}`,
                                    borderRadius:"4px", fontSize:"11px", color:"#3b1f0a",
                                    background:"#fff", resize:"vertical", boxSizing:"border-box",
                                    fontFamily:"inherit", outline:"none" }} />
                                <div style={{ display:"flex", justifyContent:"flex-end", gap:"6px", marginTop:"4px" }}>
                                  <button onClick={() => setEditMerge(prev=>{const n={...prev};delete n[editKey];return n;})}
                                    style={{ padding:"3px 10px", background:"#e8d5c0", border:"none",
                                      borderRadius:"7px", fontSize:"10px", color:"#6b4226", cursor:"pointer" }}>취소</button>
                                  <button onClick={() => setEditMerge(prev=>({...prev,[editKey]:prev[editKey]}))}
                                    style={{ padding:"3px 10px", background:color, border:"none",
                                      borderRadius:"7px", fontSize:"10px", color:"#fff", cursor:"pointer", fontWeight:"700" }}>저장</button>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display:"flex", gap:"8px", alignItems:"flex-start" }}>
                                <div style={{ flex:1, fontSize:"11px", color:"#5c3317", lineHeight:"1.6",
                                  fontWeight:"500", background:"#fff", border:"1px solid #e8d5c0",
                                  borderRadius:"4px", padding:"6px 9px" }}>
                                  {item.text}
                                </div>
                                <button onClick={() => setEditMerge(prev=>({...prev,[editKey]:item.text}))}
                                  style={{ padding:"3px 9px", background:"#f0e6d8", border:"none",
                                    borderRadius:"7px", fontSize:"10px", color:"#8b5e3c",
                                    cursor:"pointer", fontWeight:"600", flexShrink:0 }}>편집</button>
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        // 개별 카드
                        const isSelected = selForGroup.some(s=>s.idx===item.idx);
                        return (
                          <div key={ii}
                            onClick={() => toggleSelect(gi, item.idx)}
                            style={{ background: isSelected?"#f5ede4":"#faf6f1",
                              border:`1.5px solid ${isSelected?color:"#e8d5c0"}`,
                              borderLeft:`3px solid ${isSelected?color:"#c4a882"}`,
                              borderRadius:"6px", padding:"9px 12px", cursor:"pointer",
                              transition:"all 0.15s" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"5px", marginBottom:"5px" }}>
                              <input type="checkbox" checked={isSelected} readOnly
                                style={{ cursor:"pointer", accentColor:color }} />
                              <span style={{ fontSize:"9px", fontWeight:"700", color:item.row.partColor,
                                background:item.row.partColor+"18", padding:"1px 5px", borderRadius:"5px" }}>{item.row.part}</span>
                              <span style={{ fontSize:"12px", fontWeight:"700", color:"#3b1f0a" }}>{item.row.name}</span>
                              <span style={{ fontSize:"9px", color:"#a08060", marginLeft:"auto" }}>{item.row.과제}</span>
                            </div>
                            <div style={{ fontSize:"11px", color:"#5c3317", lineHeight:"1.6",
                              fontWeight:"500", background:"#fff", border:"1px solid #e8d5c0",
                              borderRadius:"4px", padding:"6px 9px" }}>
                              {item.row.결과}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// ── 이력 상세 모달 컴포넌트 ──────────────────────────────────────────────
function DetailModal({ task: t, taskIdx, partColor, onClose, onChangeStatus, onAddLog }) {
  const [logMemo, setLogMemo] = useState("");
  const bc = 상태색[t.상태] || "#8b6a4a";
  const bg = 상태배경[t.상태] || "#f0e6d8";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(59,26,10,0.45)", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={onClose}>
      <div style={{ background:"#faf6f1", borderRadius:"10px", width:"520px", maxWidth:"92vw",
        maxHeight:"82vh", display:"flex", flexDirection:"column", boxShadow:"0 8px 32px rgba(91,51,23,0.28)" }}
        onClick={e => e.stopPropagation()}>

        {/* 모달 헤더 */}
        <div style={{ padding:"16px 20px", borderBottom:"1px solid #d4b896", background:"#f0e6d8",
          borderRadius:"10px 10px 0 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ flex:1, marginRight:"10px" }}>
            <div style={{ fontSize:"14px", fontWeight:"700", color:"#3b1f0a", marginBottom:"7px", lineHeight:"1.5" }}>{t.업무}</div>
            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
              {t.요청부서 && <span style={{ fontSize:"9px", background:"#e8d5c0", color:"#8b5e3c", padding:"2px 7px", borderRadius:"8px" }}>{t.요청부서}</span>}
              {t.접수일 && <span style={{ fontSize:"9px", color:"#a08060" }}>접수 {t.접수일}</span>}
              {t.목표일 && <span style={{ fontSize:"9px", color:"#a08060" }}>목표 {t.목표일}</span>}
              {t.완료일 && <span style={{ fontSize:"9px", color:"#4a7c59" }}>완료 {t.완료일}</span>}
              <span style={{ fontSize:"9px", fontWeight:"700", color:bc, background:bg, padding:"2px 7px", borderRadius:"8px" }}>{t.상태}</span>
            </div>
          </div>
          <button onClick={onClose}
            style={{ background:"none", border:"none", fontSize:"20px", color:"#a08060", cursor:"pointer", padding:"0 2px", lineHeight:1, flexShrink:0 }}>✕</button>
        </div>

        {/* 상태 빠른 변경 */}
        <div style={{ padding:"10px 20px", borderBottom:"1px solid #ede0d0", background:"#fff8f2",
          display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
          <span style={{ fontSize:"10px", color:"#8b6a4a", fontWeight:"600", whiteSpace:"nowrap" }}>상태 변경</span>
          <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
            {상태목록.map(s => (
              <button key={s} onClick={() => onChangeStatus(taskIdx, s)}
                style={{ padding:"3px 10px", border:"none", borderRadius:"10px", cursor:"pointer",
                  fontSize:"10px", fontWeight: t.상태===s ? "700":"400",
                  background: t.상태===s ? (상태색[s]||"#8b6a4a") : (상태배경[s]||"#f0e6d8"),
                  color: t.상태===s ? "#fff" : (상태색[s]||"#8b6a4a"),
                  outline: t.상태===s ? `2px solid ${상태색[s]||"#8b6a4a"}` : "none" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 이력 타임라인 */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
          <div style={{ fontSize:"10px", color:"#8b5e3c", fontWeight:"700", marginBottom:"12px", letterSpacing:"1px", textTransform:"uppercase" }}>
            진행 이력 {(t.이력||[]).length > 0 ? `(${(t.이력||[]).length}건)` : ""}
          </div>

          {(!t.이력 || t.이력.length === 0) && (
            <div style={{ fontSize:"11px", color:"#c4a882", textAlign:"center", padding:"24px 0" }}>
              아직 이력이 없습니다.<br/>아래에서 메모를 추가해보세요.
            </div>
          )}

          {(t.이력||[]).map((log, li) => {
            const dotColor = log.변경후상태==="완료" ? "#4a7c59" : log.변경후상태==="진행중" ? "#b8860b" : 상태색[log.변경후상태]||"#8b5e3c";
            const isLast = li === (t.이력||[]).length - 1;
            return (
              <div key={li} style={{ display:"flex", gap:"12px", marginBottom:"10px" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0, width:"10px" }}>
                  <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:dotColor, marginTop:"4px", flexShrink:0 }} />
                  {!isLast && <div style={{ width:"2px", flex:1, background:"#d4b896", marginTop:"3px" }} />}
                </div>
                <div style={{ flex:1, background:"#ffffff", border:"1px solid #ede0d0", borderRadius:"6px",
                  padding:"9px 12px", marginBottom:"2px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4px", flexWrap:"wrap", gap:"4px" }}>
                    <div style={{ display:"flex", gap:"5px", alignItems:"center" }}>
                      {log.변경전상태 && log.변경전상태 !== log.변경후상태 && (
                        <>
                          <span style={{ fontSize:"9px", fontWeight:"700",
                            color:상태색[log.변경전상태]||"#8b6a4a",
                            background:상태배경[log.변경전상태]||"#f0e6d8",
                            padding:"1px 7px", borderRadius:"6px" }}>{log.변경전상태}</span>
                          <span style={{ fontSize:"10px", color:"#a08060" }}>→</span>
                        </>
                      )}
                      <span style={{ fontSize:"9px", fontWeight:"700",
                        color:상태색[log.변경후상태]||"#8b6a4a",
                        background:상태배경[log.변경후상태]||"#f0e6d8",
                        padding:"1px 7px", borderRadius:"6px" }}>{log.변경후상태||"등록"}</span>
                    </div>
                    <span style={{ fontSize:"9px", color:"#b0907a" }}>{log.시각}</span>
                  </div>
                  {log.메모 && <div style={{ fontSize:"11px", color:"#5a3e28", lineHeight:"1.6" }}>{log.메모}</div>}
                </div>
              </div>
            );
          })}

          {/* 메모 추가 영역 */}
          <div style={{ marginTop:"14px", background:"#f5ede4", border:"1px solid #c4a882", borderRadius:"7px", padding:"12px 14px" }}>
            <div style={{ fontSize:"10px", color:"#8b5e3c", fontWeight:"700", marginBottom:"7px" }}>+ 이력 메모 추가</div>
            <textarea
              value={logMemo}
              onChange={e => setLogMemo(e.target.value)}
              placeholder="진행 상황, 특이사항, 협의 내용 등을 자유롭게 입력하세요"
              rows={3}
              style={{ width:"100%", padding:"7px 9px", border:"1px solid #c4a882", borderRadius:"5px",
                fontSize:"11px", color:"#3b1f0a", background:"#fff", resize:"vertical",
                boxSizing:"border-box", fontFamily:"inherit", outline:"none", lineHeight:"1.6" }} />
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"7px" }}>
              <button
                onClick={() => { if (logMemo.trim()) { onAddLog(taskIdx, logMemo); setLogMemo(""); } }}
                style={{ padding:"5px 16px", background: logMemo.trim() ? partColor : "#c4a882",
                  border:"none", borderRadius:"10px", fontSize:"11px", color:"#fff",
                  cursor: logMemo.trim() ? "pointer" : "default", fontWeight:"700", transition:"background 0.2s" }}>
                메모 저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bar({ rate, color, height="5px" }) {
  return (
    <div style={{ height, background:"#d4b896", borderRadius:"3px", overflow:"hidden", marginTop:"4px" }}>
      <div style={{ height:"100%", width:`${Math.min(rate,100)}%`, background:color||rateColor(rate), borderRadius:"3px", transition:"width 0.5s" }} />
    </div>
  );
}

// ── 대시보드 컴포넌트 ─────────────────────────────────────────────────────
function Dashboard({ allData, allWork, onNavigate }) {
  const partKeys = Object.keys(MEMBERS);
  const rc = (r) => r>=80?"#4a7c59":r>=50?"#b8860b":"#c0703a";

  const MiniBar = ({ rate, color, width=80 }) => (
    <div style={{ display:"flex", alignItems:"center", gap:"3px" }}>
      <div style={{ width:`${width}px`, height:"5px", background:"#e8d5c0", borderRadius:"2px", overflow:"hidden", flexShrink:0 }}>
        <div style={{ height:"100%", width:`${Math.min(rate,100)}%`, background:color, borderRadius:"2px" }} />
      </div>
      <span style={{ fontSize:"9px", fontWeight:"700", color, minWidth:"26px" }}>{rate}%</span>
    </div>
  );

  // 통합 컬럼: 이름 | 전략 업무 개인 진행률 달성률 | 완료 미완료 완료율 변경일
  const COLS = "64px 1fr 1fr 1fr 1fr 1fr 6px 1fr 1fr 1fr 1fr";

  const PartSection = ({ pk, rowH=30 }) => {
    const pd = MEMBERS[pk];
    const pm = allData[pk];
    const avgRate = Math.round(pm.reduce((s,m)=>s+calcRate(m.goals),0)/pm.length);
    const allT  = pm.reduce((s,m)=>s+(allWork[m.name]||[]).length,0);
    const allD  = pm.reduce((s,m)=>s+(allWork[m.name]||[]).filter(t=>t.상태==="완료").length,0);
    const allU  = allT-allD;
    const allWR = allT>0?Math.round((allD/allT)*100):0;

    return (
      <div style={{ background:"#fff", border:"1px solid #d4b896", borderRadius:"8px", overflow:"hidden", marginBottom:"6px" }}>
        {/* 파트 헤더 */}
        <div style={{ display:"grid", gridTemplateColumns:COLS, background:pd.color,
          padding:"0 8px", height:"28px", alignItems:"center" }}>
          <div style={{ fontSize:"11px", color:"#fff", fontWeight:"700" }}>{pd.label}</div>
          {/* 목표 */}
          <div style={{ textAlign:"center", fontSize:"8px", color:"rgba(255,255,255,0.8)" }}>전략</div>
          <div style={{ textAlign:"center", fontSize:"8px", color:"rgba(255,255,255,0.8)" }}>업무</div>
          <div style={{ textAlign:"center", fontSize:"8px", color:"rgba(255,255,255,0.8)" }}>개인</div>
          <div style={{ fontSize:"8px", color:"rgba(255,255,255,0.8)", paddingLeft:"2px" }}>진행률</div>
          <div style={{ textAlign:"center", fontSize:"8px", color:"rgba(255,255,255,0.8)" }}>달성률</div>
          {/* 구분 */}
          <div style={{ borderLeft:"1px solid rgba(255,255,255,0.3)", height:"16px" }} />
          {/* 업무 */}
          <div style={{ textAlign:"center", fontSize:"8px", color:"rgba(255,255,255,0.8)" }}>완료</div>
          <div style={{ textAlign:"center", fontSize:"8px", color:"rgba(255,255,255,0.8)" }}>미완료</div>
          <div style={{ fontSize:"8px", color:"rgba(255,255,255,0.8)", paddingLeft:"2px" }}>완료율</div>
          <div style={{ textAlign:"center", fontSize:"8px", color:"rgba(255,255,255,0.8)" }}>변경일</div>
        </div>

        {/* 개인별 행 */}
        {pm.map((m, mi) => {
          const r = calcRate(m.goals);
          const tasks = allWork[m.name]||[];
          const total = tasks.length;
          const done  = tasks.filter(t=>t.상태==="완료").length;
          const und   = total-done;
          const wr    = total>0?Math.round((done/total)*100):0;
          const wc    = rc(wr);
          const undColor = und===0?"#4a7c59":und<=3?"#b8860b":"#c0703a";
          const lastDate = (()=>{const wl="완료일",al="접수일",t=tasks.filter(x=>x[wl]||x[al]).sort((a,b)=>(b[wl]||b[al]||"").localeCompare(a[wl]||a[al]||""))[0];return t?(t[wl]||t[al]||"").slice(5):"-";})();

          return (
            <div key={m.name} onClick={() => onNavigate(pk, mi)}
              onMouseEnter={e=>e.currentTarget.style.background="#f5ede4"}
              onMouseLeave={e=>e.currentTarget.style.background=mi%2===0?"#fff":"#fdf8f4"}
              style={{ display:"grid", gridTemplateColumns:COLS, padding:"0 8px",
                height:`${rowH}px`, borderTop:"1px solid #f0e8e0",
                background:mi%2===0?"#fff":"#fdf8f4", alignItems:"center", cursor:"pointer" }}>
              <div style={{ fontSize:"11px", fontWeight:"600", color:"#3b1f0a",
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.name}</div>
              {/* 목표 */}
              <div style={{ textAlign:"center", fontSize:"10px", color:"#8b5e3c", fontWeight:"600" }}>{m.전략}%</div>
              <div style={{ textAlign:"center", fontSize:"10px", color:"#6b4226", fontWeight:"600" }}>{m.업무}%</div>
              <div style={{ textAlign:"center", fontSize:"10px", color:"#a0785a", fontWeight:"600" }}>{m.개인}%</div>
              <div style={{ paddingLeft:"2px" }}><MiniBar rate={r} color={rc(r)} /></div>
              <div style={{ textAlign:"center" }}>
                <span style={{ fontSize:"12px", fontWeight:"900", color:rc(r) }}>{r}<span style={{ fontSize:"9px" }}>%</span></span>
              </div>
              {/* 구분 */}
              <div style={{ borderLeft:"1px solid #e8d5c0", height:"18px" }} />
              {/* 업무 */}
              <div style={{ textAlign:"center", fontSize:"11px", fontWeight:"700", color:"#4a7c59" }}>{done}</div>
              <div style={{ textAlign:"center" }}>
                <span style={{ fontSize:und>9?"14px":und>0?"12px":"11px", fontWeight:"900", color:undColor }}>{und}</span>
              </div>
              <div style={{ paddingLeft:"2px" }}><MiniBar rate={wr} color={wc} /></div>
              <div style={{ textAlign:"center", fontSize:"9px", color:"#a08060" }}>{lastDate}</div>
            </div>
          );
        })}

        {/* 합계/평균 행 */}
        <div style={{ display:"grid", gridTemplateColumns:COLS, padding:"0 8px", height:"24px",
          background:pd.color+"18", borderTop:`1px solid ${pd.color}40`, alignItems:"center" }}>
          <div style={{ fontSize:"10px", fontWeight:"700", color:pd.color }}>평균/합계</div>
          <div style={{ textAlign:"center", fontSize:"8px", color:"#bbb" }}>-</div>
          <div style={{ textAlign:"center", fontSize:"8px", color:"#bbb" }}>-</div>
          <div style={{ textAlign:"center", fontSize:"8px", color:"#bbb" }}>-</div>
          <div style={{ paddingLeft:"2px" }}><MiniBar rate={avgRate} color={pd.color} /></div>
          <div style={{ textAlign:"center" }}>
            <span style={{ fontSize:"11px", fontWeight:"900", color:rc(avgRate) }}>{avgRate}<span style={{ fontSize:"8px" }}>%</span></span>
          </div>
          <div style={{ borderLeft:"1px solid #e8d5c0", height:"14px" }} />
          <div style={{ textAlign:"center", fontSize:"10px", fontWeight:"800", color:"#4a7c59" }}>{allD}</div>
          <div style={{ textAlign:"center" }}>
            <span style={{ fontSize:allU>9?"13px":"11px", fontWeight:"900",
              color:allU===0?"#4a7c59":allU<=5?"#b8860b":"#c0703a" }}>{allU}</span>
          </div>
          <div style={{ paddingLeft:"2px" }}><MiniBar rate={allWR} color={rc(allWR)} /></div>
          <div style={{ textAlign:"center", fontSize:"9px", color:"#8b6a4a" }}>-</div>
        </div>
      </div>
    );
  };

  // 전체 요약
  const totalMembers = partKeys.reduce((s,p)=>s+allData[p].length,0);
  const totalRate = Math.round(partKeys.reduce((s,p)=>s+allData[p].reduce((ss,m)=>ss+calcRate(m.goals),0),0)/totalMembers);
  const totAll  = partKeys.reduce((s,p)=>s+allData[p].reduce((ss,m)=>ss+(allWork[m.name]||[]).length,0),0);
  const totDone = partKeys.reduce((s,p)=>s+allData[p].reduce((ss,m)=>ss+(allWork[m.name]||[]).filter(t=>t.상태==="완료").length,0),0);
  const totUnd  = totAll-totDone;
  const wRate   = totAll>0?Math.round((totDone/totAll)*100):0;

  return (
    <div style={{ width:"100%", height:"100%", overflow:"hidden", display:"flex", flexDirection:"column", background:"#faf6f1", boxSizing:"border-box" }}>

      {/* 상단 요약: 팀목표 달성현황(좌) / 개인업무현황(우) */}
      <div style={{ display:"flex", gap:"0", padding:"8px 16px 6px", flexShrink:0, alignItems:"stretch" }}>

        {/* 팀 목표 달성현황 */}
        <div style={{ flex:1, display:"flex", gap:"6px", alignItems:"center", paddingRight:"12px" }}>
          <div style={{ background:"linear-gradient(135deg,#5c3317,#8b5e3c)", borderRadius:"8px",
            padding:"8px 12px", color:"#fff", display:"flex", flexDirection:"column", justifyContent:"center", minWidth:"90px" }}>
            <div style={{ fontSize:"8px", color:"#f5d5b5", marginBottom:"1px" }}>팀 목표달성률</div>
            <div style={{ fontSize:"22px", fontWeight:"900", lineHeight:1 }}>{totalRate}<span style={{ fontSize:"10px" }}>%</span></div>
            <div style={{ fontSize:"8px", color:"#f5d5b5", marginTop:"1px" }}>총 {totalMembers}명</div>
          </div>
          {partKeys.map(pk => {
            const pd = MEMBERS[pk];
            const pm = allData[pk];
            const avg = Math.round(pm.reduce((s,m)=>s+calcRate(m.goals),0)/pm.length);
            const pAll  = pm.reduce((s,m)=>s+(allWork[m.name]||[]).length,0);
            const pDone = pm.reduce((s,m)=>s+(allWork[m.name]||[]).filter(t=>t.상태==="완료").length,0);
            const pUnd  = pAll-pDone;
            const pWR   = pAll>0?Math.round((pDone/pAll)*100):0;
            return (
              <div key={pk} onClick={()=>onNavigate(pk,0)}
                onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 2px 8px ${pd.color}40`}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}
                style={{ background:"#fff", border:`1px solid ${pd.color}20`, borderTop:`3px solid ${pd.color}`,
                  borderRadius:"8px", padding:"6px 10px", cursor:"pointer", flex:1,
                  display:"flex", flexDirection:"column", justifyContent:"space-between", transition:"box-shadow 0.15s" }}>
                <div style={{ fontSize:"9px", color:pd.color, fontWeight:"700" }}>{pd.label}</div>
                <div style={{ fontSize:"20px", fontWeight:"900", color:rc(avg), lineHeight:1 }}>{avg}<span style={{ fontSize:"9px" }}>%</span></div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ height:"3px", background:"#e8d5c0", borderRadius:"2px", flex:1, overflow:"hidden", marginRight:"4px" }}>
                    <div style={{ height:"100%", width:`${Math.min(avg,100)}%`, background:pd.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 구분선 */}
        <div style={{ width:"1px", background:"#d4b896", flexShrink:0, margin:"0 12px" }} />

        {/* 개인 업무현황 */}
        <div style={{ flex:1, display:"flex", gap:"6px", alignItems:"center" }}>
          <div style={{ background:"linear-gradient(135deg,#3b1f0a,#6b4226)", borderRadius:"8px",
            padding:"8px 12px", color:"#fff", display:"flex", flexDirection:"column", justifyContent:"center", minWidth:"90px" }}>
            <div style={{ fontSize:"8px", color:"#f5d5b5", marginBottom:"1px" }}>전체 업무</div>
            <div style={{ fontSize:"22px", fontWeight:"900", lineHeight:1 }}>{totAll}</div>
            <div style={{ fontSize:"8px", color:"#f5d5b5", marginTop:"1px" }}>미완료 {totUnd} · {wRate}%</div>
          </div>
          {partKeys.map(pk => {
            const pd = MEMBERS[pk];
            const pm = allData[pk];
            const pAll  = pm.reduce((s,m)=>s+(allWork[m.name]||[]).length,0);
            const pDone = pm.reduce((s,m)=>s+(allWork[m.name]||[]).filter(t=>t.상태==="완료").length,0);
            const pUnd  = pAll-pDone;
            const pWR   = pAll>0?Math.round((pDone/pAll)*100):0;
            const uc    = pUnd===0?"#4a7c59":pUnd<=5?"#b8860b":"#c0703a";
            return (
              <div key={pk} onClick={()=>onNavigate(pk,0)}
                onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 2px 8px ${pd.color}40`}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}
                style={{ background:"#fff", border:`1px solid ${pd.color}20`, borderTop:`3px solid ${pd.color}`,
                  borderRadius:"8px", padding:"6px 10px", cursor:"pointer", flex:1,
                  display:"flex", flexDirection:"column", justifyContent:"space-between", transition:"box-shadow 0.15s" }}>
                <div style={{ fontSize:"9px", color:pd.color, fontWeight:"700" }}>{pd.label}</div>
                <div style={{ display:"flex", alignItems:"flex-end", gap:"4px" }}>
                  <span style={{ fontSize:"18px", fontWeight:"900", color:uc, lineHeight:1 }}>{pUnd}</span>
                  <span style={{ fontSize:"8px", color:"#a08060", marginBottom:"1px" }}>미완료</span>
                </div>
                <div>
                  <div style={{ fontSize:"8px", color:"#a08060", marginBottom:"2px" }}>전체 {pAll} · {pWR}%</div>
                  <div style={{ height:"3px", background:"#e8d5c0", borderRadius:"2px", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${Math.min(pWR,100)}%`, background:uc }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 파트별 섹션: 좌(BS+AS+소송) / 우(QC) */}
      <div style={{ flex:1, overflow:"hidden", display:"flex", gap:"8px", padding:"0 12px 12px", width:"100%", boxSizing:"border-box" }}>

        {/* 왼쪽: BS + AS + 소송 */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:"6px", overflow:"hidden", minWidth:0 }}>
          <PartSection pk="BS" rowH={30} />
          <PartSection pk="AS" rowH={30} />
          <PartSection pk="소송" rowH={30} />
        </div>

        {/* 오른쪽: QC */}
        <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", minWidth:0 }}>
          <PartSection pk="QC" rowH={45} />
        </div>

      </div>

    </div>
  );
}
// ── 메인 앱 ──────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab]       = useState("dashboard");
  const [resultModal, setResultModal]   = useState(null); // "전략"|"업무"|"개인"|null
  const [restoreModal, setRestoreModal]  = useState(false);
  const [restoreText, setRestoreText]    = useState("");
  const [activePart, setActivePart]     = useState("QC");
  const [activeMember, setActiveMember] = useState(0);
  const [allData, setAllData] = useState(() => {
    const d = {};
    Object.entries(MEMBERS).forEach(([p,pd]) => {
      d[p] = pd.members.map(m => ({ ...m, goals: m.goals.map(g => ({ ...g, 실적:0, 비고:"", 결과:"" })) }));
    });
    return d;
  });

  // 업무현황 state
  const [allWork, setAllWork] = useState(() => {
    const d = {};
    Object.keys(WORK_DATA).forEach(name => {
      d[name] = [...(WORK_DATA[name] || [])];
    });
    return d;
  });

  // 팀장 요청사항 state
  const [allReq, setAllReq] = useState(() => ({ ...REQUEST_DATA }));

  // 스토리지 로드 (마운트 시 1회)
  const [storageLoaded, setStorageLoaded] = useState(false);
  useEffect(() => {
    const load = async () => {
      try {
        const allNames = Object.values(MEMBERS).flatMap(pd => pd.members.map(m => m.name));

        // Firebase에서 개인별 goals 로드
        const newData = {};
        for (const [pk, pd] of Object.entries(MEMBERS)) {
          newData[pk] = await Promise.all(pd.members.map(async (m) => {
            const saved = await dbGet('goals', m.name);
            return { ...m, goals: m.goals.map((g, gi) => ({ ...g, ...(saved?.[gi]||{}) })) };
          }));
        }
        setAllData(newData);

        // Firebase에서 개인별 work 로드
        const newWork = {};
        for (const name of allNames) {
          const saved = await dbGet('work', name);
          newWork[name] = saved?.tasks || [...(WORK_DATA[name]||[])];
        }
        setAllWork(newWork);

        // req 로드
        const savedReq = await dbGet('req', 'all');
        if (savedReq) setAllReq(savedReq);

      } catch(e) {
        console.error('로드 오류:', e);
      }
      setStorageLoaded(true);
    };    load();
  }, []);

  // 스토리지 저장 (데이터 변경 시)
  useEffect(() => {
    if (!storageLoaded) return;
    // req는 전체 키로 저장 (팀장 공통)

  }, [allReq, storageLoaded]);

  const part    = MEMBERS[activePart];
  const members = allData[activePart];
  const member  = members[activeMember];

  const update = (gi, field, val) => {
    setAllData(prev => {
      const next = { ...prev };
      next[activePart] = next[activePart].map((m,mi) =>
        mi !== activeMember ? m : {
          ...m, goals: m.goals.map((g,idx) =>
            idx !== gi ? g : { ...g, [field]: field==="실적" ? Math.min(Number(val),g.배점) : val }
          )
        }
      );
      // Firebase 즉시 저장
      const member = next[activePart]?.[activeMember];
      if (member) {
        const goalData = {};
        member.goals.forEach((g, gi) => { goalData[gi] = { 실적: g.실적||0, 비고: g.비고||'', 결과: g.결과||'' }; });
        dbSet('goals', member.name, goalData);
      }
      return next;
    });
  };

  const totalRate = calcRate(member.goals);
  const 배점합 = member.goals.reduce((s,g) => s+g.배점, 0);
  const 실적합 = member.goals.reduce((s,g) => s+(g.실적||0), 0);

  // 전체 평균 (헤더용)
  const allKeys = Object.keys(MEMBERS);
  const totalMembers = allKeys.reduce((s,p) => s+allData[p].length, 0);
  const overallRate = Math.round(allKeys.reduce((s,p) => s+allData[p].reduce((ss,m) => ss+calcRate(m.goals),0),0)/totalMembers);

  if (!storageLoaded) return (
    <div style={{ fontFamily:"'Noto Sans KR','Malgun Gothic',sans-serif", background:"#faf6f1", height:"100vh",
      display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"12px" }}>
      <div style={{ width:"36px", height:"36px", border:"3px solid #e8d5c0", borderTop:"3px solid #8b5e3c",
        borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <div style={{ fontSize:"13px", color:"#8b6a4a" }}>데이터 불러오는 중...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Noto Sans KR','Malgun Gothic',sans-serif", background:"#faf6f1", minHeight:"100vh", color:"#3b2a1a", display:"flex", flexDirection:"column", height:"100vh", width:"100vw", overflow:"hidden", boxSizing:"border-box" }}>

      {/* 헤더 */}
      <div style={{ background:"linear-gradient(90deg,#5c3317,#3b1f0a)", borderBottom:"1px solid #8b5e3c", padding:"12px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"4px", height:"28px", background:"linear-gradient(#c49a6c,#8b5e3c)", borderRadius:"2px" }} />
          <div>
            <div style={{ fontSize:"10px", letterSpacing:"3px", color:"#c9a880", textTransform:"uppercase" }}>2026 품질팀</div>
            <div style={{ fontSize:"16px", fontWeight:"700", color:"#fff" }}>팀원 목표 & 실적 관리</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
          {["전략","업무","개인"].map(cat => {
            const cnt = Object.values(allData).flat().reduce((s,m) =>
              s + m.goals.filter(g => g.cat===cat && g.배점>0 && (g.결과||"").trim()).length, 0);
            return (
              <button key={cat} onClick={() => setResultModal(cat)}
                style={{ display:"flex", alignItems:"center", gap:"5px", padding:"5px 14px",
                  background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.25)",
                  borderRadius:"16px", color:"#f5d5b5", fontSize:"11px", fontWeight:"600",
                  cursor:"pointer", transition:"all 0.15s", letterSpacing:"0.3px" }}
                onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.22)"; e.currentTarget.style.color="#fff"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.12)"; e.currentTarget.style.color="#f5d5b5"; }}>
                {cat} 목표
                {cnt > 0 && (
                  <span style={{ background:"rgba(255,255,255,0.25)", color:"#fff",
                    fontSize:"10px", fontWeight:"800", padding:"1px 6px", borderRadius:"9px",
                    minWidth:"18px", textAlign:"center" }}>{cnt}</span>
                )}
              </button>
            );
          })}
          {/* 구분선 */}
          <div style={{ width:"1px", height:"20px", background:"rgba(255,255,255,0.2)" }} />
          {/* 백업 버튼 */}
          <button onClick={() => {
              const backup = { allData, allWork, allReq, savedAt: new Date().toISOString() };
              const text = JSON.stringify(backup);
              navigator.clipboard.writeText(text).then(() => {
                alert("✅ 백업 완료!\n클립보드에 복사됐습니다.\n메모장을 열고 Ctrl+V 로 붙여넣기 후 저장하세요.");
              }).catch(() => {
                // 클립보드 실패 시 모달로 표시
                const overlay = document.createElement("div");
                overlay.style.cssText = "position:fixed;inset:0;background:rgba(59,26,10,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;";
                const box = document.createElement("div");
                box.style.cssText = "background:#faf6f1;border-radius:10px;width:560px;max-width:94vw;padding:20px;box-shadow:0 8px 32px rgba(91,51,23,0.3);";
                box.innerHTML = `
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <div style="font-size:14px;font-weight:700;color:#5c3317;">💾 백업 데이터 복사</div>
                    <button id="closeBackup" style="background:none;border:none;font-size:20px;color:#8b6a4a;cursor:pointer;">✕</button>
                  </div>
                  <div style="font-size:11px;color:#8b6a4a;margin-bottom:8px;">아래 텍스트 전체를 복사(Ctrl+A → Ctrl+C)하여 메모장에 저장하세요.</div>
                  <textarea id="backupTextarea" style="width:100%;height:200px;padding:8px;border:1px solid #c4a882;border-radius:5px;font-size:10px;resize:none;box-sizing:border-box;">${text}</textarea>
                  <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px;">
                    <button id="copyBackup" style="padding:6px 16px;background:#5c3317;border:none;border-radius:8px;color:#fff;font-size:11px;font-weight:700;cursor:pointer;">전체 복사</button>
                    <button id="closeBackup2" style="padding:6px 16px;background:#e8d5c0;border:none;border-radius:8px;color:#6b4226;font-size:11px;font-weight:600;cursor:pointer;">닫기</button>
                  </div>
                `;
                overlay.appendChild(box);
                document.body.appendChild(overlay);
                const ta = document.getElementById("backupTextarea");
                ta.select();
                document.getElementById("copyBackup").onclick = () => { ta.select(); document.execCommand("copy"); alert("복사됐습니다. 메모장에 붙여넣기 후 저장하세요."); };
                const close = () => document.body.removeChild(overlay);
                document.getElementById("closeBackup").onclick = close;
                document.getElementById("closeBackup2").onclick = close;
                overlay.onclick = (e) => { if(e.target === overlay) close(); };
              });
            }}
            style={{ display:"flex", alignItems:"center", gap:"4px", padding:"4px 8px",
              background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)",
              borderRadius:"10px", color:"#c9a880", fontSize:"13px", cursor:"pointer" }}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.18)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.08)"; }}
            title="데이터 백업">
            BK
          </button>
          {/* 복원 버튼 */}
          <button onClick={() => { setRestoreText(""); setRestoreModal(true); }}
            style={{ display:"flex", alignItems:"center", gap:"4px", padding:"4px 8px",
              background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)",
              borderRadius:"10px", color:"#c9a880", fontSize:"13px", cursor:"pointer" }}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.18)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.08)"; }}
            title="데이터 복원">
            RS
          </button>
        </div>
      </div>

      {/* 탭 */}
      <div style={{ display:"flex", background:"#f0e6d8", borderBottom:"1px solid #c4a882", flexShrink:0 }}>
        {/* 대시보드 탭 */}
        <button onClick={() => setActiveTab("dashboard")}
          style={{ padding:"10px 20px", border:"none", cursor:"pointer",
            background: activeTab==="dashboard" ? "#ffffff" : "transparent",
            color: activeTab==="dashboard" ? "#5c3317" : "#8b6a4a",
            fontWeight: activeTab==="dashboard" ? "700" : "400", fontSize:"13px",
            borderBottom:`2px solid ${activeTab==="dashboard" ? "#5c3317" : "transparent"}`,
            transition:"all 0.2s", whiteSpace:"nowrap" }}>
          📊 대시보드
        </button>
        <div style={{ width:"1px", background:"#c4a882", margin:"8px 0" }} />
        {/* 파트 탭 */}
        {Object.entries(MEMBERS).map(([key,pd]) => {
          const pm  = allData[key];
          const avg = Math.round(pm.reduce((s,m) => s+calcRate(m.goals),0)/pm.length);
          const isA = activeTab==="detail" && activePart===key;
          return (
            <button key={key} onClick={() => { setActiveTab("detail"); setActivePart(key); setActiveMember(0); }}
              style={{ flex:1, padding:"10px 12px", border:"none", cursor:"pointer",
                background: isA ? "#ffffff" : "transparent",
                color: isA ? pd.color : "#5c3317", fontWeight: isA ? "700" : "600",
                fontWeight: isA ? "700" : "400", fontSize:"13px",
                borderBottom:`2px solid ${isA ? pd.color : "transparent"}`, transition:"all 0.2s" }}>
              {pd.label}
              <div style={{ fontSize:"10px", color: isA ? pd.color : "#6b4226", marginTop:"2px" }}>
                {pd.members.length}명 · {avg}%
              </div>
            </button>
          );
        })}
      </div>

      {/* 콘텐츠 */}
      <div style={{ flex:1, overflow:"hidden", display:"flex" }}>
        {activeTab === "dashboard" ? (
          <div style={{ flex:1, overflow:"hidden", display:"flex" }}>
            <Dashboard allData={allData} allWork={allWork} onNavigate={(part, memberIdx) => { setActiveTab("detail"); setActivePart(part); setActiveMember(memberIdx ?? 0); }} />
          </div>
        ) : (
          <>
            {/* 좌측 멤버 */}
            <div style={{ width:"160px", minWidth:"160px", background:"#f0e6d8", borderRight:"1px solid #c4a882", overflowY:"auto" }}>
              {members.map((m,i) => {
                const r  = calcRate(m.goals);
                const isA = activeMember===i;
                return (
                  <button key={m.name} onClick={() => setActiveMember(i)}
                    style={{ display:"block", width:"100%", padding:"12px 14px", textAlign:"left", border:"none", cursor:"pointer",
                      background: isA ? "#ffffff" : "transparent",
                      borderLeft:`3px solid ${isA ? part.color : "transparent"}`,
                      borderBottom:"1px solid #d4b896", transition:"all 0.15s" }}>
                    <div style={{ fontSize:"13px", fontWeight: isA?"700":"400", color: isA?"#3b1f0a":"#7a5c40" }}>{m.name}</div>
                    <div style={{ fontSize:"10px", color:rateColor(r), marginTop:"3px" }}>달성 {r}%</div>
                    <Bar rate={r} />
                  </button>
                );
              })}
            </div>

                        {/* 우측: 목표관리(좌) + 업무현황(우) 2분할 */}
            <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

              {/* 왼쪽: 목표관리 */}
              <div style={{ width:"50%", borderRight:"1px solid #d4b896", overflowY:"auto", padding:"0", background:"#faf6f1", display:"flex", flexDirection:"column" }}>
                {/* 왼쪽 제목 */}
                <div style={{ padding:"12px 20px", borderBottom:"2px solid #d4b896", background:"#f0e6d8", flexShrink:0 }}>
                  <div style={{ fontSize:"10px", color:"#a08060", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"2px" }}>2026 팀원 목표</div>
                  <div style={{ fontSize:"14px", fontWeight:"700", color:"#5c3317" }}>개인별 목표 관리</div>
                </div>
                <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                      <span style={{ fontSize:"9px", fontWeight:"700", color:part.color,
                        background:part.color+"18", border:`1px solid ${part.color}50`,
                        padding:"2px 8px", borderRadius:"8px", letterSpacing:"0.3px", flexShrink:0 }}>
                        {part.label.replace(" 파트","")}
                      </span>
                      <div style={{ fontSize:"15px", fontWeight:"700", color:"#3b1f0a" }}>{member.name}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:"10px", color:"#8b6a4a" }}>전략 {member.전략}점 · 업무 {member.업무}점 · 개인 {member.개인}점</div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:"22px", fontWeight:"800", color:rateColor(totalRate) }}>{totalRate}<span style={{ fontSize:"11px" }}>%</span></div>
                    <div style={{ fontSize:"10px", color:"#8b6a4a" }}>{실적합}/{배점합}점</div>
                  </div>
                </div>
                <div style={{ height:"7px", background:"#d4b896", borderRadius:"4px", marginBottom:"14px", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${Math.min(totalRate,100)}%`,
                    background:`linear-gradient(90deg,${part.color},${rateColor(totalRate)})`,
                    borderRadius:"4px", transition:"width 0.5s" }} />
                </div>
                {member.goals.map((g,gi) => {
                  const pct = g.배점 > 0 ? Math.round(((g.실적||0)/g.배점)*100) : 0;
                  return (
                    <div key={gi} style={{ background:"#ffffff", border:"1px solid #d4b896",
                      borderLeft:`3px solid ${CAT_COLOR[g.cat]}`, borderRadius:"5px",
                      padding:"12px 14px", marginBottom:"8px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"4px" }}>
                        <div style={{ flex:1, marginRight:"8px" }}>
                          <span style={{ fontSize:"9px", background:CAT_BG[g.cat], color:CAT_COLOR[g.cat],
                            padding:"1px 6px", borderRadius:"8px", marginRight:"5px", fontWeight:"700" }}>{g.cat}</span>
                          <span style={{ fontSize:"12px", fontWeight:"600", color:"#3b1f0a" }}>{g.과제}</span>
                        </div>
                        <span style={{ fontSize:"10px", color:"#8b6a4a", whiteSpace:"nowrap" }}>{g.배점}점</span>
                      </div>
                      <div style={{ fontSize:"10px", color:"#7a5c40", lineHeight:"1.5", marginBottom:"7px", whiteSpace:"pre-line" }}>{g.내용}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"5px" }}>
                        <label style={{ fontSize:"10px", color:"#8b6a4a", whiteSpace:"nowrap" }}>실적</label>
                        <input type="number" min="0" max={g.배점} value={g.실적||0}
                          onChange={e => {
                            const v = Math.min(Math.max(0, Number(e.target.value)), g.배점);
                            update(gi,"실적", v);
                          }}
                          style={{ width:"50px", background:"#f5ede4",
                            border:`1px solid ${(g.실적||0) >= g.배점 && g.배점 > 0 ? "#4a7c59" : CAT_COLOR[g.cat]}`,
                            borderRadius:"3px", color:"#3b1f0a", padding:"3px 6px",
                            fontSize:"12px", fontWeight:"700", textAlign:"center" }} />
                        <span style={{ fontSize:"10px", color:"#8b6a4a" }}>/ {g.배점}점</span>
                        <span style={{ fontSize:"10px", fontWeight:"800", color:"#fff",
                          background:rateColor(pct), padding:"2px 8px", borderRadius:"10px", minWidth:"34px", textAlign:"center" }}>{pct}%</span>
                      <span style={{ fontSize:"9px", color:"#a08060", fontStyle:"italic" }}>(실적은 진행률을 점수로 환산해서 표기할 것)</span>
                      </div>
                      <Bar rate={pct} color={CAT_COLOR[g.cat]} />
                      <div style={{ marginTop:"6px" }}>
                        <div style={{ fontSize:"9px", color:"#a08060", marginBottom:"2px", fontWeight:"600" }}>현재 진행현황</div>
                        <textarea value={g.비고||""} onChange={e => update(gi,"비고",e.target.value)}
                          placeholder="진행 상황 입력" rows={2}
                          style={{ width:"100%", background:"#f5ede4", border:"1px solid #d4b896",
                            borderRadius:"3px", color:"#6b4a30", padding:"4px 6px", fontSize:"10px",
                            lineHeight:"1.5", resize:"vertical", boxSizing:"border-box",
                            fontFamily:"inherit", outline:"none" }} />
                      </div>
                      {/* 확정 결과물 */}
                      <div style={{ marginTop:"5px" }}>
                        <div style={{ marginBottom:"3px" }}>
                          <span style={{ background:"#5c3317", color:"#fff", padding:"1px 6px",
                            borderRadius:"4px", fontSize:"8px", fontWeight:"700", letterSpacing:"0.3px" }}>결과물(승인본)</span>
                        </div>
                        <textarea value={g.결과||""} onChange={e => update(gi,"결과",e.target.value)}
                          placeholder="(예: 보고서, 개선안, 시스템 구축 등)" rows={2}
                          style={{ width:"100%", background:"#fff8f0", border:"1px solid #c4a882",
                            borderLeft:"3px solid #5c3317", borderRadius:"3px",
                            color:"#5c3317", fontWeight:"500", padding:"4px 6px", fontSize:"10px",
                            lineHeight:"1.5", resize:"vertical", boxSizing:"border-box",
                            fontFamily:"inherit", outline:"none" }} />
                      </div>
                    </div>
                  );
                })}
                </div>{/* 스크롤 래퍼 끝 */}
              </div>

              {/* 오른쪽: 업무현황 */}
              <WorkPanel name={member.name} partColor={part.color} workData={allWork} setWorkData={setAllWork} reqData={allReq} setReqData={setAllReq} />

            </div>

          </>
        )}
      </div>
      {/* ── 복원 모달 ── */}
      {restoreModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(59,26,10,0.5)", zIndex:3000,
          display:"flex", alignItems:"center", justifyContent:"center" }}
          onClick={() => setRestoreModal(false)}>
          <div style={{ background:"#faf6f1", borderRadius:"10px", width:"520px", maxWidth:"94vw",
            boxShadow:"0 8px 32px rgba(91,51,23,0.3)" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding:"14px 20px", background:"#5c3317", borderRadius:"10px 10px 0 0",
              display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:"14px", fontWeight:"700", color:"#fff" }}>📂 데이터 복원</div>
              <button onClick={() => setRestoreModal(false)}
                style={{ background:"none", border:"none", fontSize:"18px", color:"rgba(255,255,255,0.8)", cursor:"pointer" }}>✕</button>
            </div>
            <div style={{ padding:"16px 20px" }}>
              <div style={{ fontSize:"11px", color:"#8b6a4a", marginBottom:"8px" }}>
                백업 시 복사한 텍스트를 아래에 붙여넣기 하세요 (Ctrl+V)
              </div>
              <textarea
                value={restoreText}
                onChange={e => setRestoreText(e.target.value)}
                placeholder="백업 텍스트를 여기에 붙여넣기 하세요..."
                rows={6}
                style={{ width:"100%", padding:"8px 10px", border:"1px solid #c4a882", borderRadius:"5px",
                  fontSize:"11px", color:"#3b1f0a", background:"#fff", resize:"none",
                  boxSizing:"border-box", fontFamily:"inherit", outline:"none" }} />
              <div style={{ display:"flex", justifyContent:"flex-end", gap:"8px", marginTop:"10px" }}>
                <button onClick={() => setRestoreModal(false)}
                  style={{ padding:"6px 16px", background:"#e8d5c0", border:"none", borderRadius:"8px",
                    fontSize:"11px", color:"#6b4226", cursor:"pointer", fontWeight:"600" }}>취소</button>
                <button onClick={async () => {
                    try {
                      const data = JSON.parse(restoreText);
                      if (data.allData) setAllData(data.allData);
                      if (data.allWork) setAllWork(data.allWork);
                      if (data.allReq) setAllReq(data.allReq);
                      // Firebase에 전체 저장
                      try {
                        const gData = data.allData || {};
                        const wData = data.allWork || {};
                        for (const pk of Object.keys(gData)) {
                          for (const m of (gData[pk]||[])) {
                            const goalData = {};
                            (m.goals||[]).forEach((g,gi) => { goalData[gi] = { 실적:g.실적||0, 비고:g.비고||'', 결과:g.결과||'' }; });
                            await dbSet('goals', m.name, goalData);
                          }
                        }
                        for (const [name, tasks] of Object.entries(wData)) {
                          await dbSet('work', name, { tasks: Array.isArray(tasks)?tasks:[] });
                        }
                        if (data.allReq) await dbSet('req', 'all', data.allReq);
                        const wCount = Object.values(wData).reduce((s,v)=>s+(v||[]).length,0);
                        alert(`✅ 복원 완료\n업무 ${wCount}건 Firebase에 저장됨`);
                      } catch(e) { alert('복원 저장 오류: ' + e.message); }
                      setRestoreModal(false);
                      setRestoreText("");
                      alert(`✅ 복원 완료!\n저장일시: ${data.savedAt ? new Date(data.savedAt).toLocaleString("ko-KR") : "알 수 없음"}\n창을 닫았다 다시 열어보세요.`);
                    } catch(err) {
                      alert("❌ 형식이 올바르지 않습니다.\n백업 텍스트 전체를 붙여넣기 하세요.");
                    }
                  }}
                  style={{ padding:"6px 18px", background:"#5c3317", border:"none", borderRadius:"8px",
                    fontSize:"11px", color:"#fff", cursor:"pointer", fontWeight:"700" }}>복원 실행</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 결과물 모달 ── */}
      {resultModal && (
        <ResultModal
          cat={resultModal}
          allData={allData}
          onClose={() => setResultModal(null)}
        />
      )}
    </div>
  );
}
