import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {getSession} from '@/lib/auth';
import {pddUserUpdate} from '@/lib/validation';

const unauthorized=()=>NextResponse.json({error:'Unauthorized'},{status:401});
const missing=()=>NextResponse.json({error:'Pengguna tidak ditemukan'},{status:404});

export async function PATCH(req:Request,{params}:{params:{id:string}}){
  if(!['pdd','admin'].includes(getSession()?.role||'')) return unauthorized();
  try {
    const input=pddUserUpdate.parse(await req.json());
    const user=await db.pddUser.update({where:{id:params.id},data:input,select:{id:true,username:true,name:true,createdAt:true}});
    return NextResponse.json(user);
  } catch(error) {
    if((error as {code?:string})?.code==='P2025') return missing();
    if((error as {code?:string})?.code==='P2002') return NextResponse.json({error:'Username sudah digunakan'},{status:409});
    return NextResponse.json({error:'Data pengguna tidak valid'},{status:400});
  }
}

export async function DELETE(_req:Request,{params}:{params:{id:string}}){
  const session=getSession();
  if(session?.role!=='pdd'&&session?.role!=='admin') return unauthorized();
  if(session.id===params.id) return NextResponse.json({error:'Akun yang sedang digunakan tidak dapat dihapus'},{status:400});
  try {
    await db.pddUser.delete({where:{id:params.id}});
    return NextResponse.json({ok:true});
  } catch(error) {
    if((error as {code?:string})?.code==='P2025') return missing();
    return NextResponse.json({error:'Gagal menghapus pengguna'},{status:400});
  }
}
