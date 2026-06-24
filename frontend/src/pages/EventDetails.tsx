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
      setLoading(false);
    } catch (err: any) {
      setError('Greška prilikom učitavanja događaja');
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await registrationsAPI.create(Number(id));
      setMessage('Uspešno ste se prijavili na događaj!');
      fetchEvent();
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
      navigate('/');
    } catch (err: any) {
      setError('Greška prilikom brisanja događaja');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('sr-RS', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const isOrganizer = user?.id === event.organizer_id;
  const registrationsCount = event.registrations?.filter(r => r.status === 'active').length || 0;
  const isFull = registrationsCount >= event.max_participants;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title mb-4">{event.title}</h1>

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

              <p className="card-text mb-4">{event.description}</p>

              <div className="row mb-4">
                <div className="col-md-6">
                  <p><strong>Datum:</strong><br />{formatDate(event.date)}</p>
                </div>

                {event.category && (
                  <div className="col-md-6">
                    <p><strong>Kategorija:</strong><br />{event.category.name}</p>
                  </div>
                )}

                {event.location && (
                  <div className="col-md-6">
                    <p><strong>Lokacija:</strong><br />
                    {event.location.name}<br />
                    <small className="text-muted">{event.location.address}, {event.location.city}</small>
                    </p>
                  </div>
                )}

                <div className="col-md-6">
                  <p><strong>Broj prijavljenih:</strong><br />
                  {registrationsCount} / {event.max_participants}
                  </p>
                </div>

                {event.organizer && (
                  <div className="col-md-6">
                    <p><strong>Organizator:</strong><br />{event.organizer.name}</p>
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
                  onClick={() => navigate('/')}
                  variant="secondary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
