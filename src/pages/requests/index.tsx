import useGetRequests from "@/src/hooks/useGetRequests";
import Link from "next/link";

const Requests = () => {
  const { data: requests } = useGetRequests();
  return (
    <div>
      <h1>Requests</h1>
      <Link href="/requests/new">New Request</Link>
      <ul>
        {requests?.map((request) => (
          <li key={request.id}>
            <h2>Title: {request.title}</h2>
            <span>
              <Link href={`/requests/${request.id}`}>View</Link>
            </span>
            <p>Description: {request.description}</p>
            <p>Status: {request.status}</p>
            <p>Priority: {request.priority}</p>
            <p>Created At: {request?.created_at?.toString()}</p>
            <p>Updated At: {request?.updated_at?.toString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Requests;