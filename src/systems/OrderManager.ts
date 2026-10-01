import type { Formation, Order, OrderPreview, OrderStatus, Point, Unit } from '../models/game'

export type OrderTransition={orderId:string;from:OrderStatus;to:OrderStatus}
export const orderTypeLabel={move:'이동',hold:'위치 사수',follow:'추종',reorganize:'재편성',changeFormation:'대형 변경',attack:'공격',recon:'정찰',search:'수색',resupply:'재보급'} as const
export const statusLabel:Record<OrderStatus,string>={queued:'대기열',transmitting:'전송 중',received:'수신 완료',preparing:'준비 중',executing:'실행 중',completed:'완료',cancelled:'취소'}

export function commandDelay(distance:number){void distance;return 0}
export function makePreview(type:Order['type'],units:Unit[],formation:Formation|undefined,destination?:Point,targetUnitId?:number):OrderPreview{
  const members=units.filter(u=>formation?formation.unitIds.includes(u.id):true),center=members.length?{x:members.reduce((s,u)=>s+u.x,0)/members.length,y:members.reduce((s,u)=>s+u.y,0)/members.length}:{x:0,y:0}
  const distance=destination?Math.hypot(destination.x-center.x,destination.y-center.y):0
  return{type,issuerId:'player',targetUnitIds:members.map(u=>u.id),formationId:formation?.id,destination,targetUnitId,transmissionDuration:0,preparationDuration:0,estimatedDistance:distance}
}
export function createOrder(preview:OrderPreview,time:number):Order{const {estimatedDistance:_,...data}=preview;void _;return{...data,id:`order-${time.toFixed(2)}-${Math.random().toString(36).slice(2,6)}`,status:'queued',createdAt:time,phaseStartedAt:time,priority:'normal'}}
const owner=(o:Order)=>o.formationId??`units:${[...o.targetUnitIds].sort().join(',')}`
export function pruneOrders(orders:Order[]){
  const history=orders.filter(o=>['completed','cancelled'].includes(o.status)).slice(-60),keep=new Set(history.map(o=>o.id))
  return orders.filter(o=>!['completed','cancelled'].includes(o.status)||keep.has(o.id))
}
export function enqueueOrder(orders:Order[],order:Order,append:boolean){
  if(append)return pruneOrders([...orders,order])
  return pruneOrders([...orders.map(o=>owner(o)===owner(order)&&!['completed','cancelled'].includes(o.status)?{...o,status:'cancelled' as const,cancelReason:'replaced',completedAt:order.createdAt}:o),order])
}
export function cancelOrder(orders:Order[],id:string,time:number){return orders.map(o=>o.id===id?{...o,status:'cancelled' as const,cancelReason:'player',completedAt:time}:o)}

export function processOrders(orders:Order[],time:number,units:Unit[]):{orders:Order[];transitions:OrderTransition[]} {
  const transitions:OrderTransition[]=[]
  const activeByOwner=new Map<string,string>()
  orders.forEach(o=>{if(!['completed','cancelled'].includes(o.status)&&o.status!=='queued'&&!activeByOwner.has(owner(o)))activeByOwner.set(owner(o),o.id)})
  const next=orders.map(order=>{
    if(['completed','cancelled'].includes(order.status))return order
    const key=owner(order),active=activeByOwner.get(key)
    let to:OrderStatus|undefined
    if(order.status==='queued'&&!active){to='executing';activeByOwner.set(key,order.id)}
    else if(order.status==='transmitting'&&time-order.phaseStartedAt>=order.transmissionDuration)to='received'
    else if(order.status==='received'&&time-order.phaseStartedAt>=.6)to='preparing'
    else if(order.status==='preparing'&&time-order.phaseStartedAt>=order.preparationDuration)to='executing'
    else if(order.status==='executing'){
      const members=units.filter(u=>order.targetUnitIds.includes(u.id))
      if(['move','recon','search'].includes(order.type)&&members.length&&members.every(u=>!u.path.length))to='completed'
      else if(order.type==='resupply'&&members.length&&members.every(u=>u.supply.ammunition/u.supply.maxAmmunition>=.98&&u.supply.fuel/u.supply.maxFuel>=.98))to='completed'
      else if(order.type==='attack'&&order.targetUnitId&&units.find(u=>u.id===order.targetUnitId)?.combatState==='destroyed')to='completed'
      else if(['hold','reorganize','changeFormation'].includes(order.type)&&time-order.phaseStartedAt>=.4)to='completed'
    }
    if(!to)return order
    transitions.push({orderId:order.id,from:order.status,to})
    return{...order,status:to,phaseStartedAt:time,startedAt:to==='executing'?time:order.startedAt,completedAt:to==='completed'?time:order.completedAt}
  })
  return{orders:pruneOrders(next),transitions}
}

export function ordersForSelection(orders:Order[],unitIds:number[],formationId?:string){return orders.filter(o=>formationId?o.formationId===formationId:o.targetUnitIds.some(id=>unitIds.includes(id)))}
