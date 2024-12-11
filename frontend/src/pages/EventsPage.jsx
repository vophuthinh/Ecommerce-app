import React from 'react';
import { useSelector } from 'react-redux';
import EventCard from '../components/Events/EventCard';
import Header from '../components/Layout/Header';
import Loader from '../components/Layout/Loader';
import PageNotfound from './PageNotfound';

const EventsPage = () => {
    const { allEvents, isLoading } = useSelector((state) => state.events);

    return (
        <div className="overflow-x-hidden min-h-screen flex flex-col bg-gray-50">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    {/* Header */}
                    <Header activeHeading={4} />

                    {/* Content */}
                    <div className="w-full max-w-7xl mx-auto px-6 py-12">
                        {allEvents && allEvents.length === 0 ? (
                            <PageNotfound />
                        ) : (
                            <div className="flex flex-col items-center space-y-8">
                                {allEvents.map((event, index) => (
                                    <div key={index} className="w-full">
                                        <EventCard data={event} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default EventsPage;
