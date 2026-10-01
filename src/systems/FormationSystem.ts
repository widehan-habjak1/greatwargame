import type { Formation, FormationType, Point, Unit } from '../models/game'
import { createPath } from './MovementSystem'

export const formationLabel:Record<FormationType,string>={line:'횡대',column:'종대',wedge:'쐐기'}

export function formationOffsets(type:FormationType,count:number,spacing=105):Point[]{
  if(type==='column')return Array.from({length:count},(_,i)=>({x:0,y:(i-(count-1)/2)*spacing}))
  if(type==='wedge')return Array.from({length:count},(_,i)=>i===0?{x:0,y:-spacing*.7}:{x:(i%2? -1:1)*Math.ceil(i/2)*spacing*.72,y:Math.ceil(i/2)*spacing*.64})
  return Array.from({length:count},(_,i)=>({x:(i-(count-1)/2)*spacing,y:0}))
}

const rotate=(p:Point,a:number):Point=>({x:p.x*Math.cos(a)-p.y*Math.sin(a),y:p.x*Math.sin(a)+p.y*Math.cos(a)})
export const formationCenter=(formation:Formation,units:Unit[])=>{const members=units.filter(u=>formation.unitIds.includes(u.id));return members.length?{x:members.reduce((s,u)=>s+u.x,0)/members.length,y:members.reduce((s,u)=>s+u.y,0)/members.length}:formation.center}

export function arrangeFormation(formation:Formation,units:Unit[],center:Point,heading:number,status:'대형 정렬'|'이동 중'='대형 정렬'){
  const offsets=formationOffsets(formation.type,formation.unitIds.length),members=units.filter(u=>formation.unitIds.includes(u.id)),slowest=Math.min(...members.map(u=>u.baseSpeed))
  return units.map(unit=>{const slot=formation.unitIds.indexOf(unit.id);if(slot<0)return unit;const off=rotate(offsets[slot],heading),target={x:center.x+off.x,y:center.y+off.y};return{...unit,formationSlot:slot,parentFormationId:formation.id,path:createPath(unit,target),status,synchronizedSpeed:slowest}})
}

export function commandFormation(formation:Formation,units:Unit[],destination:Point){
  const center=formationCenter(formation,units),heading=Math.atan2(destination.y-center.y,destination.x-center.x)
  return{formation:{...formation,center,destination,heading,status:'이동 중' as const},units:arrangeFormation(formation,units,destination,heading,'이동 중')}
}

export function cohesionError(formation:Formation,units:Unit[]){
  const center=formationCenter(formation,units),offsets=formationOffsets(formation.type,formation.unitIds.length)
  return Math.max(0,...formation.unitIds.map((id,i)=>{const u=units.find(v=>v.id===id);if(!u)return 0;const o=rotate(offsets[i],formation.heading);return Math.hypot(u.x-(center.x+o.x),u.y-(center.y+o.y))}))
}
