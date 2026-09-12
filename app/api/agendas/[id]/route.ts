import {NextResponse} from 'next/server';import {db} from '@/lib/db';import {getSession} from '@/lib/auth';import {z} from 'zod';
const body=z.object({title:z.string().min(1).max(120),slug:z.string().regex(/^[a-z0-9-]+$/),description:z.string().max(1000),link:z.string().url().nullable().optional()});
function ok(){const s=getSession();return s&&['pdd','admin'].includes(s.role)}
export async function PUT(req:Request,{params}:{params:{id:string}}){if(!ok())return NextResponse.json({error:'Unauthorized'},{status:401});try{return NextResponse.json(await db.agenda.update({where:{id:params.id},data:body.parse(await req.json())}))}catch{return NextResponse.json({error:'Data tidak valid'}, {status:400})}}
export async function DELETE(_:Request,{params}:{params:{id:string}}){if(!ok())return NextResponse.json({error:'Unauthorized'},{status:401});await db.agenda.delete({where:{id:params.id}});return NextResponse.json({ok:true})}
