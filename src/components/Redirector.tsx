'use client'
import { useRouter } from "next/navigation";
import { useGetCurrentUser } from "../hooks/useUsers";

export default function Redirector() {
	const { data: userData } = useGetCurrentUser();
	const router = useRouter();
	if (userData?.role === 'agent') {
		router.push('/agent/dashboard');
	} else if (userData?.role === 'client') {
		router.push('/client/dashboard');
	} else {
		router.push('/login')
	}
  return (
    <>Redirecting...</>
  )
}