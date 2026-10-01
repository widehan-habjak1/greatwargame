import type { GameEvent } from '../models/game'

const time=(value:number)=>{const m=Math.floor(value%1440);return`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`}
export function EventLog({events}:{events:GameEvent[]}){
  return <aside className="event-log"><header><span>작전 이벤트</span><small>LIVE FEED</small></header><div>{events.slice(0,8).map(e=><p key={e.id} className={e.type}><time>{time(e.timestamp)}</time><span>{e.message}</span></p>)}</div></aside>
}
