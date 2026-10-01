import type { Point, StrategicSite, Unit } from '../models/game'

export const WORLD = { width: 10000, height: 10000 }
export const forests = [{id:'northwest',x:210,y:160,w:510,h:300},{id:'northeast',x:1360,y:120,w:510,h:320},{id:'southeast',x:1330,y:850,w:380,h:390},{id:'southwest',x:210,y:1050,w:310,h:260},{id:'blackwood',x:2320,y:180,w:780,h:430},{id:'eastwood',x:3370,y:620,w:570,h:690},{id:'southern-pines',x:2450,y:1900,w:650,h:560},{id:'riverwood',x:650,y:1850,w:540,h:610},{id:'waldmark',x:4420,y:180,w:920,h:520},{id:'fir-ridge',x:5750,y:720,w:680,h:760},{id:'deep-east',x:6640,y:180,w:650,h:980},{id:'green-belt',x:4180,y:1960,w:730,h:610},{id:'wolfwood',x:5310,y:2780,w:920,h:690},{id:'south-march',x:2850,y:3480,w:870,h:700},{id:'lower-pines',x:640,y:3550,w:760,h:840},{id:'border-wood',x:6470,y:3800,w:780,h:650}]
export const cities=[{name:'하르덴',x:420,y:400,major:false},{name:'벨로프',x:1120,y:500,major:true},{name:'칼슈타트',x:1690,y:340,major:false},{name:'아른하임',x:1850,y:1030,major:true},{name:'로젠',x:1080,y:1190,major:false},{name:'드라벤',x:2620,y:820,major:true},{name:'에버하임',x:3530,y:430,major:false},{name:'노르트펠트',x:3750,y:1780,major:true},{name:'브뤼크',x:2010,y:2120,major:false},{name:'잘츠도르프',x:940,y:2410,major:true},{name:'발데른',x:4550,y:760,major:true},{name:'그라우펠트',x:5520,y:410,major:false},{name:'오스트하임',x:6670,y:660,major:true},{name:'카이저브뤼크',x:4870,y:1660,major:false},{name:'하겐',x:5980,y:1940,major:true},{name:'엘렌도르프',x:7040,y:1520,major:false},{name:'미텔발트',x:4520,y:2850,major:true},{name:'크로이츠',x:5880,y:3420,major:false},{name:'쥐트하펜',x:6860,y:4230,major:true},{name:'바렌',x:2110,y:3910,major:true},{name:'웨스트마르크',x:620,y:4380,major:false}]
export const villages=[{name:'린덴',x:580,y:1560},{name:'오버탈',x:1520,y:1720},{name:'슈타인',x:2260,y:1390},{name:'발트호프',x:3150,y:1510},{name:'클라인브뤼크',x:3330,y:2350},{name:'호헨',x:1550,y:2490},{name:'도르프',x:4210,y:1240},{name:'아이헨',x:5170,y:980},{name:'노이탈',x:6280,y:1320},{name:'펠젠',x:7120,y:2480},{name:'라우흐',x:5260,y:2380},{name:'알트브뤼크',x:3820,y:3020},{name:'쾨니히스펠트',x:4820,y:3710},{name:'잘름',x:3090,y:4310},{name:'브루넨',x:1180,y:3290}]
export const farms=[{x:260,y:1460,w:420,h:250},{x:1290,y:1470,w:500,h:310},{x:2720,y:1120,w:510,h:300},{x:3330,y:1930,w:540,h:270},{x:1350,y:2150,w:430,h:270},{x:4300,y:920,w:560,h:340},{x:5280,y:1370,w:620,h:310},{x:6500,y:1870,w:580,h:360},{x:3920,y:2660,w:510,h:320},{x:4860,y:3180,w:590,h:360},{x:1580,y:3340,w:560,h:330},{x:2240,y:4180,w:620,h:350}]
export const hills=[{x:2050,y:340,rx:310,ry:190,name:'고지 204'},{x:3100,y:780,rx:280,ry:180,name:'회색 구릉'},{x:1880,y:1580,rx:350,ry:220,name:'독수리 능선'},{x:3480,y:2520,rx:380,ry:200,name:'남부 고지'},{x:4890,y:450,rx:390,ry:220,name:'발데른 능선'},{x:5780,y:1160,rx:330,ry:210,name:'철십자 고지'},{x:6830,y:2870,rx:440,ry:260,name:'동부 구릉'},{x:4290,y:3980,rx:470,ry:250,name:'황혼 능선'},{x:1960,y:3180,rx:410,ry:230,name:'서부 고원'}]
export const lakes=[{x:2790,y:1570,rx:250,ry:145,name:'라우엔 호'},{x:5200,y:2160,rx:330,ry:190,name:'에르렌 호'},{x:6750,y:3420,rx:280,ry:175,name:'검은 호수'},{x:3450,y:4010,rx:360,ry:210,name:'남부 호'}]
export const roads:Point[][] = [
  [{x:30,y:1040},{x:420,y:400},{x:1120,y:500},{x:1690,y:340},{x:2380,y:470}],
  [{x:120,y:1250},{x:1080,y:1190},{x:1850,y:1030},{x:2330,y:770}],
  [{x:1120,y:500},{x:1080,y:1190}],
  [{x:1690,y:340},{x:2620,y:820},{x:3530,y:430},{x:4140,y:670}],
  [{x:1850,y:1030},{x:2260,y:1390},{x:3150,y:1510},{x:3750,y:1780},{x:4140,y:2050}],
  [{x:1080,y:1190},{x:1520,y:1720},{x:2010,y:2120},{x:3330,y:2350},{x:3990,y:2660}],
  [{x:80,y:2380},{x:940,y:2410},{x:1550,y:2490},{x:2010,y:2120}],
  [{x:3530,y:430},{x:4550,y:760},{x:5520,y:410},{x:6670,y:660},{x:7520,y:430}],
  [{x:3750,y:1780},{x:4210,y:1240},{x:4870,y:1660},{x:5980,y:1940},{x:7040,y:1520},{x:7560,y:1760}],
  [{x:4550,y:760},{x:5170,y:980},{x:5980,y:1940}],
  [{x:3330,y:2350},{x:3820,y:3020},{x:4520,y:2850},{x:5260,y:2380},{x:5980,y:1940}],
  [{x:4520,y:2850},{x:4820,y:3710},{x:5880,y:3420},{x:6750,y:3420},{x:6860,y:4230},{x:7520,y:4520}],
  [{x:940,y:2410},{x:1180,y:3290},{x:2110,y:3910},{x:3090,y:4310},{x:4820,y:3710}],
  [{x:60,y:4510},{x:620,y:4380},{x:2110,y:3910},{x:3450,y:4010},{x:4820,y:3710}],
]
export const bridges=[{x:1076,y:497},{x:1122,y:1185},{x:1210,y:1910},{x:1285,y:2470},{x:1395,y:3310},{x:1460,y:4160},{x:1580,y:5480},{x:1710,y:6820},{x:1810,y:8240},{x:1940,y:9420},{x:5400,y:650},{x:5480,y:1840},{x:5610,y:2980},{x:5710,y:4110},{x:5890,y:5360},{x:6050,y:6680},{x:6180,y:8060},{x:6370,y:9360}]
export const STRATEGIC_SITES:StrategicSite[]=[
  {id:'west-hq',name:'서부 전선 지휘소',kind:'command_post',x:690,y:850,owner:'player',captureRadius:150,captureProgress:0,value:300,lootValue:180,lootedBy:[]},
  {id:'belov-supply',name:'벨로프 보급소',kind:'supply_depot',x:980,y:760,owner:'neutral',captureRadius:135,captureProgress:0,value:160,lootValue:120,lootedBy:[]},
  {id:'arnheim-cp',name:'아른하임 전쟁기지',kind:'command_post',x:1850,y:1030,owner:'enemy',captureRadius:175,captureProgress:0,value:350,lootValue:220,lootedBy:[]},
  {id:'kalstadt-ammo',name:'칼슈타트 탄약창',kind:'ammo_depot',x:1690,y:430,owner:'enemy',captureRadius:135,captureProgress:0,value:190,lootValue:160,lootedBy:[]},
  {id:'draven-air',name:'드라벤 공군기지',kind:'airbase',x:2700,y:700,owner:'enemy',captureRadius:210,captureProgress:0,value:420,lootValue:240,lootedBy:[]},
  {id:'eagle-radar',name:'독수리 능선 레이더',kind:'radar',x:2030,y:1530,owner:'neutral',captureRadius:140,captureProgress:0,value:230,lootValue:100,lootedBy:[]},
  {id:'bruck-rail',name:'브뤼크 철도역',kind:'rail_station',x:2010,y:2120,owner:'neutral',captureRadius:145,captureProgress:0,value:210,lootValue:120,lootedBy:[]},
  {id:'obertal-fuel',name:'오버탈 연료 저장소',kind:'fuel_depot',x:1520,y:1720,owner:'neutral',captureRadius:135,captureProgress:0,value:180,lootValue:150,lootedBy:[]},
  {id:'nord-med',name:'노르트펠트 야전병원',kind:'field_hospital',x:3630,y:1860,owner:'enemy',captureRadius:140,captureProgress:0,value:170,lootValue:80,lootedBy:[]},
  {id:'east-comms',name:'동부 장거리 통신소',kind:'communications',x:4550,y:760,owner:'enemy',captureRadius:145,captureProgress:0,value:250,lootValue:140,lootedBy:[]},
  {id:'hagen-supply',name:'하겐 군수 보급창',kind:'supply_depot',x:5980,y:1940,owner:'neutral',captureRadius:150,captureProgress:0,value:200,lootValue:160,lootedBy:[]},
  {id:'ost-air',name:'오스트하임 공군기지',kind:'airbase',x:6670,y:660,owner:'enemy',captureRadius:210,captureProgress:0,value:420,lootValue:240,lootedBy:[]},
  {id:'mittel-rail',name:'미텔발트 철도 조차장',kind:'rail_station',x:4520,y:2850,owner:'neutral',captureRadius:155,captureProgress:0,value:230,lootValue:140,lootedBy:[]},
  {id:'blacklake-radar',name:'검은 호수 방공 레이더',kind:'radar',x:6750,y:3150,owner:'enemy',captureRadius:150,captureProgress:0,value:260,lootValue:130,lootedBy:[]},
  {id:'south-hq',name:'남부 집단군 지휘소',kind:'command_post',x:4820,y:3710,owner:'neutral',captureRadius:180,captureProgress:0,value:360,lootValue:210,lootedBy:[]},
]
export const INITIAL_UNITS = [
  {id:1,name:'제3기갑여단',callSign:'ALPHA 3',type:'기갑',size:'여단',strength:{current:2380,max:2500},x:830,y:780,path:[],status:'대기',baseSpeed:34,terrain:'plain'},
  {id:2,name:'제2보병연대',callSign:'BRAVO 2',type:'보병',size:'연대',strength:{current:2910,max:3000},x:620,y:920,path:[],status:'대기',baseSpeed:20,terrain:'plain'},
  {id:3,name:'제5포병대대',callSign:'STEEL 5',type:'포병',size:'대대',strength:{current:710,max:720},x:510,y:1110,path:[],status:'대기',baseSpeed:15,terrain:'plain'},
  {id:4,name:'제7정찰중대',callSign:'ECHO 7',type:'정찰',size:'중대',strength:{current:118,max:120},x:1030,y:610,path:[],status:'대기',baseSpeed:43,terrain:'plain'},
  {id:5,name:'제11보병대대',callSign:'CHARLIE 11',type:'보병',size:'대대',strength:{current:790,max:800},x:740,y:1140,path:[],status:'대기',baseSpeed:21,terrain:'plain'},
  {id:6,name:'제1기갑대대',callSign:'SABER 1',type:'기갑',size:'대대',strength:{current:620,max:650},x:430,y:760,path:[],status:'대기',baseSpeed:36,terrain:'plain'},
  {id:7,name:'제4기계화대대',callSign:'VIPER 4',type:'기계화',size:'대대',strength:{current:760,max:800},x:560,y:680,path:[],status:'대기',baseSpeed:39,terrain:'plain'},
  {id:8,name:'제9기계화중대',callSign:'RAVEN 9',type:'기계화',size:'중대',strength:{current:142,max:150},x:720,y:650,path:[],status:'대기',baseSpeed:41,terrain:'plain'},
] as unknown as Unit[]

