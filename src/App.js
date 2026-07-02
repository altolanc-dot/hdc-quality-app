import { useState, useEffect, useRef } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8CS6XJKBAqlSTaOZY1g1Dt3zCVjqMvBE",
  authDomain: "hdc-quality-team.firebaseapp.com",
  projectId: "hdc-quality-team",
  storageBucket: "hdc-quality-team.firebasestorage.app",
  messagingSenderId: "730234114654",
  appId: "1:730234114654:web:1aa11f0f21084254775acf"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db  = getFirestore(app);

const dbGet = async (col, id) => {
  try {
    const snap = await getDoc(doc(db, col, id));
    return snap.exists() ? snap.data() : null;
  } catch(e) { console.error("dbGet error:", e); return null; }
};

const dbSet = async (col, id, data) => {
  try {
    await setDoc(doc(db, col, id), data, { merge: true });
    return true;
  } catch(e) { console.error("dbSet error:", e); return false; }
};

const REQUEST_DATA = {"신성근":"- 현장 점검후 부적합사항 조치관련 현장설명서 개정 및 후속조치\n\n- 욕실장 하자다발 관련 하자발생현장 검수 진행 _ 랩스 협업\n\n- 타겟점검에 대한 신규아이템 발굴 및 체크리스트 반영\n\n- 품질우수현장 인증서 (안전협의)_ 검토\n\n- 품질협의체 진행사항 모니터링 (담당 이정호M)\n\n- 설계 통합 플랫폼(이은주M) _ 천안6단지 파일럿테스트 적극 참여","박정호":"- 통합 품질데이터 구조도 관련 유관파트와 회의일정 수립 및 진행사항 리뷰\n\n- 데이터 적기제공에 대한 계획안 수립 / 보고\n\n- 창떨림 방지 보강여부를 전수조사 확인","박찬우":"아침 8시~9시 트리거 작동확인","배춘호":"- 레미콘 사전점검 종합보고서. 품질관리 맵 관련 목표 일자 관리","이정호":"- 품질협의체 상정안건 LIST 정리\n\n- 복층유리 아르곤가스 측정기 등 신규장비 / 점검방법 검토\n\n- 타겟점검에 대한 신규아이템 발굴 및 체크리스트 반영\n\n- 광주센테니얼_ 가구 래핑 불량사진 첨부해서 업체 공문 발송\n\n- 욕실장 거울변색 / 지하주차장 천장 단열재 탈락에 대한 품질협의체 안건 상정","한진헌":"","류지수":"","이희윤":"- 품질관련 target 점검 1건 1/4분기 실행","장효린":"- 판결보고 (엘포트, 평촌더샵, DMC센트럴) + 소송리스크 저감을 위한 핵심이행사항 보고","박형건":"- 판결보고 (엘포트, 평촌더샵, DMC센트럴) + 소송리스크 저감을 위한 핵심이행사항 보고","임병근":"- 소송핵심관리 검토용역 체크리스트 보고\n\n- 방화문 소송 ISSUE F/U","조성우":"- 부산서면 / 타일 균열들뜸 하자에 대한 하심위 접수 모니터링\n\n- 손끼임 방지재 관련 병점 시공시 _ 관리사무소와 긴밀협의\n\n- 하자관련 협력회사 처리지연에 대한 제재방안 강구\n\n- 조경직원 충원에 대한 협의진행","정경주":"- 고객센터 피드백 강화방안 수립\n\n- 소송핵심관리 검토 용역 _ 1차 보고서 취합 및 브리핑 준비\n\n- 준공현장 골조 균열 저감을 위한 공용부 점검 강화\n\n- 하자관련 협력회사 처리지연에 대한 제재방안 강구","김성진":"- 원인불명 하자 모니터링\n\n- 하자관련 협력회사 처리지연에 대한 제재방안 강구\n\n- 잔공사 편성 시기 및 집행에 대해 변경관리 UNIT과 협의","이규현":"- 원인불명 하자 모니터링\n\n- CS 업무처리 개선안 보고","박성준":"- 원인불명 하자 처리 프로세스 파일럿 시행안 작성\n\n- 춘천아이파크 스카이 라운지 투어 시 비상조치 및 운영계획 철저 수립\n\n- NCSI, SQ 인증 준비사항 및 심사계획 보고"};
const WORK_DATA = {"신성근":[],"박정호":[],"박찬우":[],"배춘호":[],"이정호":[],"한진헌":[],"류지수":[],"이희윤":[],"장효린":[],"박형건":[],"임병근":[],"조성우":[],"정경주":[],"김성진":[],"이규현":[],"박성준":[]};

const MEMBERS = {
  QC:{ label:"QC 파트", color:"#8b5e3c", members:[
    { name:"신성근", 전략:70, 업무:30, 개인:0, goals:[
      { cat:"전략", 과제:"예측기반의 타겟점검 운영", 배점:40, 내용:"현장 품질관리 핵심사항에 대한 타겟점검 시행 및 F/B" },
      { cat:"전략", 과제:"건설 DX (클라우드 기반 도서검토)", 배점:30, 내용:"클라우드 기반의 초기 도서검토 프로세스 개선" },
      { cat:"업무", 과제:"골조/타일 하자비용 저감", 배점:30, 내용:"품질점검 부적합사항에 대한 협력사 책임강화" },
    ]},
    { name:"박정호", 전략:70, 업무:0, 개인:30, goals:[
      { cat:"전략", 과제:"예측기반의 타겟점검 운영", 배점:20, 내용:"건축비구조요소 내진설계 타겟점검 강화 및 교육 실시" },
      { cat:"전략", 과제:"건설 DX (품질데이터 JIT 제공)", 배점:50, 내용:"① 통합 품질 데이터 구축\n② 품질데이터 Just-In-Time 제공" },
      { cat:"개인", 과제:"부적합보고서(NCR) 발행 전산화 관리", 배점:30, 내용:"부적합보고서(NCR) 발행 전산화 관리" },
    ]},
    { name:"박찬우", 전략:70, 업무:30, 개인:0, goals:[
      { cat:"전략", 과제:"예측기반의 타겟점검 운영", 배점:30, 내용:"실무 괴리 항목 발굴을 통한 점검항목 신설 및 품질협의체 안건 발굴" },
      { cat:"전략", 과제:"건설 DX (I-QMS 적용 및 이관)", 배점:40, 내용:"품질점검 I-QMS 적용 및 이관" },
      { cat:"업무", 과제:"골조/타일 하자비용 저감", 배점:30, 내용:"실전 노하우 기반 골조·타일 하자 예방 및 품질 지식 전파" },
    ]},
    { name:"이정호", 전략:40, 업무:20, 개인:40, goals:[
      { cat:"전략", 과제:"예측기반의 타겟점검 운영", 배점:40, 내용:"① 소송·비용으로 확대될 가능성 높은 공종 선별 및 점검시행\n② COP매니저를 활용한 현장 자율 운영 체계 시행" },
      { cat:"업무", 과제:"골조/타일 하자비용 저감", 배점:20, 내용:"골조공사 하자저감을 위한 품질협의체 안건 상정 및 개선안 도출" },
      { cat:"개인", 과제:"품질협의체 개선 운영", 배점:40, 내용:"품질협의체 개선 운영" },
    ]},
    { name:"한진헌", 전략:100, 업무:0, 개인:0, goals:[
      { cat:"전략", 과제:"예측기반의 타겟점검 운영", 배점:50, 내용:"2025년 하자 중 주요 반복하자 12개 항목을 선별하여 타겟점검에 반영" },
      { cat:"전략", 과제:"준공도서 사전검토 (업무체계 개선)", 배점:40, 내용:"점검 시 각 현장의 의견을 수렴한 설계/시공 기준 및 표준상세도 개선안 협의·반영" },
      { cat:"전략", 과제:"건설 DX (I-QMS 이관)", 배점:10, 내용:"I-QMS 기반 보고서 작성, 품질점검 데이터 및 기술자료 전현장 공유" },
    ]},
    { name:"류지수", 전략:100, 업무:0, 개인:0, goals:[
      { cat:"전략", 과제:"전기공종 타겟점검 및 리스크 저감", 배점:50, 내용:"전기공종 고위험 품질항목을 사전 도출하고 타겟점검 및 후속조치 관리" },
      { cat:"전략", 과제:"준공도서 사전검토 (전기·통신·소방)", 배점:30, 내용:"전기·통신·소방전기 준공도서의 적합성을 사전 검토" },
      { cat:"전략", 과제:"건설 DX (전기공종 데이터화)", 배점:20, 내용:"전기공종 점검결과, NCR, VOC, 하자 이슈를 데이터화" },
    ]},
    { name:"이희윤", 전략:60, 업무:0, 개인:40, goals:[
      { cat:"전략", 과제:"예측기반의 타겟점검 운영", 배점:60, 내용:"초기/진행/준공별 공정에 적합한 점검 시행" },
      { cat:"개인", 과제:"품질관리비 표준예산(안) 개정", 배점:20, 내용:"품질관리비 표준예산(안) 개정" },
      { cat:"개인", 과제:"표준 품질관리계획서 개정 및 배포", 배점:20, 내용:"표준 품질관리계획서 개정 및 배포" },
    ]},
    { name:"배춘호", 전략:40, 업무:40, 개인:20, goals:[
      { cat:"전략", 과제:"예측기반의 타겟점검 운영", 배점:40, 내용:"각 현장별 주요진행 공정에 대한 중점점검 관리" },
      { cat:"업무", 과제:"BS하자 처리율 개선", 배점:40, 내용:"주요하자 발생항목에 대한 중점관리" },
      { cat:"개인", 과제:"전국 지방 레미콘사 주요 현황 관리", 배점:20, 내용:"전국 지방 레미콘사 주요 현황 관리" },
    ]},
  ]},
  BS:{ label:"BS 파트", color:"#6b4226", members:[
    { name:"김성진", 전략:30, 업무:60, 개인:10, goals:[
      { cat:"전략", 과제:"건설 DX (AI VOC 기반 현장관리)", 배점:30, 내용:"AI VOC 기반 지능형 현장 관리 체계" },
      { cat:"업무", 과제:"BS하자 처리율 개선", 배점:20, 내용:"입주 전 원인불명, 자재건 하자처리율 상승 (10%→30%)" },
      { cat:"업무", 과제:"고객 불만율 관리 (SNS 비대면 응대)", 배점:20, 내용:"정보 전달 방식을 다각화하여 비대면 상시응대 강화" },
      { cat:"업무", 과제:"고객 불만율 관리 (아이파크데이 개편)", 배점:20, 내용:"기존 제공되었던 서비스 항목에 대한 전면 개편" },
      { cat:"개인", 과제:"오픈하우스 및 입주안내 영상 제작", 배점:10, 내용:"오픈하우스 및 입주안내 영상 제작" },
    ]},
    { name:"박성준", 전략:20, 업무:60, 개인:20, goals:[
      { cat:"전략", 과제:"건설 DX (인수인계 자료 관리 개선)", 배점:20, 내용:"인수인계 자료 관리 개선안" },
      { cat:"업무", 과제:"BS하자 처리율 개선", 배점:40, 내용:"입주 전 원인불명, 자재건 하자처리율 상승 (10%→30%)" },
      { cat:"업무", 과제:"고객 불만율 관리 (홈케어·기프트 개편)", 배점:20, 내용:"기존 제공되었던 서비스 항목에 대한 전면 개편" },
      { cat:"개인", 과제:"협력사 선정·평가 방식 개선", 배점:20, 내용:"협력사 선정(입찰) 및 평가 방식 개선" },
    ]},
    { name:"이규현", 전략:60, 업무:40, 개인:0, goals:[
      { cat:"전략", 과제:"예측기반의 타겟점검 운영", 배점:20, 내용:"현장 자율 운영 체계 구축" },
      { cat:"전략", 과제:"건설 DX", 배점:40, 내용:"DATA LAB CS현황 대시보드 개선\n품질데이터 구조도 수립 및 적기 제공 시스템 구축" },
      { cat:"업무", 과제:"BS하자 처리율 개선", 배점:40, 내용:"입주초기 하자, 민원에 대한 R&R 재정립" },
    ]},
  ]},
  AS:{ label:"AS 파트", color:"#a0785a", members:[
    { name:"조성우", 전략:30, 업무:70, 개인:0, goals:[
      { cat:"전략", 과제:"건설 DX (아이클릭 고도화)", 배점:15, 내용:"아이클릭 Data 활용 고도화" },
      { cat:"전략", 과제:"건설 DX (위젯형 대시보드)", 배점:15, 내용:"품질팀 위젯형 업무 대시보드 구축" },
      { cat:"업무", 과제:"골조/타일 하자비용 저감 (하자보수 절차)", 배점:20, 내용:"센터 전결공사에 대한 하자보수 절차 개선" },
      { cat:"업무", 과제:"고객 불만율 관리 (VOC·해피콜)", 배점:25, 내용:"VOC 및 해피콜 운영 개선" },
      { cat:"업무", 과제:"고객 불만율 관리 (장기 미처리)", 배점:25, 내용:"하자처리 소요일 및 장기 미처리 개선" },
    ]},
    { name:"정경주", 전략:50, 업무:50, 개인:0, goals:[
      { cat:"전략", 과제:"준공도서 사전검토 (소송핵심관리 용역)", 배점:50, 내용:"소송핵심관리검토 용역 개선 및 시행" },
      { cat:"업무", 과제:"골조/타일 하자비용 저감 (분류체계 표준화)", 배점:25, 내용:"골조 하자 분류체계 표준화 및 시스템 구축" },
      { cat:"업무", 과제:"골조/타일 하자비용 저감 (균열조사~보수)", 배점:25, 내용:"준공 전후 균열조사~보수 절차 개선" },
    ]},
  ]},
  소송:{ label:"소송 파트", color:"#5c3317", members:[
    { name:"장효린", 전략:50, 업무:50, 개인:0, goals:[
      { cat:"전략", 과제:"준공도서 사전검토 (소송핵심관리 현장평가)", 배점:25, 내용:"소송핵심관리 용역개선 및 현장 평가안 수립" },
      { cat:"전략", 과제:"건설 DX (하자소송 DB)", 배점:25, 내용:"AI기반의 하자소송 분석 DB화 추진" },
      { cat:"업무", 과제:"골조/타일 하자비용 저감 (구상권 청구)", 배점:25, 내용:"협력업체 및 보증사 구상권 청구" },
      { cat:"업무", 과제:"골조/타일 하자비용 저감 (하자저감 대책)", 배점:25, 내용:"골조/타일 하자 저감 대책 수립" },
    ]},
    { name:"박형건", 전략:50, 업무:50, 개인:0, goals:[
      { cat:"전략", 과제:"예측기반의 타겟점검 운영 (선제적 중점관리)", 배점:25, 내용:"주요 판결 및 감정 사례 분석을 통한 선제적 중점 관리 리스트 수립" },
      { cat:"전략", 과제:"준공도서 사전검토 (소송대응 협의체)", 배점:25, 내용:"준공(예정포함) 사업지 소송대응 협의체 구성 및 운영" },
      { cat:"업무", 과제:"골조/타일 하자비용 저감 (판결 Feedback)", 배점:25, 내용:"판결 Feedback 유관팀 개선요청, 협의" },
      { cat:"업무", 과제:"골조/타일 하자비용 저감 (소송사례 교육)", 배점:25, 내용:"소송사례 교육" },
    ]},
    { name:"임병근", 전략:45, 업무:55, 개인:0, goals:[
      { cat:"전략", 과제:"예측기반의 타겟점검 운영 (점검항목 신설)", 배점:25, 내용:"주요 판결 및 감정 사례 분석을 통한 중점 관리 리스트 수립" },
      { cat:"전략", 과제:"건설 DX (판결금 정량 DB)", 배점:20, 내용:"AI 기반 하자소송 통합 DB 구축 및 항목별 판결금 정량 데이터화" },
      { cat:"업무", 과제:"골조/타일 하자비용 저감 (소송비 분석)", 배점:25, 내용:"골조 타일 공종별 소송 투입비용 분석 및 최소화 방안 수립" },
      { cat:"업무", 과제:"골조 및 타일 소송비 유관부서 Feedback", 배점:30, 내용:"골조 및 타일 공종 소송비 투입 분석 및 유관부서 Feedback" },
    ]},
  ]},
};

