'use client'
import { useRouter } from "next/navigation";
import { useGetCurrentUser } from "../hooks/react-query/user";

export default function Redirector() {
	const { data: userData, isLoading } = useGetCurrentUser();
	const router = useRouter();

	if (!isLoading) {
		if (userData?.role === 'agent') {
			router.push('/agent/dashboard');
		} else if (userData?.role === 'client') {
			router.push('/client/dashboard');
		} else {
			router.push('/login')
		}
	}
  return (
    <>Redirecting...</>
  )
}