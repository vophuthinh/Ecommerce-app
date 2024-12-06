import React from 'react';
import { useSelector } from 'react-redux';
import EventCard from './EventCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from '../../styles/styles';

const Events = () => {
    const { allEvents, isLoading } = useSelector((state) => state.events);

    return (
        <div>
            {!isLoading && (
                <>
                    {allEvents.length !== 0 && (
                        <>
                            <div className={`${styles.section}`}>
                                <div className={`${styles.heading}`}>
                                    <h1>Highlighted Promotions and Discounts Events</h1>
                                </div>
                            </div>
                            <div className={`${styles.section} bg-[#f0f6f6] p-6`}>
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                                    spaceBetween={20}
                                    slidesPerView={1}
                                >
                                    {allEvents.map((event, index) => (
                                        <SwiperSlide key={index}>
                                            <EventCard data={event} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </>
                    )}
                    {allEvents?.length === 0 && (
                        <h4 className="text-center text-lg text-[#777777]">No events available</h4>
                    )}
                </>
            )}
        </div>
    );
};

export default Events;
