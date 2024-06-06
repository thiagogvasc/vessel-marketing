import useGetRequestById from "@/src/hooks/useGetRequestById";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Request() {
  const router = useRouter();
  const id = router.query.id;

  const { data: request } = useGetRequestById(id as string);

  return (
    <main>
      {request && (
        <div key={request.id}>
          <h2>Title: {request.title}</h2>
          <p>Description: {request.description}</p>
          <p>Status: {request.status}</p>
          <p>Priority: {request.priority}</p>
          <p>Created At: {request?.created_at?.toString()}</p>
          <p>Updated At: {request?.updated_at?.toString()}</p>
          <Link href={`/requests/${request.id}/edit`}>Edit</Link>
        </div>
      )}
    </main>
  );
}
