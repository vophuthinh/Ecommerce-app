import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import PageNotfound from "./PageNotfound";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  console.log(allEvents,'allEventsallEvents');
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          {/* <EventCard active={true} data={allEvents && allEvents[0]} /> */}
          {/* {allEvents &&
                  allEvents.map((allEvents, index) => (
                    <EventCard data={allEvents} />
                  ))} */}
          {allEvents && allEvents.length == 0 ? (
            <PageNotfound />
          ) : (
            <>
              {allEvents.map((allEvents, index) => (
                <EventCard data={allEvents} />
              ))}{" "}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default EventsPage;
