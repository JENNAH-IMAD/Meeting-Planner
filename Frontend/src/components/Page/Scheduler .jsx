import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { message } from 'antd';
import { getAllReservations } from '../../services/Reservation'; // Import getAllReservations function

const localizer = momentLocalizer(moment);

const Scheduler = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getAllReservations(); // Fetch reservations from backend
      const reservations = response.data.map(reservation => ({
        title: reservation.title,
        start: new Date(reservation.dateMeeting + 'T' + reservation.timeMeetingStart),
        end: new Date(reservation.dateMeeting + 'T' + reservation.timeMeetingEnd),
      }));
      setEvents(reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      message.error('An error occurred while fetching reservations.');
    }
  };

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: '50px' }}
        views={['month', 'week', 'day']}
        step={60}
        showMultiDayTimes
        defaultDate={moment().toDate()}
        components={{
          event: EventComponent,
        }}
      />
    </div>
  );
};

const EventComponent = ({ event }) => {
  return (
    <div>
      <strong>{event.title}</strong>
      <br />
      <span>{moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}</span>
    </div>
  );
};

export default Scheduler;
