import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import CreateEmailModal from './CreateEmailModal';
import EventDetailsModal from './EventDetailsModal';

const localizer = momentLocalizer(moment);

const HomePage = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/emails');
            const emails = res.data.map(email => ({
                id: email._id,
                title: email.email,
                start: new Date(email.date),
                end: new Date(email.date),
                allDay: true,
                description: email.description,
            }));
            setEvents(emails);
        } catch (err) {
            console.error('Failed to fetch events', err);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openDetailsModal = (event) => {
        setSelectedEvent(event);
        setIsDetailsModalOpen(true);
    };
    const closeDetailsModal = () => {
        setSelectedEvent(null);
        setIsDetailsModalOpen(false);
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:4000/api/auth/logout', {}, {
                headers: { 'x-auth-token': token }
            });
            localStorage.removeItem('token');
            navigate('/');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <div>
            {/* <header className="header">
                <button onClick={openModal} className='create-button'>Create</button>
                <button onClick={handleLogout} className='logout-button'>Logout</button>
            </header> */}
            <header style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
                <button onClick={openModal} style={{ padding: '10px' }} className='create-button'>Create</button>
                <button onClick={handleLogout} style={{ padding: '10px' }} className='logout-button'>Logout</button>
            </header>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, padding: '50px' }}
                onSelectEvent={openDetailsModal}
            />
            <CreateEmailModal isOpen={isModalOpen} onClose={closeModal} refreshEvents={fetchEvents} />
            {selectedEvent && (
                <EventDetailsModal
                    event={selectedEvent}
                    isOpen={isDetailsModalOpen}
                    onClose={closeDetailsModal}
                    refreshEvents={fetchEvents}
                />
            )}
        </div>
    );
};

export default HomePage;
