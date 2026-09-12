import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import {db} from '@/lib/db';
import {getSession} from '@/lib/auth';
import {pddPasswordUpdate} from '@/lib/validation';

export async function PATCH(req:Request,{params}:{params:{id:string}}){
  if(!['pdd','admin'].includes(getSession()?.role||'')) return NextResponse.json({error:'Unauthorized'},{status:401});
  try {
    const {password}=pddPasswordUpdate.parse(await req.json());
    await db.pddUser.update({where:{id:params.id},data:{passwordHash:await bcrypt.hash(password,12)}});
    return NextResponse.json({ok:true});
  } catch(error) {
    if((error as {code?:string})?.code==='P2025') return NextResponse.json({error:'Pengguna tidak ditemukan'},{status:404});
    return NextResponse.json({error:'Password tidak valid'},{status:400});
  }
}
