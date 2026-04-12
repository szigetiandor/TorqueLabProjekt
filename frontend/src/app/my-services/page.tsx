'use client';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import ServiceComments from '@/components/ServiceComments'; 
export default function MyServiceHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyLogs = async () => {
      try {
        const data = await apiRequest('/service-logs/my');
        setLogs(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchMyLogs();
  }, []);

  if (loading) return <div className="p-5 text-white">Betöltés...</div>;

  return (
    <div className="container py-5" style={{ marginTop: '80px' }}>
      <h2 className="text-white fw-bold mb-4">Szervíznaplók</h2>
      
      <div className="row g-4">
        {logs.map((log: any) => (
          <div key={log.service_id} className="col-12">
            <div className="card bg-dark border-secondary">
              <div className="card-body p-4">
                {/* Autó infók */}
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="text-danger fw-bold">{log.brand} {log.model}</h5>
                  <span className="badge bg-success">{log.status}</span>
                </div>
                
                <p className="text-light mt-3 mb-1 fw-bold">Leírás:</p>
                <p className="text-secondary small">{log.description}</p>

                <ServiceComments serviceId={log.service_id} />

                <div className="d-flex justify-content-between mt-4 extra-small text-secondary pt-2 border-top border-secondary">
                  <span>📅 {new Date(log.service_date).toLocaleDateString('hu-HU')}</span>
                  <span>🛠️ {log.worker_name}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}