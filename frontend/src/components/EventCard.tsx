import { useNavigate } from 'react-router-dom';
import type { Event } from '../types';
import Button from './Button';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();

  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const registrationsCount = event.registrations?.filter(r => r.status === 'active').length || 0;
  const availableSpots = event.max_participants - registrationsCount;

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{event.title}</h5>
        <p className="card-text text-muted">{event.short_description || event.description}</p>
        <div className="mb-3">
          <small className="text-muted d-block">Datum: {formatDate(event.date)}</small>
          {event.category && <small className="text-muted d-block">Kategorija: {event.category.name}</small>}
          {event.location && <small className="text-muted d-block">Lokacija: {event.location.name}, {event.location.city}</small>}
          <small className="text-muted d-block">
            <strong>Preostalo mesta: {availableSpots} / {event.max_participants}</strong>
          </small>
        </div>
        <div className="mt-auto">
          <Button
            text="Detaljnije"
            onClick={() => navigate(`/events/${event.id}`)}
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
