import React, { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventModalDetails from '../AdminEvent/EventModalDetailsComponent';
import EventFormModal from '../AdminEvent/EventModalComponent';

const localizer = momentLocalizer(moment);

function AdminCreatePlanningComponent() {
  const [events, setEvents] = useState([]);
  const [slotInfo, setSlotInfo] = useState({ start: null, end: null });
  const [modalContent, setModalContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailsModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    setErrorMessage('');  // Clear any previous error message
    try {
      const response = await fetch('http://localhost:4000/events', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Error fetching events: ${response.status} (${response.statusText})`);
      }

      const event = await response.json();
      const transformedEvents = event.events.map(ev => ({
        id: ev.id,
        title: ev.title,
        start: new Date(ev.startDate),
        end: new Date(ev.endDate),
        description: ev.description,
        lieu: ev.lieu,
        type: ev.type,
        recurrence: ev.recurrence,
        capacity: ev.capacity,
        participants: ev.participants,
        clubs: ev.clubs,
        trainingCenters: ev.trainingCenters,
      }));
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setErrorMessage('Error fetching events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSelectSlot = useCallback(({ start, end }) => {
    setSlotInfo({ start, end });
    setShowModal(true);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setModalContent(event);
    setShowDetailsModal(true);
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDetailsModal(false);
    setSlotInfo({ start: null, end: null });
  };

  const handleSaveEvent = async (newEvent) => {
    try {
      const response = await fetch(`http://localhost:4000/events/${newEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      await fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      handleCloseModal();
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:4000/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Error deleting event: ${response.status} (${response.statusText})`);
      }

      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      handleCloseModal();
    }
  };

  const { defaultDate, scrollToTime } = useMemo(() => ({
    defaultDate: new Date(),
    scrollToTime: new Date(1970, 1, 1, 6),
  }), []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='projet-register-container-schuelder'>
      <h2>Planning</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <Fragment>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: '50px' }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          scrollToTime={scrollToTime}
        />
      </Fragment>
      <EventFormModal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        defaultStart={slotInfo.start}
        defaultEnd={slotInfo.end}
      />
      {modalContent && (
        <EventModalDetails
          isOpen={showDetailModal}
          event={modalContent}
          onRequestClose={handleCloseModal}
          onSave={handleSaveEvent}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default AdminCreatePlanningComponent;
