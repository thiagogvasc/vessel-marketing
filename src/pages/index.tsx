import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';


export default function HomePage() {
  const router = useRouter();
  router.push('/client/dashboard');
  return (<></>);
}
