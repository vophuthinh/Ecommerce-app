import React from 'react';
import Header from '../components/Layout/Header';
import DashboardSideBar from '../components/Shop/Layout/DashboardSideBar';
import UserInbox from './UserInbox';

const UserInboxPage = () => {
    return (
        <div>
            <Header />
            <div className="flex items-start justify-between w-full pt-3 bg-[#fbfbfb]">
                {/* <div className="w-[80px] 800px:w-[330px]">
        <DashboardSideBar active={8} />
      </div> */}
                <UserInbox />
            </div>
        </div>
    );
};

export default UserInboxPage;
