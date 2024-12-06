import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { server } from '../../server';

const CountDown = ({ data }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        if (
            typeof timeLeft.days === 'undefined' &&
            typeof timeLeft.hours === 'undefined' &&
            typeof timeLeft.minutes === 'undefined'
        ) {
            axios.delete(`${server}/event/delete-shop-event/${data.id}`);
        }
        return () => clearTimeout(timer);
    });

    function calculateTimeLeft() {
        const difference = +new Date(data.Finish_Date) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
            };
        }

        return timeLeft;
    }

    const isExpired =
        typeof timeLeft.days === 'undefined' &&
        typeof timeLeft.hours === 'undefined' &&
        typeof timeLeft.minutes === 'undefined';

    return (
        <div
            className={`p-6 rounded-xl shadow-lg flex items-center ${
                isExpired ? 'bg-[#bf4800] text-[#f5f5f7]' : 'bg-[#3b4149] text-[#f5f5f7]'
            }`}
        >
            {isExpired ? (
                <div className="text-left">
                    <span className="text-2xl font-bold">Time's Up</span>
                </div>
            ) : (
                <div className="flex items-center space-x-4">
                    {['days', 'hours', 'minutes'].map((unit, index) => (
                        <React.Fragment key={unit}>
                            {index > 0 && <div className="text-3xl font-bold text-[#777777] mx-2">:</div>}
                            <div className="flex flex-col items-center">
                                <div className="text-5xl font-extrabold text-[#febd69]">{timeLeft[unit] || 0}</div>
                                <div className="text-sm uppercase text-[#ededed]">{unit}</div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CountDown;
