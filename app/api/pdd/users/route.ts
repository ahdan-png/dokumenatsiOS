import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import {db} from '@/lib/db';
import {getSession} from '@/lib/auth';
import {pddUserCreate} from '@/lib/validation';

const unauthorized=()=>NextResponse.json({error:'Unauthorized'},{status:401});
const publicUser=(user:{id:string;username:string;name:string;createdAt:Date})=>({id:user.id,username:user.username,name:user.name,createdAt:user.createdAt});

export async function GET(){
  if(!['pdd','admin'].includes(getSession()?.role||'')) return unauthorized();
  const users=await db.pddUser.findMany({orderBy:{username:'asc'},select:{id:true,username:true,name:true,createdAt:true}});
  return NextResponse.json(users);
}

export async function POST(req:Request){
  if(!['pdd','admin'].includes(getSession()?.role||'')) return unauthorized();
  try {
    const input=pddUserCreate.parse(await req.json());
    const user=await db.pddUser.create({data:{username:input.username,name:input.name,passwordHash:await bcrypt.hash(input.password,12)}});
    return NextResponse.json(publicUser(user),{status:201});
  } catch(error) {
    if((error as {code?:string})?.code==='P2002') return NextResponse.json({error:'Username sudah digunakan'},{status:409});
    return NextResponse.json({error:'Data pengguna tidak valid'},{status:400});
  }
}