const supplyFor=(type:Unit['type'])=>{const ammo=type==='포병'?160:type==='기갑'?130:100,fuel=type==='보병'?70:type==='기갑'?150:type==='기계화'?135:100;return{ammunition:ammo,maxAmmunition:ammo,fuel,maxFuel:fuel,state:'SUPPLIED' as const,priority:'normal' as const,connected:true,lastResupplyTime:390}}
const combatDefaults={combatState:'none' as const,attackCooldown:0,detectionRange:390}
INITIAL_UNITS.forEach(u=>Object.assign(u,combatDefaults,{faction:'player',armor:u.type==='기갑'?8:u.type==='기계화'?4:u.type==='포병'?2:1,supply:supplyFor(u.type)}))
export const ENEMY_UNITS = [
  {id:101,name:'적 제1보병대대',callSign:'RED 1',type:'보병',size:'대대',strength:{current:800,max:800},x:1510,y:650,path:[],status:'위치 사수',baseSpeed:20,terrain:'plain',faction:'enemy',combatState:'none',attackCooldown:0,armor:1,detectionRange:360,parentFormationId:'enemy-line'},
  {id:102,name:'적 제2보병대대',callSign:'RED 2',type:'보병',size:'대대',strength:{current:780,max:800},x:1610,y:830,path:[],status:'위치 사수',baseSpeed:20,terrain:'plain',faction:'enemy',combatState:'none',attackCooldown:0,armor:1,detectionRange:360,parentFormationId:'enemy-line'},
  {id:103,name:'적 제1전차중대',callSign:'IRON 1',type:'기갑',size:'중대',strength:{current:150,max:150},x:1730,y:720,path:[],status:'위치 사수',baseSpeed:35,terrain:'plain',faction:'enemy',combatState:'none',attackCooldown:0,armor:8,detectionRange:430,parentFormationId:'enemy-armor'},
  {id:104,name:'적 제4포병중대',callSign:'THUNDER 4',type:'포병',size:'중대',strength:{current:120,max:120},x:1910,y:890,path:[],status:'위치 사수',baseSpeed:14,terrain:'plain',faction:'enemy',combatState:'none',attackCooldown:0,armor:2,detectionRange:550,parentFormationId:'enemy-support'},
  {id:105,name:'적 제3정찰중대',callSign:'FOX 3',type:'정찰',size:'중대',strength:{current:115,max:120},x:1810,y:620,path:[],status:'위치 사수',baseSpeed:43,terrain:'plain',faction:'enemy',combatState:'none',attackCooldown:0,armor:1,detectionRange:620,parentFormationId:'enemy-armor'},
  {id:106,name:'적 제6기계화중대',callSign:'RED 6',type:'기계화',size:'중대',strength:{current:145,max:150},x:1960,y:990,path:[],status:'위치 사수',baseSpeed:38,terrain:'plain',faction:'enemy',combatState:'none',attackCooldown:0,armor:4,detectionRange:420,parentFormationId:'enemy-support'},
  {id:107,name:'적 독립 정찰소대',callSign:'OWL 7',type:'정찰',size:'중대',strength:{current:82,max:90},x:2180,y:590,path:[],status:'대기',baseSpeed:46,terrain:'plain',faction:'enemy',combatState:'none',attackCooldown:0,armor:1,detectionRange:680},
  {id:108,name:'적 국경수비중대',callSign:'GUARD 8',type:'보병',size:'중대',strength:{current:135,max:150},x:2290,y:1240,path:[],status:'위치 사수',baseSpeed:22,terrain:'plain',faction:'enemy',combatState:'none',attackCooldown:0,armor:1,detectionRange:360},
  {id:109,name:'적 독립 공병중대',callSign:'PIONEER 9',type:'공병',size:'중대',strength:{current:125,max:140},x:2580,y:1510,path:[],status:'대기',baseSpeed:24,terrain:'plain',faction:'enemy',combatState:'none',attackCooldown:0,armor:2,detectionRange:340},
  {id:110,name:'적 독립 포병포대',callSign:'ANVIL 10',type:'포병',size:'중대',strength:{current:95,max:110},x:2860,y:1110,path:[],status:'위치 사수',baseSpeed:15,terrain:'plain',faction:'enemy',combatState:'none',attackCooldown:0,armor:2,detectionRange:560},
] as unknown as Unit[]
ENEMY_UNITS.forEach(u=>u.supply=supplyFor(u.type))
