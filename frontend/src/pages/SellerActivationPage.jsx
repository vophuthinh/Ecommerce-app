import axios from 'axios';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { server } from '../server';
import Lottie from 'react-lottie';
import animationData from '../Assests/animations/107043-success.json';
import animationDatafail from '../Assests/animations/failtoken.json';

const SellerActivationPage = () => {
    const { activation_token } = useParams();
    const [error, setError] = useState(false);
    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };
    const failOptions = {
        loop: false,
        autoplay: true,
        animationData: animationDatafail,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    useEffect(() => {
        if (activation_token) {
            const sendRequest = async () => {
                await axios
                    .post(`${server}/shop/activation`, {
                        activation_token,
                    })
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((err) => {
                        setError(true);
                    });
            };
            sendRequest();
        }
    }, []);

    return (
        <div
            style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {error ? (
                <div>
                    <Lottie options={failOptions} width={300} height={300} />
                    <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">Your token has expired 😭</h5>
                    <br />
                    <br />
                </div>
            ) : (
                <div>
                    <Lottie options={defaultOptions} width={300} height={300} />
                    <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
                        Sales account created successfully 🥳
                    </h5>
                    <br />
                    <br />
                </div>
            )}
        </div>
    );
};

export default SellerActivationPage;
