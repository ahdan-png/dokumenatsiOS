import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  const agendas = await db.agenda.findMany({
    orderBy: [{ sectionId: 'asc' }, { createdAt: 'desc' }],
  });
  const groups = new Map<string, typeof agendas>();

  for (const agenda of agendas) {
    const key = `${agenda.sectionId}\u0000${agenda.title}`;
    const group = groups.get(key) || [];
    group.push(agenda);
    groups.set(key, group);
  }

  let removed = 0;
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const keep = [...group].sort((a, b) => {
      const completeness = (agenda: typeof a) =>
        Number(Boolean(agenda.link)) + Number(Boolean(agenda.description)) + Number(Boolean(agenda.date));
      return completeness(b) - completeness(a) || b.createdAt.getTime() - a.createdAt.getTime();
    })[0];
    const duplicateIds = group.filter(agenda => agenda.id !== keep.id).map(agenda => agenda.id);
    await db.agenda.deleteMany({ where: { id: { in: duplicateIds } } });
    removed += duplicateIds.length;
    console.log(`Section ${keep.sectionId}, "${keep.title}": kept ${keep.id}, removed ${duplicateIds.length}`);
  }

  console.log(`Removed ${removed} duplicate agenda record(s).`);
}

main().finally(() => db.$disconnect());
