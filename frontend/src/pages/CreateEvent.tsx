import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI, categoriesAPI, locationsAPI } from '../services/api';
import { useAuth } from '../context/useAuth';
import type { Category, Location } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    day: '',
    month: '',
    year: '2026',
    hour: '19',
    minute: '00',
    max_participants: '',
    category_id: '',
    location_id: '',
    image_url: ''
  });

  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const getMaxDays = () => {
    const month = Number(formData.month);
    if (!month || month < 1 || month > 12) return 31;
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysInMonth[month - 1];
  };

  useEffect(() => {
    // Automatski smanji dan ako je veći od max dana za izabrani mesec
    const maxDays = getMaxDays();
    const currentDay = Number(formData.day);
    if (currentDay > maxDays) {
      setFormData(prev => ({ ...prev, day: maxDays.toString() }));
    }
  }, [formData.month, formData.year]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'organizer') {
      navigate('/home');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesData, locationsData] = await Promise.all([
        categoriesAPI.getAll(),
        locationsAPI.getAll()
      ]);
      setCategories(categoriesData);
      setLocations(locationsData);
    } catch (err: any) {
      setError('Greška prilikom učitavanja podataka');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let categoryId = formData.category_id;

      // Ako je izabrana nova kategorija, kreiraj je prvo
      if (isNewCategory) {
        if (!newCategoryName.trim()) {
          setError('Unesite ime nove kategorije.');
          setLoading(false);
          return;
        }
        const categoryResponse = await categoriesAPI.create(newCategoryName.trim());
        categoryId = categoryResponse.category.id.toString();
      }

      const day = Number(formData.day);
      const month = Number(formData.month);
      const year = Number(formData.year);
      const hour = Number(formData.hour);
      const minute = Number(formData.minute);

      if (day < 1 || day > 31) {
        setError('Dan mora biti između 1 i 31.');
        setLoading(false);
        return;
      }

      if (month < 1 || month > 12) {
        setError('Mesec mora biti između 1 i 12.');
        setLoading(false);
        return;
      }

      // Validacija dana po mesecu
      const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const maxDays = daysInMonth[month - 1];

      if (day > maxDays) {
        const monthNames = ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'];
        setError(`${monthNames[month - 1]} ima maksimalno ${maxDays} dana.`);
        setLoading(false);
        return;
      }

      if (year < 2026 || year > 2030) {
        setError('Godina mora biti između 2026 i 2030.');
        setLoading(false);
        return;
      }

      if (hour < 0 || hour > 23) {
        setError('Sat mora biti između 0 i 23.');
        setLoading(false);
        return;
      }

      if (minute < 0 || minute > 59) {
        setError('Minut mora biti između 0 i 59.');
        setLoading(false);
        return;
      }

      const parsedDate = new Date(year, month - 1, day, hour, minute);

      if (isNaN(parsedDate.getTime())) {
        setError('Neispravan datum ili vreme.');
        setLoading(false);
        return;
      }

      await eventsAPI.create({
        title: formData.title,
        short_description: formData.short_description,
        description: formData.description,
        date: parsedDate,
        max_participants: Number(formData.max_participants),
        category_id: Number(categoryId),
        location_id: Number(formData.location_id),
        image_url: formData.image_url || null
      });
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Greška prilikom kreiranja događaja');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let correctedValue = value;

    if (name === 'day') {
      const num = Number(value);
      const maxDays = getMaxDays();
      if (num < 1) correctedValue = '1';
      else if (num > maxDays) correctedValue = maxDays.toString();
    } else if (name === 'month') {
      const num = Number(value);
      if (num < 1) correctedValue = '1';
      else if (num > 12) correctedValue = '12';
    } else if (name === 'year') {
      const num = Number(value);
      if (num < 2026) correctedValue = '2026';
      else if (num > 2030) correctedValue = '2030';
    } else if (name === 'hour') {
      const num = Number(value);
      if (num < 0) correctedValue = '0';
      else if (num > 23) correctedValue = '23';
    } else if (name === 'minute') {
      const num = Number(value);
      if (num < 0) correctedValue = '0';
      else if (num > 59) correctedValue = '59';
    } else if (name === 'max_participants') {
      const num = Number(value);
      if (num < 1) correctedValue = '1';
    }

    if (correctedValue !== value) {
      setFormData(prev => ({ ...prev, [name]: correctedValue }));
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Kreiraj Novi Događaj</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <Input
                  type="text"
                  label="Naziv događaja"
                  name="title"
                  placeholder="Unesi naziv"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <div className="mb-3">
                  <label className="form-label">Kratak opis (za početnu stranu)</label>
                  <textarea
                    name="short_description"
                    className="form-control"
                    placeholder="Kratak opis do 255 karaktera"
                    value={formData.short_description}
                    onChange={handleChange}
                    rows={2}
                    maxLength={255}
                    required
                  />
                  <small className="text-muted">{formData.short_description.length}/255</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Detaljan opis</label>
                  <textarea
                    name="description"
                    className="form-control"
                    placeholder="Detaljan opis događaja"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Datum (dd/mm/yyyy)</label>
                  <div className="row g-2">
                    <div className="col-3">
                      <input
                        type="number"
                        name="day"
                        className="form-control"
                        placeholder="Dan"
                        min="1"
                        max={getMaxDays()}
                        value={formData.day}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                    <div className="col-3">
                      <input
                        type="number"
                        name="month"
                        className="form-control"
                        placeholder="Mesec"
                        min="1"
                        max="12"
                        value={formData.month}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        name="year"
                        className="form-control"
                        placeholder="Godina"
                        min="2026"
                        max="2030"
                        value={formData.year}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Vreme (0-23h)</label>
                  <div className="row g-2">
                    <div className="col-6">
                      <input
                        type="number"
                        name="hour"
                        className="form-control"
                        placeholder="Sat (0-23)"
                        min="0"
                        max="23"
                        value={formData.hour}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        name="minute"
                        className="form-control"
                        placeholder="Minut (0-59)"
                        min="0"
                        max="59"
                        value={formData.minute}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Maksimalan broj učesnika</label>
                  <input
                    type="number"
                    name="max_participants"
                    className="form-control"
                    placeholder="npr. 100"
                    min="1"
                    value={formData.max_participants}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Kategorija</label>
                  <select
                    name="category_id"
                    className="form-select"
                    value={isNewCategory ? 'new' : formData.category_id}
                    onChange={(e) => {
                      if (e.target.value === 'new') {
                        setIsNewCategory(true);
                        setFormData(prev => ({ ...prev, category_id: '' }));
                      } else {
                        setIsNewCategory(false);
                        setFormData(prev => ({ ...prev, category_id: e.target.value }));
                      }
                    }}
                    required={!isNewCategory}
                  >
                    <option value="">Izaberi kategoriju</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                    <option value="new">+ Dodaj novu kategoriju</option>
                  </select>
                </div>

                {isNewCategory && (
                  <div className="mb-3">
                    <label className="form-label">Ime nove kategorije</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Unesi ime kategorije"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Lokacija</label>
                  <select
                    name="location_id"
                    className="form-select"
                    value={formData.location_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Izaberi lokaciju</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name} - {location.city}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  type="url"
                  label="URL slike (opciono)"
                  name="image_url"
                  placeholder="https://example.com/slika.jpg"
                  value={formData.image_url}
                  onChange={handleChange}
                />

                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    text={loading ? 'Kreiranje...' : 'Kreiraj Događaj'}
                    variant="primary"
                    disabled={loading}
                  />
                  <Button
                    text="Otkaži"
                    onClick={() => navigate('/home')}
                    variant="secondary"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
