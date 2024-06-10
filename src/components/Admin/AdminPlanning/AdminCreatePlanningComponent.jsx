import React, { useState, useEffect, useRef, useCallback, useMemo, Fragment, } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventModalDetails from '../AdminEvent/EventModalDetailsComponent';
import EventFormModal from '../AdminEvent/EventModalComponent';


const localizer = momentLocalizer(moment);


function AdminCreatePlanningComponent() {

  const [slotInfo, setSlotInfo] = useState({ start: null, end: null }); // pour stocker les infos du créneau sélectionné

  const [myEvents, setEvents] = useState()

  const navigate = useNavigate();


  // on récupère les évènements de l'api
  const [data, getEventData] = useState([]);

  // prends un bouléen qui permet de déclancher ou pas l'ouverture du modal
  const [showModal, setShowModal] = useState(false); // modal de création
  const [showDetailModal, setShowDetailsModal] = useState(false); // modal de modification


  // permet d'envoyer des données par défaut au modal 
  const [modalContent, setModalContent] = useState("");

  //fonction d'appel pour le modal
  const handleShowModal = (slotInfo) => {
    setSlotInfo(slotInfo);
    setShowModal(true);
  };

  const handleDetailsShowModal = (item) => {
    setModalContent(item)
    setShowDetailsModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDetailsModal(false)
    setSlotInfo({ start: null, end: null });
  };


  const getallevent = async () => {
    try {
      const response = await fetch('http://localhost:4000/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Échec de la récupération des utilisateurs: ${response.status} (${response.statusText})`);
      }

      const event = await response.json();
      console.log("event.events", event.events)
      return event.events;
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles:', error);
      alert("Erreur lors de la récupération des utilisateurs. Veuillez réessayer.");

      return null;  // Retourne null pour indiquer un échec
    }
  };

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      handleShowModal({ start, end });
    },
    []
  );

  const handleSaveEvent = async (newEvent) => {
    console.log("newEvent", newEvent)
    try {
      const response = await fetch(`http://localhost:4000/events/${newEvent.Id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
      });

      if (!response.ok) {
        throw new Error(`Échec de la récupération des utilisateurs: ${response.status} (${response.statusText})`);
      }

      const UPdateEvent = await response.json();

    } catch (error) {
      console.log(error)
      return
    }
    setShowDetailsModal(false);
    window.alert("Modification réusir")
  };

  // cette fonction permet d'afficher les détails de l'évènement
  const handleSelectEvent = useCallback(
    (event) => {
      console.log("eventh", event)
      handleDetailsShowModal(event)
    },
    []
  );

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(2023, 5, 12),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  );

  useEffect(() => {
    const fetchEvents = async () => {
      const event = await getallevent();
      if (event) {
        const transformedEvents = event.map(ev => ({
          id: ev.Id,
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
          trainingCenters: ev.trainingCenters
        }));
        getEventData(transformedEvents);
      }
    };

    fetchEvents();
  }, []);

  const EventComponent = ({ event }) => (
    <span>
      <strong>{event.title}</strong>
      {event.desc && ':  ' + event.desc}
    </span>
  );

  const handleDelete = async (eventId) => {
    console.log('Event deleted with ID:', eventId);
    try {
      const response = await fetch(`http://localhost:4000/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Échec de la récupération des utilisateurs: ${response.status} (${response.statusText})`);
      }

      const event = await response.json();

    } catch (error) {
      console.log(error)
      return
    }
    window.alert("suppression réusir")
    setShowDetailsModal(false);
    navigate(0); // Naviguer vers la même route pour rafraîchir
  };

  return (

    <div className='projet-register-container-schuelder'>
      <h2>Planning</h2>
      <Fragment>
        <Calendar
          localizer={localizer}
          events={data}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: '50px' }}
          components={{
            event: EventComponent,
          }}

          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          scrollToTime={scrollToTime}
        />
      </Fragment>
      <EventFormModal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        //onSave={handleSaveEvent}
        defaultStart={slotInfo.start}
        defaultEnd={slotInfo.end}
      />
      <EventModalDetails
        isOpen={showDetailModal}
        children={modalContent}
        onRequestClose={handleCloseModal}
        onSave={handleSaveEvent}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default AdminCreatePlanningComponent;