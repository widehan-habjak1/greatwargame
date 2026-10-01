import type { FormationType, MapMode, OrderStatus, OrderType, TimeOfDay, UnitType, Weather } from './models/game'

export type Language='ko'|'en'

const ko={
  operation:'작전명',title:'무난하고 빠른 전면전',classified:'기밀',ally:'아군',enemy:'적군',sites:'거점',contacts:'접촉',visible:'가시',lost:'소실',day:'제 {day}일',phase:'PHASE 8',
  unitIntel:'적군 정보',singleUnit:'개별 부대',combatPower:'전투 전력',combatStatus:'전투 상태',weaponRange:'무기 사거리',currentTarget:'현재 목표',nextShot:'다음 사격',armor:'장갑',position:'현재 위치',none:'없음',selectAll:'전체 선택',hold:'위치 사수',focus:'부대로 이동',multiSelect:'다중 선택',unitsSelected:'{count}개 부대 선택',formationStatus:'편대 상태',independentGroup:'독립 그룹',multiHelp:'우클릭으로 그룹 이동하거나 편대를 창설하십시오',createFormation:'편대 창설',selectedFormation:'선택 편대',currentFormation:'현재 대형',formationSpeed:'편대 속도',cohesionError:'결속 오차',chooseFormation:'대형 선택',disband:'편대 해체',
  attack:'공격',move:'이동',follow:'추종',recon:'지역 정찰',search:'수색',reorganize:'재편성',orderQueue:'명령 큐',active:'ACTIVE',noOrders:'활성 명령 없음',cancelOrder:'현재 명령 취소',recentOrders:'최근 명령 기록',
  aiStatus:'상태',aiObjective:'목표',forceRatio:'전력비',lastDecision:'최근 판단',observing:'관측 중',initialAnalysis:'초기 전장 분석',decisionCycle:'판단 주기 {seconds}s · 명령 즉시 실행',
  mission:'임무',missionLimit:'작전 제한 시간',hoursMinutes:'{hours}시간 {minutes}분',defending:'방어 유지 중 · 적 점령 시 즉시 실패',save:'저장',load:'불러오기',restart:'재시작',closeMission:'미션 창 닫기',
  plain:'평야',forest:'삼림',river:'하천',road:'도로',strategicSite:'전략 거점',paused:'작전 일시정지',pauseHelp:'카메라와 명령 입력은 활성 상태입니다',missionComplete:'MISSION COMPLETE',missionFailed:'MISSION FAILED',afterAction:'AFTER ACTION REVIEW',operationTime:'작전 시간 {hours}시간 {minutes}분 · 아군 손실 {allies}개 부대 · 적 전투 불능 {enemies}개 부대',restartScenario:'시나리오 다시 시작',
  clickFollow:'따라갈 부대를 클릭하십시오',clickAttack:'공격할 적 또는 마지막 확인 위치를 클릭하십시오',clickRecon:'정찰할 지역을 클릭하십시오',clickSearch:'수색할 지역을 클릭하십시오',clickDestination:'목적지를 클릭하십시오',cancel:'취소',commandNet:'COMMAND NET',battleNet:'전투 지휘망 / CH. 04',mapMode:'지도 모드',supplyNet:'보급망',resupply:'재보급',pause:'정지',enemySelect:'적 선택',completeSim:'COMPLETE SIM',events:'작전 이벤트',liveFeed:'LIVE FEED',language:'EN',
  weather:{CLEAR:'맑음',RAIN:'강우'} as Record<Weather,string>,timeOfDay:{NIGHT:'야간',MORNING:'아침',DAY:'주간',EVENING:'저녁'} as Record<TimeOfDay,string>,mapModes:{NORMAL:'일반',SUPPLY:'보급',INTELLIGENCE:'정보',COMMAND:'지휘',COMBAT:'전투'} as Record<MapMode,string>,
  orders:{move:'이동',hold:'위치 사수',follow:'추종',reorganize:'재편성',changeFormation:'대형 변경',attack:'공격',recon:'정찰',search:'수색',resupply:'재보급'} as Record<OrderType,string>,
  orderStatus:{queued:'대기열',transmitting:'전송 중',received:'수신 완료',preparing:'준비 중',executing:'실행 중',completed:'완료',cancelled:'취소'} as Record<OrderStatus,string>,
  formations:{line:'횡대',column:'종대',wedge:'쐐기'} as Record<FormationType,string>,unitTypes:{보병:'보병',기계화:'기계화',기갑:'기갑',포병:'포병',정찰:'정찰',공병:'공병'} as Record<UnitType,string>,
  missionName:'무난하고 빠른 전면전',briefing:'서부 교두보를 방어하면서 아른하임 지휘소와 칼슈타트 탄약창을 확보하고 적 기동단을 무력화하십시오.',objectives:{'defend-hq':['서부 전선 지휘소 방어','주 지휘소를 적에게 빼앗기지 마십시오.'],'capture-arnheim':['아른하임 전쟁기지 점령','적 전선 지휘의 중심을 확보하십시오.'],'capture-ammo':['칼슈타트 탄약창 점령','적 전선의 탄약 보급을 차단하십시오.'],'destroy-mobile':['적 기동단 무력화','적 전차·정찰 기동부대를 전투 불능으로 만드십시오.']} as Record<string,[string,string]>,
}

