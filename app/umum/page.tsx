import {unstable_cache} from 'next/cache';
import {db} from '@/lib/db';
import AgendaGrid from '@/components/AgendaGrid';

const getUmum=unstable_cache(()=>db.section.findUnique({where:{slug:'umum'},include:{agendas:true}}),['section-umum'],{revalidate:60,tags:['section:umum']});

export const dynamic='force-dynamic';
export default async function Umum(){const s=await getUmum();return <AgendaGrid section="umum" agendas={s?.agendas||[]}/>}
