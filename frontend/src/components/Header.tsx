import { cookies } from 'next/headers';
import HeaderClient from './HeaderClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getMe() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    // A verify-login végpontot hívjuk meg a hitelesítéshez
    const res = await fetch(`${API_URL}/auth/verify-login`, {
      method: 'POST', 
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) return null;
    const data = await res.json();
    
    // futas kozben a terminalon latjuk az adatokat
    console.log("Bejelentkezett felhasználó a Headerben:", data.user);
    
    return data.user; 
  } catch (error) {
    console.error("Header hiba:", error);
    return null;
  }
}

export default async function Header() {
  const user = await getMe(); 

  return (
    <header style={{ height: '80px' }}> 
      <HeaderClient user={user} />
    </header>
  );
}