const CAT_COLOR = { 전략:"#8b5e3c", 업무:"#6b4226", 개인:"#a0785a" };
const CAT_BG    = { 전략:"#f5ede4", 업무:"#e8d5c0", 개인:"#f0e6d8" };
const rateColor = r => r>=80?"#4a7c59":r>=50?"#b8860b":r>0?"#c0703a":"#bba080";
const calcRate  = goals => {
  const tot = goals.reduce((s,g)=>s+g.배점,0);
  const done= goals.reduce((s,g)=>s+(g.실적||0),0);
  return tot===0?0:Math.round((done/tot)*100);
};
const 상태목록 = ["진행중","완료","검토중","보류","취소"];
const 상태색   = {진행중:"#b8860b",완료:"#4a7c59",검토중:"#8b5e3c",보류:"#a08060",취소:"#c0703a"};
const 상태배경 = {진행중:"#fef8e7",완료:"#e8f5ed",검토중:"#f5ede4",보류:"#f5f0eb",취소:"#fdf0eb"};
const EMPTY_FORM = {업무:"",요청부서:"",접수일:"",목표일:"",완료일:"",상태:"진행중",리뷰:""};

// 전략/업무 목표 그룹 정의
const RESULT_GROUPS = {
  전략:[
    {label:"예측기반 타겟점검", score:20, desc:"예측기반 타겟점검 운영안 수립 및 타겟점검 시행 100%",         match:t=>t.includes("예측기반")||t.includes("타겟점검")||t.includes("전기공종 타겟")||t.includes("레미콘")},
    {label:"건설 DX",           score:15, desc:"AI 품질관리 시스템 구축 및 통합품질데이터 적기제공",           match:t=>t.includes("건설 DX")||t.includes("I-QMS")},
    {label:"소송핵심관리",      score:10, desc:"소송핵심관리 개선안 수립 및 단지별 검증 / 평가",               match:t=>t.includes("준공도서")||t.includes("소송핵심")||t.includes("소송대응")||t.includes("전기·통신")},
  ],
  업무:[
    {label:"하자비용 저감",   score:20, desc:"골조/타일 하자보수비 저감 (표준단가대비 10% 절감)",                                match:t=>t.includes("골조")||t.includes("타일")},
    {label:"BS 하자 개선",    score:15, desc:"입주초기 R&R 개선, 원인불명 하자 처리 프로세스 구축 (전년대비 30% 저감)",               match:t=>t.includes("BS하자")},
    {label:"고객불만율 관리", score:20, desc:"고객이 체감할 수 있는 서비스 및 장기미처리 개선 (VOC 3% 이하)", match:t=>t.includes("고객")||t.includes("VOC")||t.includes("홈케어")||t.includes("아이파크")||t.includes("SNS")},
  ],
  개인:[{label:"개인 목표", score:null, desc:"", match:()=>true}],
};

