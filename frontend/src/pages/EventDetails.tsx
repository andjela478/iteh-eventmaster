import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../context/useAuth';
import type { Event } from '../types';
import Button from '../components/Button';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const data = await eventsAPI.getById(Number(id));
      setEvent(data);

      if (user?.role === 'organizer') {
        const regs = await eventsAPI.getRegistrations(Number(id));
        setRegistrations(regs);
      }

      setLoading(false);
    } catch (err: any) {
      setError('Greška prilikom učitavanja događaja');
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    try {
      await registrationsAPI.create(Number(id));
      setMessage('Uspešno ste se prijavili na događaj!');
      await fetchEvent();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Greška prilikom prijave');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovaj događaj?')) {
      return;
    }

    try {
      await eventsAPI.delete(Number(id));
      navigate('/home');
    } catch (err: any) {
      setError('Greška prilikom brisanja događaja');
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  if (loading) {
    return <div className="container mt-4">Učitavanje...</div>;
  }

  if (error && !event) {
    return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  }

  if (!event) {
    return <div className="container mt-4">Događaj nije pronađen.</div>;
  }

  const isOrganizer = user?.role === 'organizer';
  const registrationsCount = event.registrations?.filter(r => r.status === 'active').length || 0;
  const isFull = registrationsCount >= event.max_participants;
  const availableSpots = event.max_participants - registrationsCount;
  const percentFull = (registrationsCount / event.max_participants) * 100;

  const getStatusBadge = () => {
    if (isFull) return <span className="badge bg-danger">Popunjeno</span>;
    if (percentFull >= 80) return <span className="badge bg-warning text-dark">Skoro popunjeno</span>;
    return <span className="badge bg-success">Ima mesta</span>;
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className={isOrganizer && registrations.length > 0 ? "col-lg-8" : "col-lg-8 mx-auto"}>
          <div className="card shadow">
            {event.image_url && (
              <img
                src={event.image_url}
                className="card-img-top"
                alt={event.title}
                style={{ height: '300px', objectFit: 'cover' }}
              />
            )}
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h1 className="card-title">{event.title}</h1>
                {getStatusBadge()}
              </div>

              {message && (
                <div className="alert alert-success" role="alert">
                  {message}
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <p className="card-text mb-4 text-muted">{event.description}</p>

              <div className="mb-4">
                <h6 className="mb-2">Popunjenost:</h6>
                <div className="progress" style={{ height: '25px' }}>
                  <div
                    className={`progress-bar ${percentFull >= 80 ? 'bg-danger' : percentFull >= 50 ? 'bg-warning' : 'bg-success'}`}
                    role="progressbar"
                    style={{ width: `${percentFull}%` }}
                    aria-valuenow={registrationsCount}
                    aria-valuemin={0}
                    aria-valuemax={event.max_participants}
                  >
                    {registrationsCount} / {event.max_participants}
                  </div>
                </div>
                <small className="text-muted">Preostalo mesta: <strong>{availableSpots}</strong></small>
              </div>

              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <span style={{ fontSize: '24px' }} className="me-2">📅</span>
                    <div>
                      <small className="text-muted">Datum</small>
                      <p className="mb-0"><strong>{formatDate(event.date)}</strong></p>
                    </div>
                  </div>
                </div>

                {event.category && (
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center">
                      <span style={{ fontSize: '24px' }} className="me-2">🎯</span>
                      <div>
                        <small className="text-muted">Kategorija</small>
                        <p className="mb-0"><strong>{event.category.name}</strong></p>
                      </div>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center">
                      <span style={{ fontSize: '24px' }} className="me-2">📍</span>
                      <div>
                        <small className="text-muted">Lokacija</small>
                        <p className="mb-0"><strong>{event.location.name}</strong></p>
                        <small className="text-muted">{event.location.address}, {event.location.city}</small>
                      </div>
                    </div>
                  </div>
                )}

                {event.organizer && (
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center">
                      <span style={{ fontSize: '24px' }} className="me-2">👤</span>
                      <div>
                        <small className="text-muted">Organizator</small>
                        <p className="mb-0"><strong>{event.organizer.name}</strong></p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="d-flex gap-2">
                {isOrganizer ? (
                  <Button
                    text="Obriši događaj"
                    onClick={handleDelete}
                    variant="danger"
                  />
                ) : (
                  <Button
                    text={isFull ? 'Događaj je popunjen' : 'Prijavi se'}
                    onClick={handleRegister}
                    variant="primary"
                    disabled={isFull || !isAuthenticated}
                  />
                )}

                <Button
                  text="Nazad"
                  onClick={() => navigate('/home')}
                  variant="secondary"
                />
              </div>
            </div>
          </div>
        </div>

        {isOrganizer && registrations.length > 0 && (
          <div className="col-lg-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title mb-3">
                  👥 Prijavljeni korisnici ({registrations.length})
                </h5>
                <div className="list-group list-group-flush">
                  {registrations.map((reg) => (
                    <div key={reg.id} className="list-group-item px-0">
                      <strong>{reg.user?.name}</strong>
                      <br />
                      <small className="text-muted">{reg.user?.email}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
