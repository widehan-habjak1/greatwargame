import { cities, forests, WORLD } from '../data/battlefield'
import type { DetectionQuality, Faction, FogGrid, InformationState, KnowledgeBase, PerceptionNotice, PerceptionState, Point, Unit, UnitType } from '../models/game'

const VISION:Record<UnitType,number>={보병:320,기계화:430,기갑:390,포병:260,정찰:760,공병:300}
const CELL=160
const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y)
const inForest=(p:Point)=>forests.some(f=>p.x>=f.x&&p.x<=f.x+f.w&&p.y>=f.y&&p.y<=f.y+f.h)
const inCity=(p:Point)=>cities.some(c=>distance(p,c)<(c.major?70:48))

const makeFog=():FogGrid=>({cellSize:CELL,cols:Math.ceil(WORLD.width/CELL),rows:Math.ceil(WORLD.height/CELL),explored:new Set(),visible:new Set()})
export const createPerceptionState=():PerceptionState=>({player:{faction:'player',contacts:{}},enemy:{faction:'enemy',contacts:{}},playerFog:makeFog(),enemyFog:makeFog(),updatedAt:0})

function hasLineOfSight(observer:Unit,target:Unit){
  const steps=Math.max(5,Math.ceil(distance(observer,target)/70));let obstruction=0
  for(let i=1;i<steps;i++){const t=i/steps,p={x:observer.x+(target.x-observer.x)*t,y:observer.y+(target.y-observer.y)*t};if(inForest(p))obstruction+=observer.type==='정찰'?.45:1;if(inCity(p))obstruction+=.7}
  return obstruction<Math.max(2.2,steps*.16)
}

function updateFog(base:FogGrid,observers:Unit[]){
  const visible=new Set<number>(),explored=new Set(base.explored)
  observers.forEach(u=>{const range=VISION[u.type],minX=Math.max(0,Math.floor((u.x-range)/CELL)),maxX=Math.min(base.cols-1,Math.floor((u.x+range)/CELL)),minY=Math.max(0,Math.floor((u.y-range)/CELL)),maxY=Math.min(base.rows-1,Math.floor((u.y+range)/CELL));for(let cy=minY;cy<=maxY;cy++)for(let cx=minX;cx<=maxX;cx++){const p={x:(cx+.5)*CELL,y:(cy+.5)*CELL};if(distance(u,p)<=range){const index=cy*base.cols+cx;visible.add(index);explored.add(index)}}})
  return{...base,visible,explored}
}

const approximatePosition=(unit:Unit,time:number)=>{const angle=(unit.id*2.399+Math.floor(time/20))%(Math.PI*2),spread=55+(unit.id%4)*22;return{x:unit.x+Math.cos(angle)*spread,y:unit.y+Math.sin(angle)*spread}}

function updateKnowledge(base:KnowledgeBase,units:Unit[],time:number,activityIds:Set<number>){
  const observers=units.filter(u=>u.faction===base.faction&&u.combatState!=='destroyed'),targets=units.filter(u=>u.faction!==base.faction&&u.combatState!=='destroyed'),contacts={...base.contacts},notices:PerceptionNotice[]=[]
  targets.forEach(target=>{
    const previous=contacts[target.id],visibleObserver=observers.find(o=>distance(o,target)<=VISION[o.type]*(inForest(target)?.72:1)&&hasLineOfSight(o,target)),detectObserver=observers.find(o=>distance(o,target)<=o.detectionRange*(o.type==='정찰'?1.35:1)*(inForest(target)?.7:1))
    let state:InformationState='unknown',quality:DetectionQuality='unknown',position=previous?.lastKnownPosition??{x:target.x,y:target.y}
    if(visibleObserver){state='visible';quality='confirmed';position={x:target.x,y:target.y}}
    else if(detectObserver){state='detected';quality='approximate';position=approximatePosition(target,time)}
    else if(activityIds.has(target.id)){state='detected';quality='approximate';position=approximatePosition(target,time)}
    else if(previous&&previous.state!=='unknown'){state='lost';quality=previous.quality;position=previous.lastKnownPosition}
    if(state==='unknown')return
    const newlySeen=!previous||previous.state==='unknown',rediscovered=previous?.state==='lost'&&(state==='visible'||state==='detected'),becameVisible=state==='visible'&&previous?.state!=='visible',becameLost=state==='lost'&&previous?.state!=='lost'
    if(newlySeen)notices.push({faction:base.faction,unitId:target.id,type:activityIds.has(target.id)?'activity':'detected'})
    else if(rediscovered)notices.push({faction:base.faction,unitId:target.id,type:'rediscovered'})
    else if(becameVisible)notices.push({faction:base.faction,unitId:target.id,type:'identified'})
    else if(becameLost)notices.push({faction:base.faction,unitId:target.id,type:'lost'})
    const lastSeenAt=state==='visible'||state==='detected'?time:previous?.lastSeenAt??time,confidence=state==='visible'?100:state==='detected'?72:Math.max(8,(previous?.confidence??70)-(time-lastSeenAt)*.35)
    contacts[target.id]={unitId:target.id,state,quality,lastKnownPosition:position,lastSeenAt,confidence,knownType:state==='visible'?target.type:previous?.knownType,knownStrength:state==='visible'?target.strength.current:previous?.knownStrength,knownCallSign:state==='visible'?target.callSign:previous?.knownCallSign}
  })
  return{knowledge:{...base,contacts},notices}
}

export function updatePerception(previous:PerceptionState,units:Unit[],time:number,activityIds:Set<number>=new Set()){
  const playerResult=updateKnowledge(previous.player,units,time,activityIds),enemyResult=updateKnowledge(previous.enemy,units,time,activityIds)
  return{state:{player:playerResult.knowledge,enemy:enemyResult.knowledge,playerFog:updateFog(previous.playerFog,units.filter(u=>u.faction==='player'&&u.combatState!=='destroyed')),enemyFog:updateFog(previous.enemyFog,units.filter(u=>u.faction==='enemy'&&u.combatState!=='destroyed')),updatedAt:time},notices:[...playerResult.notices,...enemyResult.notices]}
}

export const visibleEnemyIds=(knowledge:KnowledgeBase)=>new Set(Object.values(knowledge.contacts).filter(c=>c.state==='visible').map(c=>c.unitId))
export function knownWorldForFaction(faction:Faction,units:Unit[],knowledge:KnowledgeBase){
  const friendlies=units.filter(u=>u.faction===faction),known=Object.values(knowledge.contacts).filter(c=>c.state!=='unknown'&&c.confidence>7).reduce<Unit[]>((result,contact)=>{const actual=units.find(u=>u.id===contact.unitId);if(actual)result.push({...actual,x:contact.lastKnownPosition.x,y:contact.lastKnownPosition.y,type:contact.knownType??'보병',callSign:contact.knownCallSign??'CONTACT',strength:{current:contact.knownStrength??100,max:actual.strength.max},intelligenceState:contact.state});return result},[])
  return[...friendlies,...known]
}