const en={
  ...ko,operation:'OPERATION',title:'A Straightforward Blitz',classified:'CLASSIFIED',ally:'ALLIES',enemy:'ENEMY',sites:'SITES',contacts:'CONTACTS',visible:'VISIBLE',lost:'LOST',day:'DAY {day}',
  unitIntel:'ENEMY INTEL',singleUnit:'UNIT',combatPower:'COMBAT STRENGTH',combatStatus:'COMBAT STATUS',weaponRange:'WEAPON RANGE',currentTarget:'CURRENT TARGET',nextShot:'NEXT SHOT',armor:'ARMOR',position:'POSITION',none:'NONE',selectAll:'SELECT FORMATION',hold:'HOLD POSITION',focus:'FOCUS UNIT',multiSelect:'MULTI SELECT',unitsSelected:'{count} UNITS SELECTED',formationStatus:'FORMATION STATUS',independentGroup:'INDEPENDENT GROUP',multiHelp:'Right-click to move as a group, or create a formation.',createFormation:'CREATE FORMATION',selectedFormation:'FORMATION',currentFormation:'CURRENT FORMATION',formationSpeed:'FORMATION SPEED',cohesionError:'COHESION ERROR',chooseFormation:'FORMATION TYPE',disband:'DISBAND FORMATION',
  attack:'ATTACK',move:'MOVE',follow:'FOLLOW',recon:'RECON AREA',search:'SEARCH',reorganize:'REORGANIZE',orderQueue:'ORDER QUEUE',noOrders:'NO ACTIVE ORDERS',cancelOrder:'CANCEL CURRENT ORDER',recentOrders:'RECENT ORDER HISTORY',
  aiStatus:'STATUS',aiObjective:'OBJECTIVE',forceRatio:'FORCE RATIO',lastDecision:'LAST DECISION',observing:'OBSERVING',initialAnalysis:'INITIAL BATTLEFIELD ANALYSIS',decisionCycle:'DECISION CYCLE {seconds}s · ORDERS EXECUTE IMMEDIATELY',
  mission:'MISSION',missionLimit:'TIME REMAINING',hoursMinutes:'{hours}h {minutes}m',defending:'Holding · mission fails if captured',save:'SAVE',load:'LOAD',restart:'RESTART',closeMission:'Close mission panel',
  plain:'PLAIN',forest:'FOREST',river:'RIVER',road:'ROAD',strategicSite:'STRATEGIC SITE',paused:'OPERATION PAUSED',pauseHelp:'Camera and command input remain active.',operationTime:'Operation time {hours}h {minutes}m · Allied losses {allies} · Enemy disabled {enemies}',restartScenario:'RESTART SCENARIO',
  clickFollow:'Click the unit to follow',clickAttack:'Click an enemy or last known position',clickRecon:'Click an area to recon',clickSearch:'Click an area to search',clickDestination:'Click a destination',cancel:'CANCEL',battleNet:'BATTLE COMMAND NET / CH. 04',mapMode:'MAP MODE',supplyNet:'SUPPLY',resupply:'RESUPPLY',pause:'PAUSE',enemySelect:'SELECT ENEMY',language:'한국어',
  events:'OPERATION EVENTS',weather:{CLEAR:'CLEAR',RAIN:'RAIN'} as Record<Weather,string>,timeOfDay:{NIGHT:'NIGHT',MORNING:'MORNING',DAY:'DAY',EVENING:'EVENING'} as Record<TimeOfDay,string>,mapModes:{NORMAL:'NORMAL',SUPPLY:'SUPPLY',INTELLIGENCE:'INTELLIGENCE',COMMAND:'COMMAND',COMBAT:'COMBAT'} as Record<MapMode,string>,
  orders:{move:'MOVE',hold:'HOLD',follow:'FOLLOW',reorganize:'REORGANIZE',changeFormation:'CHANGE FORMATION',attack:'ATTACK',recon:'RECON',search:'SEARCH',resupply:'RESUPPLY'} as Record<OrderType,string>,
  orderStatus:{queued:'QUEUED',transmitting:'TRANSMITTING',received:'RECEIVED',preparing:'PREPARING',executing:'EXECUTING',completed:'COMPLETED',cancelled:'CANCELLED'} as Record<OrderStatus,string>,
  formations:{line:'LINE',column:'COLUMN',wedge:'WEDGE'} as Record<FormationType,string>,unitTypes:{보병:'INFANTRY',기계화:'MECHANIZED',기갑:'ARMORED',포병:'ARTILLERY',정찰:'RECON',공병:'ENGINEERS'} as Record<UnitType,string>,
  missionName:'A Straightforward Blitz',briefing:'Defend the western bridgehead, capture the Arnhem command post and Kalstadt ammunition depot, and neutralize the enemy mobile group.',objectives:{'defend-hq':['Defend Western Command Post','Do not allow the enemy to capture the main command post.'],'capture-arnheim':['Capture Arnhem Command Post','Secure the center of enemy frontline command.'],'capture-ammo':['Capture Kalstadt Ammo Depot','Cut off the enemy frontline ammunition supply.'],'destroy-mobile':['Neutralize Enemy Mobile Group','Disable the enemy tank and reconnaissance units.']} as Record<string,[string,string]>,
}

export const COPY={ko,en}
export type Copy=typeof ko
export const format=(value:string,values:Record<string,string|number>)=>Object.entries(values).reduce((result,[key,replacement])=>result.replace(`{${key}}`,String(replacement)),value)
