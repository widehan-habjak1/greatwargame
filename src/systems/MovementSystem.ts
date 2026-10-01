import { bridges, forests, roads } from '../data/battlefield'
import type { Point, TerrainType, Unit } from '../models/game'
import { createUnitSupply, FUEL_USE, supplySpeedFactor } from './SupplySystem'

const distanceToSegment = (p:Point,a:Point,b:Point) => {
  const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy
  const t=l?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/l)):0
  return Math.hypot(p.x-(a.x+t*dx),p.y-(a.y+t*dy))
}

const riverAnchors=[
  [{x:970,y:0},{x:1060,y:620},{x:1160,y:1450},{x:1210,y:2370},{x:1370,y:3440},{x:1460,y:4840},{x:1610,y:6560},{x:1800,y:8420},{x:1970,y:10000}],
  [{x:5260,y:0},{x:5420,y:1120},{x:5500,y:2300},{x:5600,y:3560},{x:5790,y:4840},{x:6000,y:6500},{x:6180,y:8260},{x:6460,y:10000}],
]
const riverXAt=(anchors:Point[],y:number)=>{const upper=anchors.findIndex(p=>p.y>=y);if(upper<=0)return anchors[0].x;const a=anchors[upper-1],b=anchors[upper],t=(y-a.y)/(b.y-a.y);return a.x+(b.x-a.x)*t}
const sideOfRiver=(p:Point,anchors:Point[])=>p.x-riverXAt(anchors,p.y)
const crossesRiver=(a:Point,b:Point,anchors:Point[])=>sideOfRiver(a,anchors)*sideOfRiver(b,anchors)<0
const nearBridgeCrossing=(a:Point,b:Point)=>bridges.some(bridge=>Math.abs(a.y-bridge.y)<75&&Math.abs(b.y-bridge.y)<75&&Math.hypot((a.x+b.x)/2-bridge.x,(a.y+b.y)/2-bridge.y)<95)

export function terrainAt(p:Point):TerrainType {
  if(bridges.some(b=>Math.hypot(p.x-b.x,p.y-b.y)<48)) return 'bridge'
  if(riverAnchors.some(anchors=>Math.abs(sideOfRiver(p,anchors))<25))return 'river'
  if(forests.some(f=>p.x>=f.x&&p.x<=f.x+f.w&&p.y>=f.y&&p.y<=f.y+f.h)) return 'forest'
  if(roads.some(line=>line.some((q,i)=>i>0&&distanceToSegment(p,line[i-1],q)<18))) return 'road'
  return 'plain'
}

export function createPath(unit:Unit,target:Point):Point[] {
  const start={x:unit.x,y:unit.y},riverBands=riverAnchors.map((anchors,index)=>({anchors,bridges:bridges.filter(b=>index===0?b.x<3000:b.x>4000)}))
  const crossed=riverBands.filter(r=>crossesRiver(start,target,r.anchors)).sort((a,b)=>unit.x<target.x?riverXAt(a.anchors,unit.y)-riverXAt(b.anchors,unit.y):riverXAt(b.anchors,unit.y)-riverXAt(a.anchors,unit.y))
  if(!crossed.length)return[target]
  const midpointY=(unit.y+target.y)/2,path:Point[]=[]
  crossed.forEach(r=>{const bridge=r.bridges.reduce((best,b)=>Math.abs(b.y-midpointY)<Math.abs(best.y-midpointY)?b:best),side=sideOfRiver(start,r.anchors)<0?-1:1;path.push({x:bridge.x+side*70,y:bridge.y},{x:bridge.x-side*70,y:bridge.y})})
  return[...path,target]
}

export type MovementNotice={unitId:number;type:'terrain'|'arrival';terrain?:TerrainType}
export function updateMovement(units:Unit[],delta:number,environmentFactor=1):{units:Unit[];notices:MovementNotice[]} {
  const notices:MovementNotice[]=[]
  const next:Unit[]=units.map(unit=>{
    if(!unit.path.length)return unit
    let destination=unit.path[0]
    const current={x:unit.x,y:unit.y},unbridgedCrossing=riverAnchors.some(anchors=>crossesRiver(current,destination,anchors))&&!nearBridgeCrossing(current,destination)
    if(unbridgedCrossing){const corrected=createPath(unit,destination);destination=corrected[0];unit={...unit,path:[...corrected,...unit.path.slice(1)]}}
    const terrain=terrainAt(current)
    const modifier=terrain==='road'||terrain==='bridge'?1.5:terrain==='forest'?.6:1
    const dx=destination.x-unit.x,dy=destination.y-unit.y,d=Math.hypot(dx,dy),approach=Math.max(.28,Math.min(1,d/75)),step=(unit.synchronizedSpeed??unit.baseSpeed)*modifier*approach*delta*supplySpeedFactor(unit)*environmentFactor
    if(terrain!==unit.terrain)notices.push({unitId:unit.id,type:'terrain',terrain})
    if(step<=0)return{...unit,status:'대기',path:[]}
    const baseSupply=unit.supply??createUnitSupply(unit.type),travelled=Math.min(d,step),fuelCost=travelled*FUEL_USE[unit.type]*(terrain==='road'||terrain==='bridge'?.7:terrain==='forest'?1.3:1),supply={...baseSupply,fuel:Math.max(0,baseSupply.fuel-fuelCost)}
    if(d<=Math.max(step,1.2)){const path=unit.path.slice(1);if(!path.length)notices.push({unitId:unit.id,type:'arrival'});return{...unit,x:destination.x,y:destination.y,path,status:path.length?'이동 중' as const:'대기' as const,terrain,supply,synchronizedSpeed:path.length?unit.synchronizedSpeed:undefined}}
    return{...unit,x:unit.x+dx/d*step,y:unit.y+dy/d*step,status:'이동 중',terrain,supply}
  })
  return{units:next,notices}
}
