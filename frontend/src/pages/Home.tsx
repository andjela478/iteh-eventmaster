import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI, categoriesAPI } from '../services/api';
import { useAuth } from '../context/useAuth';
import type { Event, Category } from '../types';
import EventCard from '../components/EventCard';
import Input from '../components/Input';
import Button from '../components/Button';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsData, categoriesData] = await Promise.all([
        eventsAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      setCategories(categoriesData);
      setLoading(false);
    } catch (err: any) {
      setError('Greška prilikom učitavanja podataka');
      setLoading(false);
    }
  };

  // Filter po kategoriji
  useEffect(() => {
    let result = events;

    if (selectedCategory !== 'all') {
      result = result.filter(event => event.category_id === Number(selectedCategory));
    }

    if (searchQuery) {
      result = result.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(result);
  }, [selectedCategory, searchQuery, events]);

  if (loading) {
    return <div className="container mt-4">Učitavanje...</div>;
  }

  if (error) {
    return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Svi Događaji</h1>
        {user?.role === 'organizer' && (
          <Button
            text="+ Kreiraj Događaj"
            onClick={() => navigate('/create-event')}
            variant="primary"
          />
        )}
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <Input
            type="text"
            placeholder="Pretraži događaje..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
          >
            <option value="all">Sve kategorije</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-muted">Nema dostupnih događaja.</p>
      ) : (
        <div className="row g-4 mb-5">
          {filteredEvents.map(event => (
            <div key={event.id} className="col-md-4">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
