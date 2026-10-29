import { getPrototypeData } from "@/infrastructure/container";
import { getSessionUser } from "@/infrastructure/auth/session";
import { Prototype } from "@/components/prototype";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [data, user] = await Promise.all([getPrototypeData.execute(), getSessionUser()]);

  return <Prototype data={data} initialUser={user} />;
}
