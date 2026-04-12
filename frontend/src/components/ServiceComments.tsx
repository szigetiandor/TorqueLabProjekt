
'use client';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

export default function ServiceComments({ serviceId }: { serviceId: number }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await apiRequest(`/service-logs/${serviceId}/comments`);
        setComments(data);
      } catch (err) {
        console.error(`Hiba a(z) ${serviceId} napló kommentjeinél:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [serviceId]);

  if (loading) return <small className="text-secondary">Kommentek betöltése...</small>;
  if (comments.length === 0) return null;

  return (
    <div className="mt-3 p-3 bg-black bg-opacity-50 rounded border border-secondary border-opacity-25">
      <h6 className="text-danger extra-small fw-bold text-uppercase mb-2">Szerviz megjegyzések</h6>
      {comments.map((c: any, idx: number) => (
        <div key={idx} className="mb-2 pb-1 border-bottom border-secondary border-opacity-10 last-child-border-0">
          <span className="text-secondary extra-small d-block">{c.user_name}</span>
          <p className="m-0 small text-light opacity-75">"{c.comment}"</p>
        </div>
      ))}
    </div>
  );
}