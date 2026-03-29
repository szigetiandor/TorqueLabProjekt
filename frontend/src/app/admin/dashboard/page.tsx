import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminClientContent from './AdminClientContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    // A verify-admin végpontot hívjuk meg
    const res = await fetch(`${API_URL}/auth/verify-admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch (error) {
    console.error("Auth check hiba:", error);
    return null;
  }
}

export default async function AdminDashboardPage() {
  const user = await checkAdminAuth();

  // JAVÍTÁS: A konzolod alapján az 'is_admin' mezőt kell néznünk!
  // Itt dől el, hogy bemehetsz-e az ajtón.
  const hasAdminAccess = user && (user.is_admin === true || user.is_admin === 1 || user.isAdmin === true);

  if (!hasAdminAccess) {
    console.log("Hozzáférés megtagadva:", user);
    redirect('/'); // Ha nem vagy admin, irány a főoldal
  }

  return (
    <main className="bg-black">
      {/* Ha ide eljut a kód, akkor biztosan admin vagy */}
      <AdminClientContent initialUser={user} />
    </main>
  );
}