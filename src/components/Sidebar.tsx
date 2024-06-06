import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div>
      <h2>Menu</h2>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/requests">Requests</Link></li>
        <li><Link href="/meetings">Meetings</Link></li>
        <li><Link href="/planning">Planning</Link></li>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/register">Register</Link></li>
      </ul>
      { user && <button onClick={handleLogout}>Logout</button> }
    </div>
  );
};

export default Sidebar;