// ── 팀원 목표 팝업 (이름 클릭 시, 해당 그룹 목표만) ───────────
function MemberGoalPopup({ memberName, cat, groupLabel, groupMatch, allData, onClose }) {
  const color = cat==="전략"?"#2563ab":cat==="업무"?"#4a7c59":"#a0785a";
  const bgColor = cat==="전략"?"#eff6ff":cat==="업무"?"#f0faf4":"#faf6f1";
  const borderColor = cat==="전략"?"#bfdbfe":cat==="업무"?"#bbf7d0":"#e8d5c0";

  // 해당 팀원의 해당 그룹 목표들 수집
  let memberInfo = null;
  let partColor = "#888";
  let partLabel = "";
  Object.entries(MEMBERS).forEach(([pk,pd])=>{
    const found = allData[pk]?.find(m=>m.name===memberName);
    if(found){ memberInfo=found; partColor=pd.color; partLabel=pd.label.replace(" 파트",""); }
  });
  if(!memberInfo) return null;

  const matchedGoals = memberInfo.goals.filter(g=>g.cat===cat && groupMatch(g.과제));
  if(!matchedGoals.length) return null;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:5000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:"12px",width:"540px",maxWidth:"94vw",maxHeight:"80vh",display:"flex",flexDirection:"column",boxShadow:"0 12px 40px rgba(0,0,0,0.25)",border:`1px solid ${borderColor}`}} onClick={e=>e.stopPropagation()}>
        {/* 헤더 */}
        <div style={{padding:"14px 20px",background:color,borderRadius:"12px 12px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div>
              <div style={{fontSize:"9px",color:"rgba(255,255,255,0.75)",letterSpacing:"1px",marginBottom:"1px"}}>{cat} 목표 · {groupLabel}</div>
              <div style={{fontSize:"16px",fontWeight:"700",color:"#fff",display:"flex",alignItems:"center",gap:"8px"}}>
                <span style={{fontSize:"10px",fontWeight:"700",color:partColor,background:"rgba(255,255,255,0.9)",padding:"2px 8px",borderRadius:"10px"}}>{partLabel}</span>
                {memberName}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",width:"28px",height:"28px",borderRadius:"50%",color:"#fff",cursor:"pointer",fontSize:"16px",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        {/* 내용 */}
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          {matchedGoals.map((g,gi)=>{
            const 결과items = (g.결과||"").split("||").filter(s=>s.trim());
            const 비고 = (g.비고||"").trim();
            const pct = g.배점>0?Math.round(((g.실적||0)/g.배점)*100):0;
            return (
              <div key={gi} style={{background:bgColor,border:`1px solid ${borderColor}`,borderLeft:`4px solid ${color}`,borderRadius:"8px",padding:"12px 14px",marginBottom:"10px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px"}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"12px",fontWeight:"700",color:"#1e293b",marginBottom:"3px"}}>{g.과제}</div>
                    <div style={{fontSize:"10px",color:"#64748b",lineHeight:"1.5",whiteSpace:"pre-line"}}>{g.내용}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0,marginLeft:"12px"}}>
                    <div style={{fontSize:"18px",fontWeight:"900",color:rateColor(pct)}}>{pct}%</div>
                    <div style={{fontSize:"9px",color:"#94a3b8"}}>{g.실적||0}/{g.배점}점</div>
                  </div>
                </div>
                {/* 진행률 바 */}
                <div style={{height:"5px",background:"#e2e8f0",borderRadius:"3px",marginBottom:"8px",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:rateColor(pct),borderRadius:"3px"}} />
                </div>
                {/* 진행현황 */}
                {비고&&(
                  <div style={{background:"#fff",border:`1px solid ${borderColor}`,borderLeft:`3px solid ${color}60`,borderRadius:"6px",padding:"8px 10px",marginBottom:결과items.length?"8px":"0"}}>
                    <div style={{fontSize:"8px",color:color,fontWeight:"700",marginBottom:"4px"}}>📋 현재 진행현황</div>
                    <div style={{fontSize:"10px",color:"#475569",lineHeight:"1.7",whiteSpace:"pre-line"}}>{비고}</div>
                  </div>
                )}
                {/* 결과물 */}
                {결과items.length>0&&(
                  <div style={{background:"#fff",border:`1px solid ${borderColor}`,borderLeft:`3px solid ${color}`,borderRadius:"6px",padding:"8px 10px"}}>
                    <div style={{fontSize:"8px",color:color,fontWeight:"700",marginBottom:"4px"}}>✅ 결과물(승인본)</div>
                    {결과items.map((r,ri)=>(
                      <div key={ri} style={{display:"flex",gap:"5px",alignItems:"flex-start",marginBottom:ri<결과items.length-1?"3px":"0"}}>
                        <span style={{color:color,fontWeight:"700",fontSize:"10px",flexShrink:0}}>{ri+1}.</span>
                        <span style={{fontSize:"11px",color:"#1e293b",lineHeight:"1.6",fontWeight:"500"}}>{r}</span>
                      </div>
                    ))}
                  </div>
                )}
                {!비고&&!결과items.length&&(
                  <div style={{fontSize:"10px",color:"#94a3b8",textAlign:"center",padding:"8px 0"}}>진행현황 및 결과물 미입력</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── ResultModal (그룹 리스트 스타일) ──────────────────────────
function ResultModal({ cat, allData, onClose, initialGroup=0 }) {
  const color  = cat==="전략"?"#2563ab":cat==="업무"?"#166534":"#8b5e3c";
  const bgTop  = cat==="전략"?"#1e40af":cat==="업무"?"#14532d":"#5c3317";
  const groups = RESULT_GROUPS[cat] || [];

  const [activeGroup, setActiveGroup] = useState(Math.min(initialGroup, groups.length-1));
  const [viewMode, setViewMode]       = useState("결과물");
  const [memberPopup, setMemberPopup] = useState(null);
  const [mergedGroups, setMergedGroups] = useState({});
  const [selected, setSelected]         = useState(new Set());

  const gi       = activeGroup;
  const groupKey = `${cat}_${gi}`;

  // Firebase에서 그룹 데이터 로드
  useEffect(()=>{
    dbGet('merged', cat).then(d=>{
      if(d) setMergedGroups(d);
    });
  },[cat]);

  // Firebase에 그룹 저장
  const saveMerged = (newMG) => {
    setMergedGroups(newMG);
    dbSet('merged', cat, newMG);
  };

  // ── 결과물 카드 빌드 (팀원×결과물항목 단위) ──
  const buildResultCards = (gIdx) => {
    const cards = [];
    const gObj  = groups[gIdx];
    if(!gObj) return cards;
    Object.entries(MEMBERS).forEach(([pk,pd])=>{
      (allData[pk]||[]).forEach(m=>{
        m.goals.filter(g=>g.cat===cat&&gObj.match(g.과제)&&g.배점>0).forEach(g=>{
          const items=(g.결과||"").split("||").filter(s=>s.trim());
          items.forEach((item,ii)=>{
            cards.push({
              id:`${m.name}__${g.과제}__${ii}`,
              name:m.name, part:pd.label.replace(" 파트",""), partColor:pd.color,
              과제:g.과제, item,
              pct:g.배점>0?Math.round(((g.실적||0)/g.배점)*100):0,
            });
          });
        });
      });
    });
    return cards;
  };

  // ── 진행현황 빌드 ──
  const buildProgressList = (gIdx) => {
    const list = [];
    const gObj = groups[gIdx];
    if(!gObj) return list;
    Object.entries(MEMBERS).forEach(([pk,pd])=>{
      (allData[pk]||[]).forEach(m=>{
        const rows = m.goals.filter(g=>g.cat===cat&&gObj.match(g.과제)&&(g.비고||"").trim());
        if(!rows.length) return;
        list.push({name:m.name,part:pd.label.replace(" 파트",""),partColor:pd.color,rows});
      });
    });
    return list;
  };

  const resultCards  = buildResultCards(gi);
  const progressList = buildProgressList(gi);

  const curMerged = mergedGroups[groupKey] || []; // [{ids:[...]}]
  const mergedIds = new Set(curMerged.flatMap(g=>g.ids));
  const soloCards = resultCards.filter(c=>!mergedIds.has(c.id));

  const toggleSelect = id => setSelected(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  const clearSelect  = () => setSelected(new Set());

  // 새 그룹 생성
  const doMerge = () => {
    if(selected.size<2) return;
    const newMG = {...mergedGroups,[groupKey]:[...(mergedGroups[groupKey]||[]),{ids:[...selected],title:""}]};
    saveMerged(newMG);
    clearSelect();
  };

  // 그룹에 카드 추가 (선택된 카드)
  const addToMerged = (mIdx) => {
    const toAdd = [...selected].filter(id=>soloCards.find(c=>c.id===id));
    if(!toAdd.length) return;
    const newMG = {...mergedGroups,[groupKey]:(mergedGroups[groupKey]||[]).map((g,i)=>i===mIdx?{...g,ids:[...g.ids,...toAdd]}:g)};
    saveMerged(newMG);
    clearSelect();
  };

  // 미그룹 카드 개별 추가 (선택 없이 직접)
  const addCardToMerged = (mIdx, cardId) => {
    const newMG = {...mergedGroups,[groupKey]:(mergedGroups[groupKey]||[]).map((g,i)=>i===mIdx?{...g,ids:[...g.ids,cardId]}:g)};
    saveMerged(newMG);
  };

  // 그룹에서 카드 한 개 제거
  const removeFromMerged = (mIdx, cardId) => {
    const newMG = {...mergedGroups,[groupKey]:(mergedGroups[groupKey]||[]).map((g,i)=>{
      if(i!==mIdx) return g;
      return {...g,ids:g.ids.filter(id=>id!==cardId)};
    }).filter(g=>g.ids.length>0)};
    saveMerged(newMG);
  };

  // 그룹 전체 해제
  const unmerge = mIdx => {
    const arr=[...(mergedGroups[groupKey]||[])]; arr.splice(mIdx,1);
    saveMerged({...mergedGroups,[groupKey]:arr});
  };

  // 그룹 제목 변경
  const updateTitle = (mIdx, title) => {
    const newMG = {...mergedGroups,[groupKey]:(mergedGroups[groupKey]||[]).map((g,i)=>i===mIdx?{...g,title}:g)};
    saveMerged(newMG);
  };

  // 그룹 순서 이동
  const moveGroup = (mIdx, dir) => {
    const arr=[...(mergedGroups[groupKey]||[])];
    const newIdx = mIdx+dir;
    if(newIdx<0||newIdx>=arr.length) return;
    [arr[mIdx],arr[newIdx]]=[arr[newIdx],arr[mIdx]];
    saveMerged({...mergedGroups,[groupKey]:arr});
  };

  // 탭별 결과물 있는 팀원 수
  const memberCntFor = (gIdx) => [...new Set(buildResultCards(gIdx).map(c=>c.name))].length;

  const MemberTag = ({name, part, partColor}) => (
    <>
      <span style={{fontSize:"9px",fontWeight:"700",color:partColor,background:partColor+"20",padding:"2px 7px",borderRadius:"10px",border:`1px solid ${partColor}40`}}>{part}</span>
      <button onClick={e=>{e.stopPropagation();setMemberPopup(name);}}
        style={{fontSize:"11px",fontWeight:"700",color:"#1e293b",background:"none",border:"none",cursor:"pointer",padding:"0 2px",textDecoration:"underline",textDecorationColor:"#cbd5e1"}}>
        {name}
      </button>
    </>
  );

  // ── 그룹 박스 ──
  const MergedBox = ({mIdx, ids, title=""}) => {
    const cards = ids.map(id=>resultCards.find(c=>c.id===id)).filter(Boolean);
    if(!cards.length) return null;
    const uniqueMembers = [...new Map(cards.map(c=>[c.name,c])).values()];
    const [editingTitle, setEditingTitle] = useState(false);
    const [titleDraft, setTitleDraft]     = useState(title||"");
    const totalGroups = (mergedGroups[groupKey]||[]).length;

    return (
      <div style={{background:"#fdf8f2",border:`1.5px solid #c4a882`,borderLeft:`4px solid ${color}`,borderRadius:"10px",padding:"11px 14px",marginBottom:"10px"}}>
        {/* 헤더 행 */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"8px",flexWrap:"wrap",gap:"5px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"5px",flexWrap:"wrap",flex:1,minWidth:0}}>
            {/* 순서 이동 버튼 */}
            <div style={{display:"flex",flexDirection:"column",gap:"1px",flexShrink:0}}>
              <button onClick={e=>{e.stopPropagation();moveGroup(mIdx,-1);}} disabled={mIdx===0}
                style={{background:mIdx===0?"#f1f5f9":"#e2e8f0",border:"none",borderRadius:"3px",cursor:mIdx===0?"default":"pointer",color:mIdx===0?"#cbd5e1":"#64748b",fontSize:"9px",padding:"1px 4px",lineHeight:1}}>▲</button>
              <button onClick={e=>{e.stopPropagation();moveGroup(mIdx,1);}} disabled={mIdx===totalGroups-1}
                style={{background:mIdx===totalGroups-1?"#f1f5f9":"#e2e8f0",border:"none",borderRadius:"3px",cursor:mIdx===totalGroups-1?"default":"pointer",color:mIdx===totalGroups-1?"#cbd5e1":"#64748b",fontSize:"9px",padding:"1px 4px",lineHeight:1}}>▼</button>
            </div>
            {/* 제목 (편집 가능) */}
            {editingTitle
              ? <input autoFocus value={titleDraft} onChange={e=>setTitleDraft(e.target.value)}
                  onBlur={()=>{ updateTitle(mIdx,titleDraft); setEditingTitle(false); }}
                  onKeyDown={e=>{ if(e.key==="Enter"){ updateTitle(mIdx,titleDraft); setEditingTitle(false); } if(e.key==="Escape") setEditingTitle(false); }}
                  onClick={e=>e.stopPropagation()}
                  style={{fontSize:"12px",fontWeight:"700",color:"#1e293b",border:`1.5px solid ${color}`,borderRadius:"6px",padding:"2px 8px",outline:"none",minWidth:"160px",background:"#fff"}} />
              : <button onClick={e=>{e.stopPropagation();setTitleDraft(title||"");setEditingTitle(true);}}
                  style={{fontSize:"12px",fontWeight:"700",color:title?"#1e293b":"#94a3b8",background:"none",border:"none",cursor:"pointer",padding:"2px 6px",borderRadius:"6px",textAlign:"left"}}>
                  {title||`그룹 ${mIdx+1} (클릭하여 그룹명 입력)`}
                </button>
            }
            {/* 팀원 태그 */}
            {uniqueMembers.map((c,i)=>(
              <span key={i} style={{display:"inline-flex",alignItems:"center",gap:"3px"}}>
                <MemberTag name={c.name} part={c.part} partColor={c.partColor} />
              </span>
            ))}
          </div>
          <div style={{display:"flex",gap:"5px",flexShrink:0}}>
            {selected.size>0&&[...selected].some(id=>soloCards.find(c=>c.id===id))&&(
              <button onClick={e=>{e.stopPropagation();addToMerged(mIdx);}}
                style={{padding:"2px 9px",background:"#eff6ff",border:`1px solid ${color}`,borderRadius:"6px",fontSize:"9px",color:color,cursor:"pointer",fontWeight:"600"}}>+ 선택 추가</button>
            )}
            <button onClick={e=>{e.stopPropagation();unmerge(mIdx);}}
              style={{padding:"2px 9px",background:"#fee2e2",border:"none",borderRadius:"6px",fontSize:"9px",color:"#dc2626",cursor:"pointer",fontWeight:"600"}}>그룹 해제</button>
          </div>
        </div>
        {/* 결과물 번호 리스트 */}
        <div style={{paddingLeft:"2px"}}>
          {cards.map((c,ci)=>(
            <div key={ci} style={{display:"flex",alignItems:"flex-start",gap:"7px",marginBottom:ci<cards.length-1?"6px":"0"}}>
              <span style={{fontSize:"11px",fontWeight:"800",color:color,flexShrink:0,minWidth:"18px"}}>{ci+1}.</span>
              <span style={{fontSize:"12px",color:"#1e293b",lineHeight:"1.6",flex:1}}>{c.item}</span>
              <div style={{display:"flex",alignItems:"center",gap:"4px",flexShrink:0}}>
                <span style={{fontSize:"8px",fontWeight:"700",color:c.partColor,background:c.partColor+"15",padding:"1px 5px",borderRadius:"5px"}}>{c.name}</span>
                <button onClick={e=>{e.stopPropagation();removeFromMerged(mIdx,c.id);}}
                  style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:"12px",padding:"0 1px",lineHeight:1}}>✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── 독립 카드 ──
  const SoloCard = ({card}) => {
    const isSel = selected.has(card.id);
    const [showAdd, setShowAdd] = useState(false);
    return (
      <div style={{background:isSel?"#eff6ff":"#fff",border:`1.5px solid ${isSel?color:"#e2e8f0"}`,borderLeft:`4px solid ${isSel?color:card.partColor}`,borderRadius:"8px",padding:"9px 12px",marginBottom:"6px",transition:"all 0.12s"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"4px"}}>
          <div onClick={e=>{e.stopPropagation();toggleSelect(card.id);}} style={{display:"flex",alignItems:"center",gap:"5px",cursor:"pointer",flex:1}}>
            <MemberTag name={card.name} part={card.part} partColor={card.partColor} />
            <span style={{fontSize:"9px",color:"#94a3b8",marginLeft:"2px"}}>{card.과제}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
            <span style={{fontSize:"9px",fontWeight:"700",color:rateColor(card.pct),background:rateColor(card.pct)+"15",padding:"1px 6px",borderRadius:"5px"}}>{card.pct}%</span>
            {/* 그룹에 추가 버튼 */}
            {curMerged.length>0&&(
              <div style={{position:"relative"}}>
                <button onClick={e=>{e.stopPropagation();setShowAdd(v=>!v);}}
                  style={{padding:"1px 7px",background:"#f0f9ff",border:`1px solid ${color}`,borderRadius:"6px",fontSize:"9px",color:color,cursor:"pointer",fontWeight:"600"}}>+ 그룹추가</button>
                {showAdd&&(
                  <div onClick={e=>e.stopPropagation()} style={{position:"absolute",right:0,top:"22px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.15)",zIndex:100,minWidth:"150px",padding:"4px"}}>
                    {curMerged.map((g,mIdx)=>{
                      const t=g.title||`그룹 ${mIdx+1}`;
                      return (
                        <button key={mIdx} onClick={e=>{e.stopPropagation();addCardToMerged(mIdx,card.id);setShowAdd(false);}}
                          style={{display:"block",width:"100%",padding:"5px 10px",background:"none",border:"none",cursor:"pointer",fontSize:"11px",color:"#334155",textAlign:"left",borderRadius:"5px",fontWeight:"500"}}
                          onMouseEnter={e=>e.currentTarget.style.background="#f0f9ff"}
                          onMouseLeave={e=>e.currentTarget.style.background="none"}>
                          {t}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            <span onClick={e=>{e.stopPropagation();toggleSelect(card.id);}} style={{width:"15px",height:"15px",border:`2px solid ${isSel?color:"#cbd5e1"}`,borderRadius:"3px",background:isSel?color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer"}}>
              {isSel&&<span style={{color:"#fff",fontSize:"9px",lineHeight:1}}>✓</span>}
            </span>
          </div>
        </div>
        <div onClick={e=>{e.stopPropagation();toggleSelect(card.id);}} style={{fontSize:"12px",color:"#1e293b",lineHeight:"1.6",paddingLeft:"2px",cursor:"pointer"}}>{card.item}</div>
      </div>
    );
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#f8fafc",borderRadius:"14px",width:"680px",maxWidth:"96vw",maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 16px 48px rgba(0,0,0,0.3)"}} onClick={e=>e.stopPropagation()}>

        {/* 헤더 */}
        <div style={{padding:"13px 20px",background:`linear-gradient(135deg,${bgTop},${color})`,borderRadius:"14px 14px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:"9px",color:"rgba(255,255,255,0.7)",letterSpacing:"1.5px",marginBottom:"2px"}}>2026 품질팀</div>
            <div style={{fontSize:"15px",fontWeight:"700",color:"#fff"}}>
              <span style={{background:"rgba(255,255,255,0.2)",padding:"1px 9px",borderRadius:"8px",marginRight:"8px",fontSize:"10px"}}>{cat}</span>
              목표 진행현황 & 결과물
            </div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",width:"30px",height:"30px",borderRadius:"50%",color:"#fff",cursor:"pointer",fontSize:"17px",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>

        {/* 그룹 탭 */}
        <div style={{padding:"8px 20px 0",background:"#fff",borderBottom:"1px solid #e2e8f0",display:"flex",gap:"5px",flexWrap:"wrap"}}>
          {groups.map((g,i)=>{
            const isA=activeGroup===i;
            const mCnt=memberCntFor(i);
            return (
              <button key={i} onClick={e=>{e.stopPropagation();setActiveGroup(i);clearSelect();}}
                style={{display:"flex",alignItems:"center",gap:"5px",padding:"6px 14px",background:isA?color:"transparent",border:`1.5px solid ${isA?color:"#cbd5e1"}`,borderBottom:"none",borderRadius:"7px 7px 0 0",cursor:"pointer",color:isA?"#fff":"#475569",fontWeight:"600",fontSize:"12px",marginBottom:"-1px"}}>
                {g.label}
                <span style={{background:isA?"rgba(255,255,255,0.3)":color+"20",color:isA?"#fff":color,fontSize:"9px",fontWeight:"800",padding:"1px 6px",borderRadius:"8px"}}>{mCnt}명</span>
              </button>
            );
          })}
        </div>

        {/* 목표 설명 바 */}
        {groups[gi]?.desc&&(
          <div style={{padding:"7px 20px",background:`${color}08`,borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",gap:"8px"}}>
            {groups[gi]?.score&&<span style={{fontSize:"10px",fontWeight:"800",color:"#fff",background:color,padding:"2px 8px",borderRadius:"6px",flexShrink:0}}>{groups[gi].score}점</span>}
            <span style={{fontSize:"11px",color:"#334155",fontWeight:"500"}}>{groups[gi].desc}</span>
          </div>
        )}

        {/* 서브 탭 + 그룹 컨트롤 */}
        <div style={{padding:"8px 20px",background:"#fff",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px"}}>
          <div style={{display:"flex",gap:"3px",background:"#f1f5f9",borderRadius:"8px",padding:"3px"}}>
            {[{key:"결과물",icon:"✅",cnt:resultCards.length},{key:"진행현황",icon:"📋",cnt:progressList.length}].map(({key,icon,cnt})=>(
              <button key={key} onClick={()=>{ setViewMode(key); clearSelect(); }}
                style={{padding:"4px 13px",background:viewMode===key?"#fff":"transparent",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"11px",fontWeight:viewMode===key?"700":"400",color:viewMode===key?color:"#64748b",boxShadow:viewMode===key?"0 1px 3px rgba(0,0,0,0.1)":"none"}}>
                {icon} {key} <span style={{fontSize:"10px",fontWeight:"800",color:viewMode===key?color:"#94a3b8"}}>{cnt}</span>
              </button>
            ))}
          </div>
          {viewMode==="결과물"&&(
            <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
              {selected.size>=2
                ? <button onClick={e=>{e.stopPropagation();doMerge();}}
                    style={{padding:"4px 14px",background:color,border:"none",borderRadius:"8px",fontSize:"11px",color:"#fff",cursor:"pointer",fontWeight:"700"}}>✂ {selected.size}개 그룹</button>
                : <span style={{fontSize:"10px",color:"#94a3b8"}}>{selected.size===1?"하나 더 선택하면 그룹 가능":"카드 클릭 → 선택 → 그룹"}</span>
              }
              {selected.size>0&&<button onClick={clearSelect} style={{padding:"3px 9px",background:"#f1f5f9",border:"none",borderRadius:"6px",fontSize:"10px",color:"#64748b",cursor:"pointer"}}>선택 해제</button>}
            </div>
          )}
        </div>

        {/* 본문 */}
        <div style={{flex:1,overflowY:"auto",padding:"12px 20px"}}>

          {viewMode==="결과물"&&(
            <>
              {resultCards.length===0
                ? <div style={{textAlign:"center",color:"#94a3b8",fontSize:"12px",padding:"40px 0"}}>결과물(승인본)이 등록된 팀원이 없습니다</div>
                : <>
                    {/* 그룹 박스들 */}
                    {curMerged.map((g,mIdx)=>(
                      <MergedBox key={mIdx} mIdx={mIdx} ids={g.ids} title={g.title||""} />
                    ))}
                    {/* 독립 카드 */}
                    {soloCards.length>0&&(
                      <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                        {soloCards.map((c,ci)=><SoloCard key={ci} card={c} />)}
                      </div>
                    )}
                    {soloCards.length===0&&curMerged.length>0&&(
                      <div style={{textAlign:"center",color:"#4a7c59",fontSize:"11px",padding:"14px 0",fontWeight:"600"}}>✓ 모든 결과물이 그룹으로 정리되었습니다</div>
                    )}
                  </>
              }
            </>
          )}

          {viewMode==="진행현황"&&(
            <>
              {progressList.length===0
                ? <div style={{textAlign:"center",color:"#94a3b8",fontSize:"12px",padding:"40px 0"}}>진행현황이 입력된 팀원이 없습니다</div>
                : progressList.map((m,mi)=>(
                    <div key={mi} style={{background:"#fff",border:"1px solid #e2e8f0",borderLeft:`4px solid ${m.partColor}`,borderRadius:"8px",padding:"11px 13px",marginBottom:"9px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"9px"}}>
                        <MemberTag name={m.name} part={m.part} partColor={m.partColor} />
                        <div style={{marginLeft:"auto",display:"flex",gap:"4px"}}>
                          {m.rows.map((r,ri)=>{
                            const pct=r.배점>0?Math.round(((r.실적||0)/r.배점)*100):0;
                            return <span key={ri} style={{fontSize:"9px",fontWeight:"700",color:rateColor(pct),background:rateColor(pct)+"15",padding:"1px 6px",borderRadius:"5px"}}>{pct}%</span>;
                          })}
                        </div>
                      </div>
                      {m.rows.map((r,ri)=>(
                        <div key={ri} style={{background:"#f8fafc",border:"1px solid #e9f0fa",borderLeft:`3px solid ${color}60`,borderRadius:"6px",padding:"7px 10px",marginBottom:ri<m.rows.length-1?"6px":"0"}}>
                          <div style={{fontSize:"9px",color:color,fontWeight:"700",marginBottom:"3px"}}>📋 {r.과제}</div>
                          <div style={{fontSize:"10px",color:"#475569",lineHeight:"1.7",whiteSpace:"pre-line"}}>{(r.비고||"").trim()}</div>
                        </div>
                      ))}
                    </div>
                  ))
              }
            </>
          )}
        </div>
      </div>

      {memberPopup&&(
        <MemberGoalPopup memberName={memberPopup} cat={cat} groupLabel={groups[gi]?.label||""} groupMatch={groups[gi]?.match||(()=>true)} allData={allData} onClose={e=>{e&&e.stopPropagation();setMemberPopup(null);}} />
      )}
    </div>
  );
}

// ── ResultEditor ───────────────────────────────────────────────
function ResultEditor({ gi, 결과, update }) {
  const [items, setItems] = useState(()=>(결과||"").split("||").filter(Boolean));
  const prevRef = useRef(결과);
  useEffect(()=>{ if(prevRef.current!==결과){ prevRef.current=결과; setItems((결과||"").split("||").filter(Boolean)); } },[결과]);
  const commit = arr => { setItems(arr); prevRef.current=arr.filter(s=>s.trim()).join("||"); update(gi,"결과",arr.filter(s=>s.trim()).join("||")); };
  const updItem= (ii,val)=>{ const arr=[...items]; arr[ii]=val; setItems(arr); prevRef.current=arr.filter(s=>s.trim()).join("||"); update(gi,"결과",arr.filter(s=>s.trim()).join("||")); };
  return (
    <div style={{marginTop:"5px"}}>
      <div style={{marginBottom:"3px"}}><span style={{background:"#166534",color:"#fff",padding:"1px 6px",borderRadius:"4px",fontSize:"8px",fontWeight:"700"}}>결과물(승인본)</span></div>
      {items.map((item,ii)=>(
        <div key={ii} style={{display:"flex",gap:"4px",marginBottom:"4px",alignItems:"center"}}>
          <input value={item} onChange={e=>updItem(ii,e.target.value)} style={{flex:1,background:"#f0fdf4",border:"1px solid #86efac",borderLeft:"3px solid #166534",borderRadius:"3px",color:"#14532d",fontWeight:"500",padding:"4px 6px",fontSize:"10px",fontFamily:"inherit",outline:"none"}} />
          <button type="button" onPointerDown={e=>{ e.stopPropagation(); e.preventDefault(); const arr=[...items]; arr.splice(ii,1); commit(arr); }} style={{background:"none",border:"none",color:"#c0703a",cursor:"pointer",fontSize:"14px",padding:"0 4px"}}>✕</button>
        </div>
      ))}
      <button type="button" onPointerDown={e=>{ e.stopPropagation(); e.preventDefault(); setItems([...items,""]); }} style={{fontSize:"9px",padding:"4px 10px",background:"#f0fdf4",border:"1px dashed #86efac",borderRadius:"4px",color:"#166534",cursor:"pointer",marginTop:"2px",display:"block"}}>+ 결과물 추가</button>
    </div>
  );
}

// ── DetailModal ────────────────────────────────────────────────
function DetailModal({ task:t, taskIdx, partColor, onClose, onChangeStatus, onAddLog }) {
  const [logMemo, setLogMemo] = useState("");
  const bc=상태색[t.상태]||"#8b6a4a"; const bg=상태배경[t.상태]||"#f0e6d8";
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(59,26,10,0.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#faf6f1",borderRadius:"10px",width:"520px",maxWidth:"92vw",maxHeight:"82vh",display:"flex",flexDirection:"column",boxShadow:"0 8px 32px rgba(91,51,23,0.28)"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #d4b896",background:"#f0e6d8",borderRadius:"10px 10px 0 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1,marginRight:"10px"}}>
            <div style={{fontSize:"14px",fontWeight:"700",color:"#3b1f0a",marginBottom:"7px",lineHeight:"1.5"}}>{t.업무}</div>
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
              {t.요청부서&&<span style={{fontSize:"9px",background:"#e8d5c0",color:"#8b5e3c",padding:"2px 7px",borderRadius:"8px"}}>{t.요청부서}</span>}
              {t.접수일&&<span style={{fontSize:"9px",color:"#a08060"}}>접수 {t.접수일}</span>}
              {t.목표일&&<span style={{fontSize:"9px",color:"#a08060"}}>목표 {t.목표일}</span>}
              {t.완료일&&<span style={{fontSize:"9px",color:"#4a7c59"}}>완료 {t.완료일}</span>}
              <span style={{fontSize:"9px",fontWeight:"700",color:bc,background:bg,padding:"2px 7px",borderRadius:"8px"}}>{t.상태}</span>
            </div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:"20px",color:"#a08060",cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:"10px 20px",borderBottom:"1px solid #ede0d0",background:"#fff8f2",display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
          <span style={{fontSize:"10px",color:"#8b6a4a",fontWeight:"600"}}>상태 변경</span>
          {상태목록.map(s=>(
            <button key={s} onClick={()=>onChangeStatus(taskIdx,s)} style={{padding:"3px 10px",border:"none",borderRadius:"10px",cursor:"pointer",fontSize:"10px",fontWeight:t.상태===s?"700":"400",background:t.상태===s?(상태색[s]||"#8b6a4a"):(상태배경[s]||"#f0e6d8"),color:t.상태===s?"#fff":(상태색[s]||"#8b6a4a"),outline:t.상태===s?`2px solid ${상태색[s]||"#8b6a4a"}`:"none"}}>{s}</button>
          ))}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          <div style={{fontSize:"10px",color:"#8b5e3c",fontWeight:"700",marginBottom:"12px"}}>진행 이력 {(t.이력||[]).length>0?`(${(t.이력||[]).length}건)`:""}</div>
          {(!t.이력||t.이력.length===0)&&<div style={{fontSize:"11px",color:"#c4a882",textAlign:"center",padding:"24px 0"}}>아직 이력이 없습니다.</div>}
          {(t.이력||[]).map((log,li)=>{
            const dotColor=log.변경후상태==="완료"?"#4a7c59":log.변경후상태==="진행중"?"#b8860b":상태색[log.변경후상태]||"#8b5e3c";
            const isLast=li===(t.이력||[]).length-1;
            return (
              <div key={li} style={{display:"flex",gap:"12px",marginBottom:"10px"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,width:"10px"}}>
                  <div style={{width:"10px",height:"10px",borderRadius:"50%",background:dotColor,marginTop:"4px"}} />
                  {!isLast&&<div style={{width:"2px",flex:1,background:"#d4b896",marginTop:"3px"}} />}
                </div>
                <div style={{flex:1,background:"#ffffff",border:"1px solid #ede0d0",borderRadius:"6px",padding:"9px 12px",marginBottom:"2px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px",flexWrap:"wrap",gap:"4px"}}>
                    <div style={{display:"flex",gap:"5px",alignItems:"center"}}>
                      {log.변경전상태&&log.변경전상태!==log.변경후상태&&<><span style={{fontSize:"9px",fontWeight:"700",color:상태색[log.변경전상태]||"#8b6a4a",background:상태배경[log.변경전상태]||"#f0e6d8",padding:"1px 7px",borderRadius:"6px"}}>{log.변경전상태}</span><span style={{fontSize:"10px",color:"#a08060"}}>→</span></>}
                      <span style={{fontSize:"9px",fontWeight:"700",color:상태색[log.변경후상태]||"#8b6a4a",background:상태배경[log.변경후상태]||"#f0e6d8",padding:"1px 7px",borderRadius:"6px"}}>{log.변경후상태||"등록"}</span>
                    </div>
                    <span style={{fontSize:"9px",color:"#b0907a"}}>{log.시각}</span>
                  </div>
                  {log.메모&&<div style={{fontSize:"11px",color:"#5a3e28",lineHeight:"1.6"}}>{log.메모}</div>}
                </div>
              </div>
            );
          })}
          <div style={{marginTop:"14px",background:"#f5ede4",border:"1px solid #c4a882",borderRadius:"7px",padding:"12px 14px"}}>
            <div style={{fontSize:"10px",color:"#8b5e3c",fontWeight:"700",marginBottom:"7px"}}>+ 이력 메모 추가</div>
            <textarea value={logMemo} onChange={e=>setLogMemo(e.target.value)} placeholder="진행 상황, 특이사항, 협의 내용 등" rows={3}
              style={{width:"100%",padding:"7px 9px",border:"1px solid #c4a882",borderRadius:"5px",fontSize:"11px",color:"#3b1f0a",background:"#fff",resize:"vertical",boxSizing:"border-box",fontFamily:"inherit",outline:"none",lineHeight:"1.6"}} />
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:"7px"}}>
              <button onClick={()=>{ if(logMemo.trim()){ onAddLog(taskIdx,logMemo); setLogMemo(""); } }}
                style={{padding:"5px 16px",background:logMemo.trim()?partColor:"#c4a882",border:"none",borderRadius:"10px",fontSize:"11px",color:"#fff",cursor:logMemo.trim()?"pointer":"default",fontWeight:"700"}}>메모 저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 공지사항 팝업 ──────────────────────────────────────────────
function NoticeModal({ onClose }) {
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]   = useState("");
  const [loaded, setLoaded] = useState(false);
  useEffect(()=>{ dbGet('notice','main').then(d=>{ if(d?.text) setNotice(d.text); setLoaded(true); }); },[]);
  const save = () => { setNotice(draft); dbSet('notice','main',{text:draft}); setEditing(false); };
  if(!loaded) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(59,26,10,0.6)",zIndex:4000,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#faf6f1",borderRadius:"12px",width:"560px",maxWidth:"94vw",boxShadow:"0 10px 40px rgba(91,51,23,0.35)",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 20px",background:"linear-gradient(90deg,#5c3317,#8b5e3c)",borderRadius:"12px 12px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:"9px",color:"rgba(255,255,255,0.7)",letterSpacing:"1px",marginBottom:"1px"}}>2026 품질팀</div><div style={{fontSize:"15px",fontWeight:"700",color:"#fff"}}>📢 공지사항</div></div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:"20px",color:"rgba(255,255,255,0.8)",cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:"20px 24px",minHeight:"140px"}}>
          {!editing
            ? <div style={{fontSize:"13px",color:"#3b1f0a",lineHeight:"1.9",whiteSpace:"pre-line",minHeight:"80px"}}>{notice.trim()||<span style={{color:"#c4a882",fontSize:"12px"}}>등록된 공지사항이 없습니다.</span>}</div>
            : <textarea value={draft} onChange={e=>setDraft(e.target.value)} rows={7} placeholder="공지사항 내용을 입력하세요"
                style={{width:"100%",padding:"10px 12px",border:"1px solid #c4a882",borderRadius:"6px",fontSize:"13px",color:"#3b1f0a",background:"#fffaf5",resize:"vertical",boxSizing:"border-box",fontFamily:"inherit",outline:"none",lineHeight:"1.8"}} />
          }
        </div>
        <div style={{padding:"12px 24px 16px",borderTop:"1px solid #e8d5c0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <button onClick={()=>{ localStorage.setItem('notice_hide_until',new Date().toISOString().slice(0,10)); onClose(); }}
            style={{fontSize:"11px",color:"#a08060",background:"none",border:"1px solid #d4b896",borderRadius:"8px",padding:"5px 12px",cursor:"pointer"}}>오늘 다시 보지 않기</button>
          <div style={{display:"flex",gap:"8px"}}>
            {!editing
              ? <button onClick={()=>{ setDraft(notice); setEditing(true); }} style={{padding:"6px 16px",background:"#f0e6d8",border:"none",borderRadius:"8px",fontSize:"12px",color:"#5c3317",cursor:"pointer",fontWeight:"600"}}>수정</button>
              : <><button onClick={()=>setEditing(false)} style={{padding:"6px 16px",background:"#e8d5c0",border:"none",borderRadius:"8px",fontSize:"12px",color:"#6b4226",cursor:"pointer",fontWeight:"600"}}>취소</button>
                 <button onClick={save} style={{padding:"6px 18px",background:"linear-gradient(90deg,#5c3317,#8b5e3c)",border:"none",borderRadius:"8px",fontSize:"12px",color:"#fff",cursor:"pointer",fontWeight:"700"}}>저장</button></>
            }
            <button onClick={onClose} style={{padding:"6px 16px",background:"#5c3317",border:"none",borderRadius:"8px",fontSize:"12px",color:"#fff",cursor:"pointer",fontWeight:"600"}}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ReqSection ─────────────────────────────────────────────────
function ReqSection({ name, reqData, setReqData, partColor }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState("");
  const text = reqData[name]||"";
  if(!text.trim()&&!editing) return (
    <div style={{marginBottom:"8px"}}>
      <button onClick={()=>{ setDraft(text); setEditing(true); }} style={{fontSize:"9px",color:"#d4842a",background:"none",border:"1px dashed #e8a44a",borderRadius:"4px",padding:"3px 10px",cursor:"pointer"}}>+ 팀장 요청사항 추가</button>
    </div>
  );
  return (
    <div style={{background:"#fff3e0",border:"1px solid #e8a44a",borderLeft:"3px solid #d4842a",borderRadius:"5px",padding:"8px 12px",marginBottom:"8px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"5px"}}>
        <div style={{fontSize:"9px",color:"#b8650a",fontWeight:"700"}}>📋 팀장 요청사항</div>
        {!editing
          ? <button onClick={()=>{ setDraft(text); setEditing(true); }} style={{fontSize:"9px",color:"#d4842a",background:"#ffe0b2",border:"none",borderRadius:"6px",padding:"2px 8px",cursor:"pointer",fontWeight:"600"}}>수정</button>
          : <div style={{display:"flex",gap:"4px"}}>
              <button onClick={()=>setEditing(false)} style={{fontSize:"9px",color:"#8b6a4a",background:"#e8d5c0",border:"none",borderRadius:"6px",padding:"2px 8px",cursor:"pointer"}}>취소</button>
              <button onClick={()=>{ const next={...reqData,[name]:draft}; setReqData(next); dbSet('req','all',next); setEditing(false); }}
                style={{fontSize:"9px",color:"#fff",background:partColor,border:"none",borderRadius:"6px",padding:"2px 8px",cursor:"pointer",fontWeight:"700"}}>저장</button>
            </div>
        }
      </div>
      {!editing
        ? <div style={{fontSize:"10px",color:"#5a3a0a",lineHeight:"1.8"}}>{text.trim().split("\n").filter(l=>l.trim()).map((line,i)=>(<div key={i} style={{display:"flex",gap:"5px",marginBottom:"2px"}}><span style={{color:"#d4842a",fontWeight:"700",flexShrink:0,minWidth:"14px"}}>{i+1}.</span><span>{line.trim()}</span></div>))}</div>
        : <textarea value={draft} onChange={e=>setDraft(e.target.value)} rows={5} style={{width:"100%",padding:"6px 8px",border:"1px solid #e8a44a",borderRadius:"4px",fontSize:"10px",color:"#3b1f0a",background:"#fffaf5",resize:"vertical",boxSizing:"border-box",fontFamily:"inherit",outline:"none",lineHeight:"1.7"}} />
      }
    </div>
  );
}

// ── WorkPanel ──────────────────────────────────────────────────
function WorkPanel({ name, partColor, workData, setWorkData, reqData, setReqData }) {
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editIdx, setEditIdx]     = useState(null);
  const [filterState, setFilter]  = useState("진행중");
  const [detailIdx, setDetailIdx] = useState(null);
  const [searchQuery, setSearch]  = useState("");
  const tasks = workData[name]||[];
  const today = new Date().toISOString().slice(0,10);
  const effState = t => (!t.상태||t.상태==="진행중")?"진행중":t.상태;

  const saveTask = () => {
    if(!form.업무.trim()) return;
    setWorkData(prev=>{
      const list=[...(prev[name]||[])]; const now=new Date().toISOString().slice(0,16).replace("T"," ");
      if(editIdx!==null){ const pt=list[editIdx]; list[editIdx]={...form,이력:[...(pt.이력||[]),{시각:now,변경전상태:pt.상태,변경후상태:form.상태,메모:form.리뷰}]}; }
      else { list.push({...form,접수일:form.접수일||today,이력:[{시각:now,변경전상태:"",변경후상태:form.상태,메모:form.리뷰||"신규 등록"}]}); }
      const next={...prev,[name]:list}; dbSet('work',name,{tasks:list}); return next;
    });
    setForm(EMPTY_FORM); setShowForm(false); setEditIdx(null);
  };
  const addLog=(idx,memo)=>{ setWorkData(prev=>{ const list=[...(prev[name]||[])]; const t=list[idx]; const now=new Date().toISOString().slice(0,16).replace("T"," "); list[idx]={...t,이력:[...(t.이력||[]),{시각:now,변경전상태:t.상태,변경후상태:t.상태,메모:memo}]}; const next={...prev,[name]:list}; dbSet('work',name,{tasks:list}); return next; }); };
  const changeStatus=(idx,ns)=>{ setWorkData(prev=>{ const list=[...(prev[name]||[])]; const t=list[idx]; const now=new Date().toISOString().slice(0,16).replace("T"," "); list[idx]={...t,상태:ns,완료일:ns==="완료"?today:t.완료일,이력:[...(t.이력||[]),{시각:now,변경전상태:t.상태,변경후상태:ns,메모:`상태 변경: ${t.상태} → ${ns}`}]}; const next={...prev,[name]:list}; dbSet('work',name,{tasks:list}); return next; }); };
  const deleteTask=i=>{ setWorkData(prev=>{ const list=[...(prev[name]||[])]; list.splice(i,1); const next={...prev,[name]:list}; dbSet('work',name,{tasks:list}); return next; }); };
  const startEdit=i=>{ setForm({...tasks[i]}); setEditIdx(i); setShowForm(true); };
  const filtered=(filterState==="전체"?tasks:tasks.filter(t=>effState(t)===filterState)).filter(t=>!searchQuery.trim()||t.업무.includes(searchQuery)||(t.요청부서||"").includes(searchQuery)||(t.리뷰||"").includes(searchQuery));
  const counts=상태목록.reduce((acc,s)=>{ acc[s]=tasks.filter(t=>effState(t)===s).length; return acc; },{});

  return (
    <div style={{width:"50%",display:"flex",flexDirection:"column",background:"#f8fafc",borderLeft:"2px solid #1e3a5f"}}>
      {/* 헤더 - 남색 계열, 요청사항/검색/필터 포함 */}
      <div style={{padding:"12px 20px",borderBottom:"2px solid #1e3a5f",background:"linear-gradient(135deg,#1e3a5f,#2563ab)",flexShrink:0}}>
        <div style={{fontSize:"9px",color:"rgba(255,255,255,0.7)",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"2px"}}>2026 개인별 업무현황</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"8px"}}>
          <div style={{fontSize:"14px",fontWeight:"700",color:"#fff",display:"flex",alignItems:"center",gap:"6px"}}>
            <span style={{fontSize:"16px"}}>📌</span> 업무 현황
          </div>
          <button onClick={()=>{ setForm({...EMPTY_FORM,접수일:today}); setEditIdx(null); setShowForm(v=>!v); }} style={{padding:"4px 12px",background:showForm?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.35)",borderRadius:"8px",fontSize:"11px",fontWeight:"700",cursor:"pointer"}}>{showForm?"✕ 닫기":"+ 신규 업무"}</button>
        </div>
        <ReqSection name={name} reqData={reqData} setReqData={setReqData} partColor="#2563ab" />
        <div style={{position:"relative",marginBottom:"6px"}}>
          <input value={searchQuery} onChange={e=>setSearch(e.target.value)} placeholder="업무명, 요청부서, 리뷰 검색..." style={{width:"100%",padding:"5px 28px 5px 8px",border:"1px solid rgba(255,255,255,0.25)",borderRadius:"6px",fontSize:"11px",color:"#e2e8f0",background:"rgba(255,255,255,0.12)",boxSizing:"border-box",outline:"none"}} />
          {searchQuery&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:"6px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"13px"}}>✕</button>}
        </div>
        <div style={{display:"flex",gap:"4px",flexWrap:"wrap"}}>
          {["전체",...상태목록].map(s=>{ const cnt=s==="전체"?tasks.length:(counts[s]||0); const isA=filterState===s;
            return <button key={s} onClick={()=>setFilter(s)} style={{padding:"2px 8px",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"9px",fontWeight:isA?"700":"400",background:isA?(s==="전체"?"rgba(255,255,255,0.9)":(상태배경[s]||"rgba(255,255,255,0.8)")):"rgba(255,255,255,0.12)",color:isA?(s==="전체"?"#1e3a5f":(상태색[s]||"#1e3a5f")):"rgba(255,255,255,0.7)"}}>{s} ({cnt})</button>; })}
        </div>
      </div>

      {showForm&&(
        <div style={{padding:"14px 18px",borderBottom:"2px solid #3b82f6",background:"#f0f9ff",flexShrink:0}}>
          <div style={{fontSize:"10px",color:"#1d4ed8",fontWeight:"700",marginBottom:"8px"}}>{editIdx!==null?"✏️ 업무 수정":"📝 신규 업무 등록"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",marginBottom:"6px"}}>
            <div style={{gridColumn:"1/-1"}}><div style={{fontSize:"9px",color:"#64748b",marginBottom:"2px"}}>업무내용 *</div><input value={form.업무} onChange={e=>setForm(p=>({...p,업무:e.target.value}))} placeholder="업무 내용을 입력하세요" style={{width:"100%",padding:"5px 8px",border:"1px solid #93c5fd",borderRadius:"4px",fontSize:"12px",color:"#1e293b",background:"#fff",boxSizing:"border-box",outline:"none"}} /></div>
            <div><div style={{fontSize:"9px",color:"#64748b",marginBottom:"2px"}}>요청부서</div><input value={form.요청부서} onChange={e=>setForm(p=>({...p,요청부서:e.target.value}))} placeholder="예) 품질팀" style={{width:"100%",padding:"5px 8px",border:"1px solid #cbd5e1",borderRadius:"4px",fontSize:"11px",color:"#1e293b",background:"#fff",boxSizing:"border-box",outline:"none"}} /></div>
            <div><div style={{fontSize:"9px",color:"#64748b",marginBottom:"2px"}}>진행상태</div><select value={form.상태} onChange={e=>setForm(p=>({...p,상태:e.target.value}))} style={{width:"100%",padding:"5px 8px",border:"1px solid #cbd5e1",borderRadius:"4px",fontSize:"11px",color:"#1e293b",background:"#fff",outline:"none"}}>{상태목록.map(s=><option key={s}>{s}</option>)}</select></div>
            {["접수일","목표일","완료일"].map(k=><div key={k}><div style={{fontSize:"9px",color:"#64748b",marginBottom:"2px"}}>{k}</div><input type="date" value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} style={{width:"100%",padding:"5px 8px",border:"1px solid #cbd5e1",borderRadius:"4px",fontSize:"11px",color:"#1e293b",background:"#fff",boxSizing:"border-box",outline:"none"}} /></div>)}
            <div style={{gridColumn:"1/-1"}}><div style={{fontSize:"9px",color:"#64748b",marginBottom:"2px"}}>Review / 특이사항</div><textarea value={form.리뷰} onChange={e=>setForm(p=>({...p,리뷰:e.target.value}))} placeholder="진행 특이사항, 결과 등" rows={2} style={{width:"100%",padding:"5px 8px",border:"1px solid #cbd5e1",borderRadius:"4px",fontSize:"11px",color:"#1e293b",background:"#fff",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit",outline:"none"}} /></div>
          </div>
          <div style={{display:"flex",gap:"6px",justifyContent:"flex-end"}}>
            <button onClick={()=>{ setShowForm(false); setForm(EMPTY_FORM); setEditIdx(null); }} style={{padding:"5px 14px",background:"#e2e8f0",border:"none",borderRadius:"8px",fontSize:"11px",color:"#475569",cursor:"pointer",fontWeight:"600"}}>취소</button>
            <button onClick={saveTask} style={{padding:"5px 16px",background:"#3b82f6",border:"none",borderRadius:"8px",fontSize:"11px",color:"#fff",cursor:"pointer",fontWeight:"700"}}>{editIdx!==null?"수정 저장":"등록"}</button>
          </div>
        </div>
      )}

      <div style={{flex:1,overflowY:"auto",padding:"12px 16px"}}>
        {filtered.length===0&&<div style={{textAlign:"center",color:"#94a3b8",fontSize:"12px",marginTop:"40px"}}>{filterState==="전체"?"등록된 업무가 없습니다":`${filterState} 업무가 없습니다`}</div>}
        {[...filtered].reverse().map((t,fi)=>{ const realIdx=tasks.indexOf(t); const es=effState(t); const bc=상태색[es]||"#8b6a4a"; const bg=상태배경[es]||"#f0e6d8";
          return (
            <div key={fi} onClick={()=>setDetailIdx(realIdx)}
              style={{background:"#fff",border:"1px solid #e2e8f0",borderLeft:`4px solid ${bc}`,borderRadius:"7px",padding:"9px 11px",marginBottom:"7px",cursor:"pointer",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 3px 10px rgba(59,130,246,0.15)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.06)"}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"4px"}}>
                <div style={{fontSize:"12px",fontWeight:"600",color:"#1e293b",flex:1,lineHeight:"1.4",marginRight:"6px"}}><span style={{color:"#94a3b8",fontWeight:"700",marginRight:"5px",fontSize:"11px"}}>#{realIdx+1}</span>{t.업무}</div>
                <div style={{display:"flex",gap:"4px",flexShrink:0}} onClick={e=>e.stopPropagation()}>
                  {(t.이력||[]).length>0&&<span style={{padding:"2px 6px",background:"#eff6ff",borderRadius:"6px",fontSize:"10px",color:"#3b82f6",fontWeight:"700"}}>이력 {(t.이력||[]).length}</span>}
                  <button onClick={e=>{ e.stopPropagation(); startEdit(realIdx); }} style={{padding:"2px 6px",background:"#f1f5f9",border:"none",borderRadius:"6px",fontSize:"10px",color:"#475569",cursor:"pointer",fontWeight:"600"}}>수정</button>
                  <button onClick={e=>{ e.stopPropagation(); deleteTask(realIdx); }} style={{padding:"2px 6px",background:"#fff5f5",border:"none",borderRadius:"6px",fontSize:"9px",color:"#ef4444",cursor:"pointer",fontWeight:"600"}}>삭제</button>
                </div>
              </div>
              <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
                {t.요청부서&&<span style={{fontSize:"9px",background:"#eff6ff",color:"#3b82f6",padding:"1px 6px",borderRadius:"6px"}}>{t.요청부서}</span>}
                {t.접수일&&<span style={{fontSize:"9px",color:"#94a3b8"}}>접수 {t.접수일}</span>}
                {t.목표일&&<span style={{fontSize:"9px",color:"#94a3b8"}}>목표 {t.목표일}</span>}
                {t.완료일&&<span style={{fontSize:"9px",color:"#4a7c59"}}>완료 {t.완료일}</span>}
                <span style={{fontSize:"9px",fontWeight:"700",color:bc,background:bg,padding:"1px 6px",borderRadius:"6px"}}>{es}</span>
              </div>
              {t.리뷰&&<div style={{fontSize:"10px",color:"#475569",lineHeight:"1.4",marginTop:"4px",background:"#f8fafc",padding:"4px 7px",borderRadius:"4px"}}>{t.리뷰}</div>}
              <div style={{fontSize:"9px",color:"#94a3b8",marginTop:"4px"}}>클릭하여 상세 이력 보기 →</div>
            </div>
          );
        })}
      </div>
      {detailIdx!==null&&tasks[detailIdx]&&<DetailModal task={tasks[detailIdx]} taskIdx={detailIdx} partColor="#3b82f6" onClose={()=>setDetailIdx(null)} onChangeStatus={(idx,s)=>{ changeStatus(idx,s); setDetailIdx(null); }} onAddLog={(idx,memo)=>{ addLog(idx,memo); setDetailIdx(null); }} />}
    </div>
  );
}

// ── Bar ────────────────────────────────────────────────────────
function Bar({ rate, color, height="5px" }) {
  return (<div style={{height,background:"#d4b896",borderRadius:"3px",overflow:"hidden",marginTop:"4px"}}><div style={{height:"100%",width:`${Math.min(rate,100)}%`,background:color||rateColor(rate),borderRadius:"3px",transition:"width 0.5s"}} /></div>);
}

// ── Dashboard ──────────────────────────────────────────────────
function Dashboard({ allData, allWork, onNavigate }) {
  const partKeys = Object.keys(MEMBERS);
  const rc = r=>r>=80?"#4a7c59":r>=50?"#b8860b":"#c0703a";
  const leftRef = useRef(null);
  const [qcRowH, setQcRowH] = useState(44);
  const [openItem, setOpenItem] = useState(null);
  // 대시보드 팀원 이름 클릭 팝업: {name, cat, groupLabel, groupMatch}
  const [dashPopup, setDashPopup] = useState(null);

  useEffect(()=>{
    const calc=()=>{ if(!leftRef.current) return; setQcRowH(Math.max(24,Math.floor((leftRef.current.getBoundingClientRect().height-28-24)/allData["QC"].length))); };
    const ro=new ResizeObserver(calc); if(leftRef.current) ro.observe(leftRef.current); setTimeout(calc,0); return ()=>ro.disconnect();
  },[allData]);

  const STRATEGY_ITEMS = [
    {label:"예측기반 타겟점검", score:20, desc:"예측기반 타겟점검 운영안 수립 및 타겟점검 시행 100%", match:t=>t.includes("예측기반")||t.includes("타겟점검")||t.includes("전기공종 타겟")||t.includes("레미콘")},
    {label:"건설 DX",           score:15, desc:"AI 품질관리 시스템 구축 및 통합품질데이터 적기제공",   match:t=>t.includes("건설 DX")||t.includes("I-QMS")},
    {label:"소송핵심관리",      score:10, desc:"소송핵심관리 개선안 수립 및 단지별 검증 / 평가",       match:t=>t.includes("준공도서")||t.includes("소송핵심")||t.includes("소송대응")||t.includes("전기·통신")},
  ];
  const WORK_ITEMS = [
    {label:"하자비용 저감",   score:20, desc:"골조/타일 하자보수비 저감 (표준단가대비 10% 절감)",                                  match:t=>t.includes("골조")||t.includes("타일")},
    {label:"BS 하자 개선",    score:15, desc:"입주초기 R&R 개선 및 귀책불분명·원인불명 하자 처리 프로세스 구축",                   match:t=>t.includes("BS하자")},
    {label:"고객불만율 관리", score:20, desc:"고객이 체감할 수 있는 서비스 및 장기미처리 개선 (VOC 3% 이하)", match:t=>t.includes("고객")||t.includes("VOC")||t.includes("홈케어")||t.includes("아이파크")||t.includes("SNS")},
  ];

  const getMemberRates = (item, cat) => {
    const result=[];
    partKeys.forEach(pk=>{ allData[pk].forEach(m=>{ const goals=m.goals.filter(g=>g.cat===cat&&item.match(g.과제)); if(!goals.length) return; const ts=goals.reduce((s,g)=>s+g.배점,0); const td=goals.reduce((s,g)=>s+(g.실적||0),0); result.push({name:m.name,part:MEMBERS[pk].label.replace(" 파트",""),partColor:MEMBERS[pk].color,rate:ts>0?Math.round((td/ts)*100):0,totalScore:ts,totalDone:td}); }); });
    return result;
  };

  // 전략: 파란색 계열, 업무: 초록색 계열로 구분
  const ItemBar = ({ item, cat, idx, isLast }) => {
    const key=`${cat}_${idx}`; const isOpen=openItem===key;
    const members=getMemberRates(item,cat);
    const ts=members.reduce((s,m)=>s+m.totalScore,0); const td=members.reduce((s,m)=>s+m.totalDone,0);
    const rate=ts>0?Math.round((td/ts)*100):0;
    const barColor = cat==="전략"?"#3b82f6":"#22c55e";
    const textColor = cat==="전략"?"#1d4ed8":"#166534";
    const bgColor   = cat==="전략"?"#eff6ff":"#f0fdf4";
    const rateC = r=>r>=80?"#4a7c59":r>=50?"#b8860b":"#c0703a";
    const done80 = members.filter(m=>m.rate>=80).length;
    const done50 = members.filter(m=>m.rate>=50&&m.rate<80).length;
    const notYet = members.filter(m=>m.rate<50).length;
    return (
      <div style={{marginBottom:isLast?"0":"10px",paddingBottom:isLast?"0":"10px",borderBottom:isLast?"none":`1px dashed ${barColor}20`}}>
        <div onClick={()=>setOpenItem(isOpen?null:key)} style={{cursor:"pointer"}}>
          {/* 제목 행 */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"5px"}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:"5px",marginBottom:"2px",flexWrap:"wrap"}}>
                <span style={{width:"7px",height:"7px",borderRadius:"50%",background:barColor,flexShrink:0,display:"inline-block"}} />
                <span style={{fontWeight:"700",fontSize:"11px",color:textColor,flexShrink:0}}>{item.label}</span>
                {item.score&&<span style={{fontSize:"9px",color:"#fff",background:barColor,padding:"1px 6px",borderRadius:"4px",fontWeight:"700",flexShrink:0}}>{item.score}점</span>}
                <span style={{fontSize:"8px",color:barColor,background:bgColor,padding:"1px 5px",borderRadius:"6px",border:`1px solid ${barColor}30`,flexShrink:0}}>{members.length}명 {isOpen?"▲":"▼"}</span>
              </div>
              {item.desc&&<div style={{fontSize:"9px",color:"#64748b",paddingLeft:"12px",lineHeight:"1.4"}}>{item.desc}</div>}
            </div>
            <div style={{textAlign:"right",flexShrink:0,marginLeft:"10px"}}>
              <div style={{fontSize:"16px",fontWeight:"900",color:rateC(rate),lineHeight:1}}>{rate}%</div>
              <div style={{fontSize:"8px",color:"#94a3b8",marginTop:"1px"}}>{td}/{ts}점</div>
            </div>
          </div>
          {/* 진행률 바 */}
          <div style={{height:"6px",background:"#e8e8e8",borderRadius:"3px",overflow:"hidden",marginBottom:"5px"}}>
            <div style={{height:"100%",width:`${Math.min(rate,100)}%`,background:barColor,borderRadius:"3px",transition:"width 0.5s"}} />
          </div>
        </div>
        {isOpen&&(
          <div style={{marginTop:"8px",background:bgColor,border:`1px solid ${barColor}30`,borderRadius:"6px",padding:"8px 10px"}}>
            {members.map((m,mi)=>(
              <div key={mi} style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:mi<members.length-1?"6px":"0"}}>
                <span style={{fontSize:"9px",fontWeight:"700",color:m.partColor,background:m.partColor+"18",padding:"1px 5px",borderRadius:"4px",flexShrink:0,minWidth:"22px",textAlign:"center"}}>{m.part}</span>
                <button onClick={e=>{ e.stopPropagation(); setDashPopup({name:m.name,cat,groupLabel:item.label,groupMatch:item.match}); }}
                  style={{fontSize:"11px",fontWeight:"600",color:"#1e293b",minWidth:"36px",flexShrink:0,background:"none",border:"none",cursor:"pointer",padding:"1px 4px",borderRadius:"4px",textDecoration:"underline",textDecorationColor:"#94a3b8"}}>
                  {m.name}
                </button>
                <div style={{flex:1,height:"5px",background:"#e2e8f0",borderRadius:"3px",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min(m.rate,100)}%`,background:rateC(m.rate),borderRadius:"3px"}} />
                </div>
                <span style={{fontSize:"11px",fontWeight:"800",color:rateC(m.rate),minWidth:"34px",textAlign:"right"}}>{m.rate}%</span>
                <span style={{fontSize:"9px",color:"#94a3b8",minWidth:"44px",textAlign:"right"}}>{m.totalDone}/{m.totalScore}점</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const MiniBar = ({ rate, color, width=80 }) => (
    <div style={{display:"flex",alignItems:"center",gap:"3px"}}>
      <div style={{width:`${width}px`,height:"5px",background:"#e8d5c0",borderRadius:"2px",overflow:"hidden",flexShrink:0}}><div style={{height:"100%",width:`${Math.min(rate,100)}%`,background:color,borderRadius:"2px"}} /></div>
      <span style={{fontSize:"11px",fontWeight:"700",color,minWidth:"30px"}}>{rate}%</span>
    </div>
  );
  const COLS = "64px 1fr 1fr 1fr 1fr 6px 1fr 1fr 1fr 1fr";

  const PartSection = ({ pk, rowH=30 }) => {
    const pd=MEMBERS[pk]; const pm=allData[pk];
    const avgRate=Math.round(pm.reduce((s,m)=>s+calcRate(m.goals),0)/pm.length);
    const allT=pm.reduce((s,m)=>s+(allWork[m.name]||[]).length,0);
    const allD=pm.reduce((s,m)=>s+(allWork[m.name]||[]).filter(t=>t.상태==="완료").length,0);
    const allU=allT-allD; const allWR=allT>0?Math.round((allD/allT)*100):0;
    return (
      <div style={{background:"#fff",border:"1px solid #d4b896",borderRadius:"8px",overflow:"hidden",marginBottom:"6px"}}>
        <div style={{display:"grid",gridTemplateColumns:COLS,height:"28px",alignItems:"center"}}>
          {/* 좌측: 목표 영역 - 파트 색상 */}
          <div style={{gridColumn:"1/6",display:"grid",gridTemplateColumns:"64px 1fr 1fr 1fr 1fr",background:pd.color,height:"100%",alignItems:"center",padding:"0 8px"}}>
            <div style={{fontSize:"11px",color:"#fff",fontWeight:"700"}}>{pd.label}</div>
            {["전략","업무","개인","진행률"].map(l=><div key={l} style={{textAlign:"center",fontSize:"8px",color:"rgba(255,255,255,0.8)"}}>{l}</div>)}
          </div>
          {/* 구분선 */}
          <div style={{background:"#fff",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:"1px",height:"16px",background:"#cbd5e1"}} />
          </div>
          {/* 우측: 업무현황 영역 - 남색 */}
          <div style={{gridColumn:"7/11",display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",background:"linear-gradient(135deg,#1e3a5f,#2563ab)",height:"100%",alignItems:"center",padding:"0 8px"}}>
            {["완료","미완료","완료율","변경일"].map(l=><div key={l} style={{textAlign:"center",fontSize:"8px",color:"rgba(255,255,255,0.85)",fontWeight:"600"}}>{l}</div>)}
          </div>
        </div>
        {pm.map((m,mi)=>{
          const r=calcRate(m.goals); const tasks=allWork[m.name]||[];
          const total=tasks.length; const done=tasks.filter(t=>t.상태==="완료").length;
          const und=total-done; const wr=total>0?Math.round((done/total)*100):0;
          const wc=rc(wr); const undColor=und===0?"#4a7c59":und<=3?"#b8860b":"#c0703a";
          const formatDate = (str) => {
            if(!str) return "-";
            // 2026-03-18 또는 2026-03-18 09:30 형식
            const m = str.match(/(\d{4}[-./])?(\d{1,2})[-./\s](\d{1,2})/);
            if(m) return `${m[2].padStart(2,"0")}-${m[3].padStart(2,"0")}`;
            return str.slice(0,5);
          };
          const lastDate=(()=>{
            const allLogs = tasks.flatMap(t=>t.이력||[]);
            if(allLogs.length>0){
              const latest = allLogs.map(l=>l.시각||"").filter(Boolean).sort().reverse()[0];
              return latest ? formatDate(latest) : "-";
            }
            const registered = tasks.filter(x=>x.접수일).sort((a,b)=>b.접수일.localeCompare(a.접수일))[0];
            return registered ? formatDate(registered.접수일) : "-";
          })();
          return (
            <div key={m.name} onClick={()=>onNavigate(pk,mi)} onMouseEnter={e=>e.currentTarget.style.background="#f5ede4"} onMouseLeave={e=>e.currentTarget.style.background=mi%2===0?"#fff":"#fdf8f4"}
              style={{display:"grid",gridTemplateColumns:COLS,padding:"0 8px",height:`${rowH}px`,borderTop:"1px solid #f0e8e0",background:mi%2===0?"#fff":"#fdf8f4",alignItems:"center",cursor:"pointer"}}>
              <div style={{fontSize:"11px",fontWeight:"600",color:"#3b1f0a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</div>
              <div style={{textAlign:"center",fontSize:"11px",color:"#1d4ed8",fontWeight:"600"}}>{m.전략}%</div>
              <div style={{textAlign:"center",fontSize:"11px",color:"#166534",fontWeight:"600"}}>{m.업무}%</div>
              <div style={{textAlign:"center",fontSize:"11px",color:"#a0785a",fontWeight:"600"}}>{m.개인}%</div>
              <div style={{paddingLeft:"2px"}}><MiniBar rate={r} color={rc(r)} /></div>
              <div style={{borderLeft:"1px solid #e8d5c0",height:"18px"}} />
              <div style={{textAlign:"center",fontSize:"11px",fontWeight:"700",color:"#2563ab"}}>{done}</div>
              <div style={{textAlign:"center",fontSize:"11px",fontWeight:"700",color:undColor}}>{und}</div>
              <div style={{paddingLeft:"2px"}}><MiniBar rate={wr} color="#2563ab" /></div>
              <div style={{textAlign:"center",fontSize:"11px",color:"#1e3a5f",fontWeight:"600"}}>{lastDate}</div>
            </div>
          );
        })}
        <div style={{display:"grid",gridTemplateColumns:COLS,padding:"0 8px",height:"24px",background:pd.color+"18",borderTop:`1px solid ${pd.color}40`,alignItems:"center"}}>
          <div style={{fontSize:"11px",fontWeight:"700",color:pd.color}}>평균/합계</div>
          {["-","-","-"].map((v,i)=><div key={i} style={{textAlign:"center",fontSize:"11px",color:"#bbb"}}>{v}</div>)}
          <div style={{paddingLeft:"2px"}}><MiniBar rate={avgRate} color={pd.color} /></div>
          <div style={{borderLeft:"1px solid #e8d5c0",height:"14px"}} />
          <div style={{textAlign:"center",fontSize:"11px",fontWeight:"700",color:"#2563ab"}}>{allD}</div>
          <div style={{textAlign:"center",fontSize:"11px",fontWeight:"700",color:allU===0?"#2563ab":allU<=5?"#b8860b":"#c0703a"}}>{allU}</div>
          <div style={{paddingLeft:"2px"}}><MiniBar rate={allWR} color="#2563ab" /></div>
          <div style={{textAlign:"center",fontSize:"11px",color:"#1e3a5f"}}>-</div>
        </div>
      </div>
    );
  };

  const totalMembers=partKeys.reduce((s,p)=>s+allData[p].length,0);
  const totalRate=Math.round(partKeys.reduce((s,p)=>s+allData[p].reduce((ss,m)=>ss+calcRate(m.goals),0),0)/totalMembers);
  const totAll=partKeys.reduce((s,p)=>s+allData[p].reduce((ss,m)=>ss+(allWork[m.name]||[]).length,0),0);
  const totDone=partKeys.reduce((s,p)=>s+allData[p].reduce((ss,m)=>ss+(allWork[m.name]||[]).filter(t=>t.상태==="완료").length,0),0);
  const totUnd=totAll-totDone; const wRate=totAll>0?Math.round((totDone/totAll)*100):0;

  return (
    <div style={{width:"100%",height:"100%",overflowY:"auto",display:"flex",flexDirection:"column",background:"#faf6f1",boxSizing:"border-box"}}>

      {/* ── 섹션 1: 2026년 품질팀 목표 진행현황 ── */}
      <div style={{padding:"8px 16px 4px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
          <div style={{width:"3px",height:"14px",background:"#3b82f6",borderRadius:"2px"}} />
          <span style={{fontSize:"11px",fontWeight:"700",color:"#1e293b",letterSpacing:"0.5px"}}>2026년 품질팀 목표 진행현황</span>
          <div style={{flex:1,height:"1px",background:"#bfdbfe"}} />
        </div>
        <div style={{display:"flex",gap:"8px"}}>
          <div style={{flex:1,background:"#fff",border:"1px solid #bfdbfe",borderTop:"3px solid #3b82f6",borderRadius:"7px",padding:"8px 12px"}}>
            <div style={{fontSize:"9px",fontWeight:"700",color:"#1d4ed8",marginBottom:"6px",display:"flex",alignItems:"center",gap:"5px"}}>
              <span style={{width:"8px",height:"8px",borderRadius:"2px",background:"#3b82f6",display:"inline-block"}} />
              전략 목표 진행현황
            </div>
            {STRATEGY_ITEMS.map((item,i)=><ItemBar key={i} item={item} cat="전략" idx={i} isLast={i===STRATEGY_ITEMS.length-1} />)}
          </div>
          <div style={{flex:1,background:"#fff",border:"1px solid #bbf7d0",borderTop:"3px solid #22c55e",borderRadius:"7px",padding:"8px 12px"}}>
            <div style={{fontSize:"9px",fontWeight:"700",color:"#166534",marginBottom:"6px",display:"flex",alignItems:"center",gap:"5px"}}>
              <span style={{width:"8px",height:"8px",borderRadius:"2px",background:"#22c55e",display:"inline-block"}} />
              업무 목표 진행현황
            </div>
            {WORK_ITEMS.map((item,i)=><ItemBar key={i} item={item} cat="업무" idx={i} isLast={i===WORK_ITEMS.length-1} />)}
          </div>
        </div>
      </div>

      {/* ── 섹션 2: 팀원별 목표 및 업무진행현황 ── */}
      <div style={{padding:"6px 16px 4px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
          <div style={{width:"3px",height:"14px",background:"#6b4226",borderRadius:"2px"}} />
          <span style={{fontSize:"11px",fontWeight:"700",color:"#3b1f0a",letterSpacing:"0.5px"}}>팀원별 목표 및 업무진행현황</span>
          <div style={{flex:1,height:"1px",background:"#d4b896"}} />
        </div>
      </div>
      <div style={{flexShrink:0,display:"flex",gap:"8px",padding:"0 12px 12px",width:"100%",boxSizing:"border-box",alignItems:"flex-start"}}>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:"6px",minWidth:0}} ref={leftRef}>
          <PartSection pk="BS" rowH={30} /><PartSection pk="AS" rowH={30} /><PartSection pk="소송" rowH={30} />
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}><PartSection pk="QC" rowH={qcRowH} /></div>
      </div>

      {/* 대시보드 팀원 이름 클릭 팝업 */}
      {dashPopup&&(
        <MemberGoalPopup
          memberName={dashPopup.name}
          cat={dashPopup.cat}
          groupLabel={dashPopup.groupLabel}
          groupMatch={dashPopup.groupMatch}
          allData={allData}
          onClose={e=>{ e&&e.stopPropagation(); setDashPopup(null); }}
        />
      )}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab]   = useState("dashboard");
  const [showNotice, setShowNotice] = useState(false);
  const [resultModal, setResultModal] = useState(null);
  const [restoreModal, setRestoreModal] = useState(false);
  const [restoreText, setRestoreText]   = useState("");
  const [activePart, setActivePart]     = useState("QC");
  const [activeMember, setActiveMember] = useState(0);
  const [allData, setAllData] = useState(()=>{ const d={}; Object.entries(MEMBERS).forEach(([p,pd])=>{ d[p]=pd.members.map(m=>({...m,goals:m.goals.map(g=>({...g,실적:0,비고:"",결과:""}))})); }); return d; });
  const [allWork, setAllWork] = useState(()=>{ const d={}; Object.keys(WORK_DATA).forEach(n=>{ d[n]=[...(WORK_DATA[n]||[])]; }); return d; });
  const [allReq, setAllReq]   = useState(()=>({...REQUEST_DATA}));
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(()=>{ const h=localStorage.getItem('notice_hide_until'); if(h!==new Date().toISOString().slice(0,10)) setShowNotice(true); },[]);

  useEffect(()=>{
    const load=async()=>{
      try {
        const allNames=Object.values(MEMBERS).flatMap(pd=>pd.members.map(m=>m.name));
        const newData={};
        for(const [pk,pd] of Object.entries(MEMBERS)){ newData[pk]=await Promise.all(pd.members.map(async m=>{ const saved=await dbGet('goals',m.name); return {...m,goals:m.goals.map((g,gi)=>({...g,...(saved?.[String(gi)]||saved?.[gi]||{})}))}; })); }
        setAllData(newData);
        const newWork={};
        for(const name of allNames){ const saved=await dbGet('work',name); newWork[name]=saved?.tasks||[...(WORK_DATA[name]||[])]; }
        setAllWork(newWork);
        const savedReq=await dbGet('req','all'); if(savedReq) setAllReq(savedReq);
      } catch(e){ console.error(e); } finally { setStorageLoaded(true); }
    };
    load();
  },[]);

  const part=MEMBERS[activePart]; const members=allData[activePart]; const member=members[activeMember];
  const update=(gi,field,val)=>{ setAllData(prev=>{ const next={...prev}; next[activePart]=next[activePart].map((m,mi)=>mi!==activeMember?m:{...m,goals:m.goals.map((g,idx)=>idx!==gi?g:{...g,[field]:field==="실적"?Math.min(Number(val),g.배점):val})}); const mem=next[activePart]?.[activeMember]; if(mem){ const gd={}; mem.goals.forEach((g,gi)=>{ gd[gi]={실적:g.실적||0,비고:g.비고||'',결과:g.결과||''}; }); dbSet('goals',mem.name,gd); } return next; }); };
  const totalRate=calcRate(member.goals); const 배점합=member.goals.reduce((s,g)=>s+g.배점,0); const 실적합=member.goals.reduce((s,g)=>s+(g.실적||0),0);

  if(!storageLoaded) return (
    <div style={{fontFamily:"'Noto Sans KR','Malgun Gothic',sans-serif",background:"#faf6f1",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"12px"}}>
      <div style={{width:"36px",height:"36px",border:"3px solid #e8d5c0",borderTop:"3px solid #8b5e3c",borderRadius:"50%",animation:"spin 0.8s linear infinite"}} />
      <div style={{fontSize:"13px",color:"#8b6a4a"}}>데이터 불러오는 중...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{fontFamily:"'Noto Sans KR','Malgun Gothic',sans-serif",background:"#faf6f1",color:"#3b2a1a",display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,right:0,bottom:0,overflow:"hidden",boxSizing:"border-box"}}>
      {/* 헤더 */}
      <div style={{background:"linear-gradient(135deg,#0d1117,#161b22,#1c2128)",borderBottom:"2px solid #e36209",padding:"12px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <div style={{width:"4px",height:"28px",background:"linear-gradient(#f97316,#fb923c)",borderRadius:"2px",boxShadow:"0 0 8px #f9731680"}} />
          <div onClick={()=>setActiveTab("dashboard")} style={{cursor:"pointer"}}
            onMouseEnter={e=>{ e.currentTarget.querySelector('.title-text').style.opacity="0.75"; e.currentTarget.querySelector('.title-hint').style.opacity="1"; }}
            onMouseLeave={e=>{ e.currentTarget.querySelector('.title-text').style.opacity="1"; e.currentTarget.querySelector('.title-hint').style.opacity="0"; }}>
            <div style={{fontSize:"10px",letterSpacing:"4px",color:"#f97316",textTransform:"uppercase",fontWeight:"600"}}>2026</div>
            <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
              <div className="title-text" style={{fontSize:"16px",fontWeight:"700",color:"#f0f6fc",letterSpacing:"0.3px",transition:"opacity 0.15s"}}>품질팀 전략목표 및 업무목표 진행 현황</div>
              <div className="title-hint" style={{fontSize:"10px",color:"rgba(255,255,255,0.5)",opacity:0,transition:"opacity 0.15s",whiteSpace:"nowrap"}}>📊 대시보드로 이동</div>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
          {/* 전략: 파란 버튼, 업무: 초록 버튼, 개인: 브라운 버튼 */}
          {[
            {cat:"전략", bg:"rgba(59,130,246,0.25)", border:"rgba(59,130,246,0.5)"},
            {cat:"업무", bg:"rgba(34,197,94,0.2)",  border:"rgba(34,197,94,0.5)"},
            {cat:"개인", bg:"rgba(255,255,255,0.12)",border:"rgba(255,255,255,0.25)"},
          ].map(({cat,bg,border})=>{ const cnt=Object.values(allData).flat().reduce((s,m)=>s+m.goals.filter(g=>g.cat===cat&&g.배점>0&&(g.결과||"").trim()).length,0);
            return <button key={cat} onClick={()=>setResultModal({cat,initialGroup:0})}
              style={{display:"flex",alignItems:"center",gap:"5px",padding:"5px 14px",background:bg,border:`1px solid ${border}`,borderRadius:"16px",color:"#f5d5b5",fontSize:"11px",fontWeight:"600",cursor:"pointer"}}>
              {cat} 목표{cnt>0&&<span style={{background:"rgba(255,255,255,0.25)",color:"#fff",fontSize:"10px",fontWeight:"800",padding:"1px 6px",borderRadius:"9px"}}>{cnt}</span>}
            </button>; })}
          <div style={{width:"1px",height:"20px",background:"rgba(255,255,255,0.2)"}} />
          <button onClick={()=>setShowNotice(true)} style={{padding:"4px 10px",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:"10px",color:"#f5d5b5",fontSize:"12px",cursor:"pointer"}}>📢 공지</button>
          <div style={{width:"1px",height:"20px",background:"rgba(255,255,255,0.2)"}} />
          <button onClick={()=>{ const bk={allData,allWork,allReq,savedAt:new Date().toISOString()}; navigator.clipboard.writeText(JSON.stringify(bk)).then(()=>alert("✅ 백업 완료!")).catch(()=>alert("클립보드 복사 실패")); }} style={{padding:"4px 8px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"10px",color:"#c9a880",fontSize:"13px",cursor:"pointer"}}>BK</button>
          <button onClick={()=>{ setRestoreText(""); setRestoreModal(true); }} style={{padding:"4px 8px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"10px",color:"#c9a880",fontSize:"13px",cursor:"pointer"}}>RS</button>
        </div>
      </div>

      {/* 탭 - 파트별 요약 카드 */}
      <div style={{display:"flex",background:"#f0e6d8",borderBottom:"1px solid #c4a882",flexShrink:0,alignItems:"stretch",padding:"6px 12px",gap:"6px"}}>
        {/* 팀 목표달성률 */}
        <div onClick={()=>setActiveTab("dashboard")} style={{background:"linear-gradient(135deg,#5c3317,#8b5e3c)",borderRadius:"8px",padding:"6px 12px",color:"#fff",display:"flex",flexDirection:"column",justifyContent:"center",minWidth:"90px",flexShrink:0,cursor:"pointer"}}>
          <div style={{fontSize:"8px",color:"#f5d5b5",marginBottom:"1px"}}>팀 목표달성률</div>
          <div style={{fontSize:"20px",fontWeight:"900",lineHeight:1}}>{Object.values(allData).flat().length>0?Math.round(Object.entries(MEMBERS).reduce((s,[p])=>s+allData[p].reduce((ss,m)=>ss+calcRate(m.goals),0),0)/Object.values(MEMBERS).reduce((s,pd)=>s+pd.members.length,0)):0}<span style={{fontSize:"9px"}}>%</span></div>
          <div style={{fontSize:"8px",color:"#f5d5b5",marginTop:"1px"}}>총 {Object.values(MEMBERS).reduce((s,pd)=>s+pd.members.length,0)}명</div>
        </div>
        {/* 파트별 목표 카드 */}
        {Object.entries(MEMBERS).map(([key,pd])=>{
          const pm=allData[key];
          const avg=Math.round(pm.reduce((s,m)=>s+calcRate(m.goals),0)/pm.length);
          const isA=activeTab==="detail"&&activePart===key;
          const rc2=r=>r>=80?"#4a7c59":r>=50?"#b8860b":"#c0703a";
          return (
            <div key={key} onClick={()=>{ setActiveTab("detail"); setActivePart(key); setActiveMember(0); }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 2px 8px ${pd.color}40`}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}
              style={{background:"#fff",border:`1px solid ${pd.color}30`,borderTop:`3px solid ${isA?pd.color:pd.color+"80"}`,borderRadius:"8px",padding:"5px 10px",cursor:"pointer",flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between",transition:"all 0.15s",boxShadow:isA?`0 2px 8px ${pd.color}40`:"none",opacity:isA?1:0.85}}>
              <div style={{fontSize:"9px",color:pd.color,fontWeight:"700"}}>{pd.label}</div>
              <div style={{fontSize:"18px",fontWeight:"900",color:rc2(avg),lineHeight:1}}>{avg}<span style={{fontSize:"8px"}}>%</span></div>
              <div style={{height:"3px",background:"#e8d5c0",borderRadius:"2px",overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.min(avg,100)}%`,background:pd.color,borderRadius:"2px"}} />
              </div>
            </div>
          );
        })}
        <div style={{width:"1px",background:"#c4a882",flexShrink:0,margin:"2px 0"}} />
        {/* 전체 업무 */}
        <div onClick={()=>setActiveTab("dashboard")} style={{background:"linear-gradient(135deg,#1e3a5f,#2563ab)",borderRadius:"8px",padding:"6px 12px",color:"#fff",display:"flex",flexDirection:"column",justifyContent:"center",minWidth:"90px",flexShrink:0,cursor:"pointer"}}>
          <div style={{fontSize:"8px",color:"rgba(255,255,255,0.7)",marginBottom:"1px"}}>전체 업무</div>
          <div style={{fontSize:"20px",fontWeight:"900",lineHeight:1}}>{Object.entries(MEMBERS).reduce((s,[,pd])=>s+pd.members.reduce((ss,m)=>ss+(allWork[m.name]||[]).length,0),0)}</div>
          <div style={{fontSize:"8px",color:"rgba(255,255,255,0.7)",marginTop:"1px"}}>
            미완료 {Object.entries(MEMBERS).reduce((s,[,pd])=>s+pd.members.reduce((ss,m)=>ss+(allWork[m.name]||[]).filter(t=>t.상태!=="완료").length,0),0)}
          </div>
        </div>
        {/* 파트별 업무 카드 */}
        {Object.entries(MEMBERS).map(([key,pd])=>{
          const pm=allData[key];
          const pAll=pm.reduce((s,m)=>s+(allWork[m.name]||[]).length,0);
          const pDone=pm.reduce((s,m)=>s+(allWork[m.name]||[]).filter(t=>t.상태==="완료").length,0);
          const pUnd=pAll-pDone;
          const pWR=pAll>0?Math.round((pDone/pAll)*100):0;
          const uc=pUnd===0?"#4a7c59":pUnd<=5?"#b8860b":"#c0703a";
          return (
            <div key={key} onClick={()=>{ setActiveTab("detail"); setActivePart(key); setActiveMember(0); }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 8px #2563ab30"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}
              style={{background:"#fff",border:"1px solid #bfdbfe",borderTop:"3px solid #2563ab",borderRadius:"8px",padding:"5px 10px",cursor:"pointer",flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between",transition:"box-shadow 0.15s"}}>
              <div style={{fontSize:"9px",color:"#1e3a5f",fontWeight:"700"}}>{pd.label}</div>
              <div style={{display:"flex",alignItems:"flex-end",gap:"3px"}}>
                <span style={{fontSize:"16px",fontWeight:"900",color:uc,lineHeight:1}}>{pUnd}</span>
                <span style={{fontSize:"8px",color:"#94a3b8",marginBottom:"1px"}}>미완료</span>
              </div>
              <div style={{fontSize:"8px",color:"#94a3b8"}}>전체 {pAll} · {pWR}%</div>
            </div>
          );
        })}
      </div>

      {/* 콘텐츠 */}
      <div style={{flex:1,overflow:"hidden",display:"flex"}}>
        {activeTab==="dashboard"
          ? <div style={{flex:1,overflow:"hidden",display:"flex"}}><Dashboard allData={allData} allWork={allWork} onNavigate={(p,mi)=>{ setActiveTab("detail"); setActivePart(p); setActiveMember(mi??0); }} /></div>
          : <>
              {/* 팀원 사이드바 */}
              <div style={{width:"160px",minWidth:"160px",background:"#f0e6d8",borderRight:"1px solid #c4a882",overflowY:"auto"}}>
                {members.map((m,i)=>{ const r=calcRate(m.goals); const isA=activeMember===i;
                  return <button key={m.name} onClick={()=>setActiveMember(i)} style={{display:"block",width:"100%",padding:"12px 14px",textAlign:"left",border:"none",cursor:"pointer",background:isA?"#fff":"transparent",borderLeft:`3px solid ${isA?part.color:"transparent"}`,borderBottom:"1px solid #d4b896"}}>
                    <div style={{fontSize:"13px",fontWeight:isA?"700":"400",color:isA?"#3b1f0a":"#7a5c40"}}>{m.name}</div>
                    <div style={{fontSize:"10px",color:rateColor(r),marginTop:"3px"}}>달성 {r}%</div>
                    <Bar rate={r} />
                  </button>; })}
              </div>

              <div style={{flex:1,display:"flex",overflow:"hidden"}}>
                {/* 좌측: 목표 관리 (브라운 계열) */}
                <div style={{width:"50%",borderRight:"2px solid #475569",overflowY:"auto",background:"#faf6f1",display:"flex",flexDirection:"column"}}>
                  <div style={{padding:"12px 20px",borderBottom:"2px solid #d4b896",background:"linear-gradient(135deg,#5c3317,#8b5e3c)",flexShrink:0}}>
                    <div style={{fontSize:"9px",color:"rgba(255,255,255,0.7)",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"2px"}}>2026 팀원 목표</div>
                    <div style={{fontSize:"14px",fontWeight:"700",color:"#fff",display:"flex",alignItems:"center",gap:"6px"}}>
                      <span style={{fontSize:"16px"}}>🎯</span> 개인별 목표 관리
                    </div>
                  </div>
                  <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                        <span style={{fontSize:"9px",fontWeight:"700",color:part.color,background:part.color+"18",border:`1px solid ${part.color}50`,padding:"2px 8px",borderRadius:"8px"}}>{part.label.replace(" 파트","")}</span>
                        <div style={{fontSize:"15px",fontWeight:"700",color:"#3b1f0a"}}>{member.name}</div>
                        <div style={{fontSize:"10px",color:"#8b6a4a"}}>전략 {member.전략}점 · 업무 {member.업무}점 · 개인 {member.개인}점</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:"22px",fontWeight:"800",color:rateColor(totalRate)}}>{totalRate}<span style={{fontSize:"11px"}}>%</span></div>
                        <div style={{fontSize:"10px",color:"#8b6a4a"}}>{실적합}/{배점합}점</div>
                      </div>
                    </div>
                    <div style={{height:"7px",background:"#d4b896",borderRadius:"4px",marginBottom:"14px",overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.min(totalRate,100)}%`,background:`linear-gradient(90deg,${part.color},${rateColor(totalRate)})`,borderRadius:"4px",transition:"width 0.5s"}} />
                    </div>
                    {member.goals.map((g,gi)=>{
                      const pct=g.배점>0?Math.round(((g.실적||0)/g.배점)*100):0;
                      // 전략: 파란, 업무: 초록, 개인: 브라운
                      const goalBorderColor = g.cat==="전략"?"#3b82f6":g.cat==="업무"?"#22c55e":CAT_COLOR[g.cat];
                      const goalBgColor = g.cat==="전략"?"#eff6ff":g.cat==="업무"?"#f0fdf4":CAT_BG[g.cat];
                      const goalTextColor = g.cat==="전략"?"#1d4ed8":g.cat==="업무"?"#166534":CAT_COLOR[g.cat];
                      return (
                        <div key={gi} style={{background:"#fff",border:"1px solid #e2e8f0",borderLeft:`4px solid ${goalBorderColor}`,borderRadius:"7px",padding:"12px 14px",marginBottom:"10px",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"4px"}}>
                            <div style={{flex:1,marginRight:"8px"}}>
                              <span style={{fontSize:"9px",background:goalBgColor,color:goalTextColor,padding:"1px 7px",borderRadius:"8px",marginRight:"5px",fontWeight:"700",border:`1px solid ${goalBorderColor}40`}}>{g.cat}</span>
                              <span style={{fontSize:"12px",fontWeight:"600",color:"#1e293b"}}>{g.과제}</span>
                            </div>
                            <span style={{fontSize:"10px",color:"#94a3b8",whiteSpace:"nowrap"}}>{g.배점}점</span>
                          </div>
                          <div style={{fontSize:"10px",color:"#64748b",lineHeight:"1.5",marginBottom:"7px",whiteSpace:"pre-line"}}>{g.내용}</div>
                          <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"5px"}}>
                            <label style={{fontSize:"10px",color:"#64748b",whiteSpace:"nowrap"}}>실적</label>
                            <input type="number" min="0" max={g.배점} value={g.실적||0} onChange={e=>update(gi,"실적",Math.min(Math.max(0,Number(e.target.value)),g.배점))}
                              style={{width:"50px",background:goalBgColor,border:`1px solid ${(g.실적||0)>=g.배점&&g.배점>0?"#4a7c59":goalBorderColor}`,borderRadius:"4px",color:"#1e293b",padding:"3px 6px",fontSize:"12px",fontWeight:"700",textAlign:"center"}} />
                            <span style={{fontSize:"10px",color:"#94a3b8"}}>/ {g.배점}점</span>
                            <span style={{fontSize:"10px",fontWeight:"800",color:"#fff",background:rateColor(pct),padding:"2px 8px",borderRadius:"10px",minWidth:"34px",textAlign:"center"}}>{pct}%</span>
                          </div>
                          <div style={{height:"5px",background:"#e2e8f0",borderRadius:"3px",overflow:"hidden",marginBottom:"8px"}}>
                            <div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:goalBorderColor,borderRadius:"3px",transition:"width 0.5s"}} />
                          </div>
                          <div style={{marginBottom:"6px"}}>
                            <div style={{fontSize:"9px",color:"#94a3b8",marginBottom:"2px",fontWeight:"600"}}>현재 진행현황</div>
                            <textarea value={g.비고||""} onChange={e=>update(gi,"비고",e.target.value)} placeholder="진행 상황 입력" rows={2}
                              style={{width:"100%",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"4px",color:"#475569",padding:"4px 6px",fontSize:"10px",lineHeight:"1.5",resize:"vertical",boxSizing:"border-box",fontFamily:"inherit",outline:"none"}} />
                          </div>
                          <ResultEditor gi={gi} 결과={g.결과||""} update={update} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 우측: 업무 현황 (다크 슬레이트 계열 - 목표와 명확히 구분) */}
                <WorkPanel name={member.name} partColor={part.color} workData={allWork} setWorkData={setAllWork} reqData={allReq} setReqData={setAllReq} />
              </div>
            </>
        }
      </div>

      {/* 복원 모달 */}
      {restoreModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(59,26,10,0.5)",zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setRestoreModal(false)}>
          <div style={{background:"#faf6f1",borderRadius:"10px",width:"520px",maxWidth:"94vw",boxShadow:"0 8px 32px rgba(91,51,23,0.3)"}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:"14px 20px",background:"#5c3317",borderRadius:"10px 10px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:"14px",fontWeight:"700",color:"#fff"}}>📂 데이터 복원</div>
              <button onClick={()=>setRestoreModal(false)} style={{background:"none",border:"none",fontSize:"18px",color:"rgba(255,255,255,0.8)",cursor:"pointer"}}>✕</button>
            </div>
            <div style={{padding:"16px 20px"}}>
              <div style={{fontSize:"11px",color:"#8b6a4a",marginBottom:"8px"}}>백업 텍스트를 아래에 붙여넣기 하세요 (Ctrl+V)</div>
              <textarea value={restoreText} onChange={e=>setRestoreText(e.target.value)} placeholder="백업 텍스트를 여기에 붙여넣기 하세요..." rows={6}
                style={{width:"100%",padding:"8px 10px",border:"1px solid #c4a882",borderRadius:"5px",fontSize:"11px",color:"#3b1f0a",background:"#fff",resize:"none",boxSizing:"border-box",fontFamily:"inherit",outline:"none"}} />
              <div style={{display:"flex",justifyContent:"flex-end",gap:"8px",marginTop:"10px"}}>
                <button onClick={()=>setRestoreModal(false)} style={{padding:"6px 16px",background:"#e8d5c0",border:"none",borderRadius:"8px",fontSize:"11px",color:"#6b4226",cursor:"pointer",fontWeight:"600"}}>취소</button>
                <button onClick={async()=>{
                  try {
                    const data=JSON.parse(restoreText);
                    if(data.allData) setAllData(data.allData); if(data.allWork) setAllWork(data.allWork); if(data.allReq) setAllReq(data.allReq);
                    try {
                      for(const pk of Object.keys(data.allData||{})){ for(const m of (data.allData[pk]||[])){ const gd={}; (m.goals||[]).forEach((g,gi)=>{ gd[gi]={실적:g.실적||0,비고:g.비고||'',결과:g.결과||''}; }); await dbSet('goals',m.name,gd); } }
                      for(const [name,tasks] of Object.entries(data.allWork||{})){ await dbSet('work',name,{tasks:Array.isArray(tasks)?tasks:[]}); }
                      if(data.allReq) await dbSet('req','all',data.allReq);
                    } catch(e){ console.error(e); }
                    setRestoreModal(false); setRestoreText(""); alert(`✅ 복원 완료!\n저장일시: ${data.savedAt?new Date(data.savedAt).toLocaleString("ko-KR"):"알 수 없음"}`);
                  } catch(err){ alert("❌ 형식이 올바르지 않습니다."); }
                }} style={{padding:"6px 18px",background:"#5c3317",border:"none",borderRadius:"8px",fontSize:"11px",color:"#fff",cursor:"pointer",fontWeight:"700"}}>복원 실행</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showNotice&&<NoticeModal onClose={()=>setShowNotice(false)} />}
      {resultModal&&<ResultModal cat={resultModal.cat} initialGroup={resultModal.initialGroup} allData={allData} onClose={()=>setResultModal(null)} />}
    </div>
  );
}
