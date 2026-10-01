export type Point = { x: number; y: number }
export type UnitType = '보병' | '기계화' | '기갑' | '포병' | '정찰' |'공병'
export type UnitSize = '중대' | '대대' | '연대' | '여단'
export type UnitStatus = '대기' | '이동 중' | '대형 정렬' | '재편성' | '위치 사수' | '재보급 중'
export type Faction = 'player' | 'enemy'
export type SiteOwner = Faction | 'neutral'
export type StrategicSiteKind = 'command_post'|'supply_depot'|'ammo_depot'|'airbase'|'rail_station'|'radar'|'field_hospital'|'communications'|'fuel_depot'
export type CombatState = 'none' | 'approaching' | 'detecting' | 'engaging' | 'attacking' | 'underFire' | 'disengaging' | 'destroyed'
export type TerrainType = 'plain' | 'forest' | 'river' | 'road' | 'city' | 'bridge'
export type SupplyState = 'SUPPLIED'|'LOW_SUPPLY'|'CRITICAL_SUPPLY'|'OUT_OF_SUPPLY'
export type SupplyPriority = 'normal'|'high'|'urgent'
export type UnitSupply = { ammunition:number; maxAmmunition:number; fuel:number; maxFuel:number; state:SupplyState; priority:SupplyPriority; connected:boolean; lastResupplyTime:number; disconnectedSince?:number; sourceId?:string; sourceName?:string; distance?:number }

export type Unit = {
  id: number
  name: string
  callSign: string
  type: UnitType
  x: number
  y: number
  path: Point[]
  status: UnitStatus
  baseSpeed: number
  terrain: TerrainType
  size: UnitSize
  strength: { current:number; max:number }
  parentFormationId?: string
  formationSlot?: number
  synchronizedSpeed?: number
  faction:Faction
  combatState:CombatState
  combatTargetId?:number
  movementPriority?:boolean
  reinforcementObjectiveId?:string
  attackCooldown:number
  armor:number
  detectionRange:number
  intelligenceState?:InformationState
  supply:UnitSupply
}

export type FormationType = 'line' | 'column' | 'wedge'
export type FormationStatus = '대기' | '이동 중' | '재편성' | '위치 사수'
export type Formation = { id:string; name:string; unitIds:number[]; type:FormationType; status:FormationStatus; center:Point; destination?:Point; heading:number }

export type GameEventType = 'selection' | 'order' | 'movement' | 'terrain' | 'arrival' | 'system' | 'formation'
export type GameEvent = { id: number; timestamp: number; type: GameEventType; message: string }
export type Camera = { x: number; y: number; zoom: number }

export type OrderType = 'move' | 'hold' | 'follow' | 'reorganize' | 'changeFormation' | 'attack' | 'recon' | 'search' | 'resupply'
export type OrderStatus = 'queued' | 'transmitting' | 'received' | 'preparing' | 'executing' | 'completed' | 'cancelled'
export type Order = {
  id:string; type:OrderType; issuerId:'player'|'enemy_commander'; targetUnitIds:number[]; formationId?:string
  destination?:Point; targetUnitId?:number; formationType?:FormationType; status:OrderStatus
  createdAt:number; phaseStartedAt:number; transmissionDuration:number; preparationDuration:number
  startedAt?:number; completedAt?:number; cancelReason?:string; priority:'normal'|'high'|'urgent'
}
export type OrderPreview = Omit<Order,'id'|'status'|'createdAt'|'phaseStartedAt'|'startedAt'|'completedAt'|'priority'> & { estimatedDistance:number }
export type Engagement = { id:string; attackerId:number; defenderId:number; startedAt:number; distance:number; state:'detecting'|'engaging'|'active' }
export type Projectile = { id:string; attackerId:number; targetId:number; x:number; y:number; targetX:number; targetY:number; progress:number; speed:number; hit:boolean; damage:number; kind:UnitType }
export type CombatNotice = { type:'detected'|'engaged'|'fired'|'hit'|'miss'|'destroyed'; unitId:number; targetId:number; damage?:number }

export type AIState = 'idle'|'patrolling'|'defending'|'attacking'|'reinforcing'|'retreating'|'pursuing'
export type AIObjective = { type:'defend_position'|'attack_position'|'destroy_formation'|'hold_front'; label:string; position:Point }
export type BattlefieldSnapshot = { friendlyUnits:Unit[]; hostileUnits:Unit[]; activeEngagements:Engagement[]; forceRatio:number; nearestThreatDistance:number; objectiveThreatened:boolean; contactDetected:boolean }
export type AIDecision = { state:AIState; score:number; reason:string; targetUnitId?:number; formationId?:string; destination?:Point; priority:'normal'|'high'|'urgent' }
export type BattlePlan = { summary:string; issuedOrderIds:string[]; createdAt:number }
export type EnemyCommander = { id:string; state:AIState; objective:AIObjective; decisionInterval:number; lastDecisionTime:number; lastDecision?:AIDecision; plan?:BattlePlan; snapshot?:BattlefieldSnapshot; resupplyingUnitIds?:number[] }
export type StrategicSite = { id:string; name:string; kind:StrategicSiteKind; x:number; y:number; owner:SiteOwner; captureRadius:number; captureProgress:number; capturingFaction?:Faction; value:number; lootValue:number; lootedBy:Faction[] }
export type InformationState = 'unknown'|'detected'|'visible'|'lost'
export type DetectionQuality = 'unknown'|'approximate'|'confirmed'
export type KnownContact = { unitId:number; state:InformationState; quality:DetectionQuality; lastKnownPosition:Point; lastSeenAt:number; confidence:number; knownType?:UnitType; knownStrength?:number; knownCallSign?:string }
export type KnowledgeBase = { faction:Faction; contacts:Record<number,KnownContact> }
export type FogGrid = { cellSize:number; cols:number; rows:number; explored:Set<number>; visible:Set<number> }
export type PerceptionState = { player:KnowledgeBase; enemy:KnowledgeBase; playerFog:FogGrid; enemyFog:FogGrid; updatedAt:number }
export type PerceptionNotice = { faction:Faction; unitId:number; type:'detected'|'identified'|'lost'|'rediscovered'|'activity' }
export type SupplyRoute = { id:string; faction:Faction; from:Point; to:Point; fromName:string; toName:string; connected:boolean }
export type SupplyNotice = { unitId:number; type:'low_ammo'|'low_fuel'|'critical'|'disconnected'|'connected'|'resupply_started'|'resupply_completed' }
export type MissionState = 'BRIEFING'|'ACTIVE'|'VICTORY'|'DEFEAT'
export type ObjectiveType = 'CAPTURE'|'HOLD'|'DEFEND'|'DESTROY'|'REACH'
export type Objective = { id:string; type:ObjectiveType; label:string; description:string; targetSiteId?:string; targetUnitIds?:number[]; required?:boolean; completed:boolean; failed:boolean }
export type Scenario = { id:string; name:string; briefing:string; objectives:Objective[]; duration:number }
export type Weather = 'CLEAR'|'RAIN'
export type TimeOfDay = 'MORNING'|'DAY'|'EVENING'|'NIGHT'
export type MapMode = 'NORMAL'|'SUPPLY'|'INTELLIGENCE'|'COMMAND'|'COMBAT'
export type MissionEvaluation = { state:MissionState; objectives:Objective[]; weather:Weather; timeOfDay:TimeOfDay; remaining:number }
