import React from 'react';
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';
import styles from '../styles/styles';

const FAQPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Header activeHeading={5} />
            <Faq />
            <Footer />
        </div>
    );
};

const Faq = () => {
    return (
        <div className={`${styles.section} py-20 px-4 md:px-16`}>
            <h2 className="text-5xl font-bold text-center text-gray-800 mb-12">FAQs</h2>
            <div className="bg-white p-8 rounded-xl shadow-xl space-y-12">
                <ContactInfo />
                <MapSection />
            </div>
        </div>
    );
};

const ContactInfo = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-3xl font-semibold text-gray-800">Contact Information</h3>
            <p className="text-lg text-gray-700">
                <strong>Address:</strong> 80 Dinh Bo Linh, Ward 26, Binh Thanh District, Ho Chi Minh City
            </p>
            <p className="text-lg text-gray-700">
                <strong>Phone:</strong> (+84) 123 456 789
            </p>
            <p className="text-lg text-gray-700">
                <strong>Email:</strong> info@example.com
            </p>
        </div>
    );
};

const MapSection = () => {
    return (
        <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-6">Our Location</h3>
            <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.7070459470675!2d106.69544177582063!3d10.762622192307998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752eb1e11f9d2f%3A0x8f4968a40e45dd92!2sBen%20Thanh%20Market!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: '0' }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Google Map"
                ></iframe>
            </div>
        </div>
    );
};

export default FAQPage;
