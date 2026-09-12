import {cookies} from 'next/headers'; import {createHmac} from 'crypto';
export type Role='panitia'|'pdd'|'admin'; const COOKIE='portal_session'; const secret=()=>process.env.SESSION_SECRET||'change-this-secret';
export function setSession(role:Role,id:string){const value=`${role}:${id}`;const sig=createHmac('sha256',secret()).update(value).digest('hex');cookies().set(COOKIE,`${value}:${sig}`,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:60*60*8,path:'/'})}
export function getSession(){const raw=cookies().get(COOKIE)?.value; if(!raw)return null; const parts=raw.split(':');if(parts.length!==3)return null;const [role,id,sig]=parts; if(role!=='panitia'&&role!=='pdd'&&role!=='admin')return null; const expected=createHmac('sha256',secret()).update(`${role}:${id}`).digest('hex');return sig===expected?{role:role as Role,id}:null}
export function clearSession(){cookies().delete(COOKIE)}
