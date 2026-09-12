import {NextResponse} from 'next/server';import {db} from '@/lib/db';
export async function GET(_:Request,{params}:{params:{slug:string}}){const section=await db.section.findUnique({where:{slug:params.slug},include:{agendas:{orderBy:{createdAt:'asc'}}}});return section?NextResponse.json(section.agendas):NextResponse.json({error:'Section tidak ditemukan'},{status:404})}
