import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import useUpdateRequest from '../../../hooks/useUpdateRequestById';
import ProtectedRoute from '../../../components/ProtectedRoute';
import useGetRequestById from '@/src/hooks/useGetRequestById';

const EditRequest = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: request } = useGetRequestById(id as string);

  const updateRequestMutation = useUpdateRequest(id as string);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    if (request) {
      setTitle(request.title);
      setDescription(request.description);
      setStatus(request.status);
      setPriority(request.priority);
    }
  }, [request]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (request) {
      updateRequestMutation.mutateAsync({
        ...request,
        title,
        description,
        status,
        priority,
        updated_at: new Date(),
      }).then((res) => {
        console.warn('mutated', res)
        router.push(`/requests/${request.id}`)
      });
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <h1>Edit Request</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'in_progress' | 'completed')}
              required
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button type="submit">Update Request</button>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default EditRequest;
