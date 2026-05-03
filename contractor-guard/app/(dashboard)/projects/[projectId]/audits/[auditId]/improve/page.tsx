import { getImprovedTZ } from "@/lib/actions/improve-tz";
import { Typewriter } from "@/components/report/typewriter";

export default async function ImprovedTZPage({
  params,
}: {
  params: Promise<{ auditId: string; projectId: string }>;
}) {
  const { auditId } = await params;
  const fullText = await getImprovedTZ(auditId);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">✨ Улучшенное техническое задание</h1>
      <Typewriter text={fullText} speed={30} />
    </div>
  );
}