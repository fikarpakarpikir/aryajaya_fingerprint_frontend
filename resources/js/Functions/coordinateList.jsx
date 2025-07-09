import React, { useState, useEffect } from "react";

const CoordinateList = ({ coordinates }) => {
    const [addresses, setAddresses] = useState({});

    useEffect(() => {
        const fetchAddresses = async () => {
            for (const { lat, lon } of coordinates) {
                const address = await getAddress(lat, lon);
                setAddresses((prevAddresses) => ({
                    ...prevAddresses,
                    [`${lat},${lon}`]: address,
                }));
            }
        };

        const debouncedFetch = debounce(fetchAddresses, 500);
        debouncedFetch();
    }, [coordinates]);

    return (
        <div>
            {coordinates.map(({ lat, lon }) => (
                <div key={`${lat},${lon}`}>
                    <p>
                        Latitude: {lat}, Longitude: {lon}
                    </p>
                    <p>Address: {addresses[`${lat},${lon}`] || "Loading..."}</p>
                </div>
            ))}
        </div>
    );
};

export default CoordinateList;
