// event from game
export enum GameEvent {
  GameOver = 'game-over',
  GameLoaded = 'game-loaded',
}

export type GameEventData = {
  [GameEvent.GameOver]: {
    score: number
    data: any
  }
  [GameEvent.GameLoaded]: {
    progress: number // 0-1
  }
}

const windowRef: {
  window: Window | undefined | null
} = { window: typeof window === 'undefined' ? null : window }

// event from web
export enum WebEvent {
  GameReset = 'game-reset',
  GameDestroy = 'game-destroy',
  RequestProgress = 'request-progress',
}

export type WebEventData = {
  [WebEvent.GameReset]: Record<string, never>
  [WebEvent.GameDestroy]: Record<string, never>
  [WebEvent.RequestProgress]: Record<string, string>
}

export function emit<T extends GameEvent | WebEvent>(
  event: T,
  data: T extends GameEvent ? GameEventData[T] : T extends WebEvent ? WebEventData[T] : any,
) {
  if (!windowRef.window) return
  log('emit event', event, data)
  windowRef.window.document.dispatchEvent(new CustomEvent(event, { detail: data }))
}

export function on<T extends GameEvent | WebEvent>(
  event: T,
  callback: (data: T extends GameEvent ? GameEventData[T] : T extends WebEvent ? WebEventData[T] : any) => void,
) {
  if (!windowRef.window) return

  log('add event', event)
  const handler = (e: Event) => callback((e as CustomEvent).detail)
  windowRef.window.document.addEventListener(event, handler)
  return () => {
    if (!windowRef.window) return
    log('remove event', event)
    windowRef.window.document.removeEventListener(event, handler)
  }
}

export function off<T extends GameEvent | WebEvent>(event: T, callback: (data: any) => void) {
  if (!windowRef.window) return

  log('remove event', event)
  windowRef.window.document.removeEventListener(event, (e) => callback((e as CustomEvent).detail))
}

export function once<T extends GameEvent | WebEvent>(
  event: T,
  callback: (data: T extends GameEvent ? GameEventData[T] : T extends WebEvent ? WebEventData[T] : any) => void,
) {
  if (!windowRef.window) return

  log('add once event', event)
  const handler = (e: Event) => callback((e as CustomEvent).detail)
  windowRef.window.document.addEventListener(event, handler, { once: true })
  return () => {
    if (!windowRef.window) return
    log('remove once event', event)
    windowRef.window.document.removeEventListener(event, handler)
  }
}

export const gameBridge = {
  emit,
  on,
  off,
  once,
  windowRef,
}

function log(...data: any[]) {
  localStorage.getItem('enable_log') === 'true' && console.log(...data)
}
