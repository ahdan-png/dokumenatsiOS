import {PrismaClient} from '@prisma/client'; import bcrypt from 'bcryptjs';
const db=new PrismaClient();
async function main(){
 const passwordHash=await bcrypt.hash('panitia123',12), pddPasswordHash=await bcrypt.hash('pdd12345',12), adminPasswordHash=await bcrypt.hash('1958_mtuu',12);
 for(const input of [{slug:'umum',name:'Umum',description:'Dokumentasi umum.',wallpaperUrl:'/wallpapers/umum.svg'},{slug:'panitia',name:'Panitia',description:'Dokumentasi panitia.',wallpaperUrl:'/wallpapers/panitia.svg'},{slug:'pdd-dokumentasi',name:'Dokumentasi PDD',description:'Dokumentasi agenda PDD.',wallpaperUrl:'/wallpapers/umum.svg'}]){
  const section=await db.section.upsert({where:{slug:input.slug},update:{name:input.name},create:{...input,link:null,...(input.slug==='panitia'?{passwordHash}: {})}});
  const old=section.link;
  if(old && !(await db.agenda.count({where:{sectionId:section.id}}))) await db.agenda.create({data:{sectionId:section.id,title:section.name,slug:section.slug,description:section.description,link:old}});
 }
 await db.pddUser.upsert({where:{username:'pdd'},update:{passwordHash:pddPasswordHash},create:{username:'pdd',name:'Admin PDD',passwordHash:pddPasswordHash}});
 await db.adminUser.upsert({where:{username:'Dekdok58'},update:{passwordHash:adminPasswordHash},create:{username:'Dekdok58',passwordHash:adminPasswordHash}});
} main().finally(()=>db.$disconnect());
