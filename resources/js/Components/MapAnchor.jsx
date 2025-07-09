import { useEffect, useRef, useState } from "react";

import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { Spinner } from "flowbite-react";

function MapAnchor({ long, lat }) {
    const [isLoading, setIsLoading] = useState(false);
    const apiKeyMaptiler = "2ibJ24OqxtTPt4wPHixM";
    const mapContainer = useRef(null);
    const marker = useRef(null);
    const longPt = Number(long);
    const latPt = Number(lat);
    // const tokyo = { lng: 139.753, lat: 35.6844 };
    // console.log(long, lat);

    const map = useRef(null);
    const zoom = 16;
    maptilersdk.config.apiKey = apiKeyMaptiler;
    useEffect(() => {
        setIsLoading(true);
        if (
            map.current || // Map sudah ada
            isNaN(longPt) ||
            isNaN(latPt)
        ) {
            setIsLoading(false);
            return;
        }

        if (!map.current) {
            // Inisialisasi pertama kali
            map.current = new maptilersdk.Map({
                container: mapContainer.current,
                style: maptilersdk.MapStyle.STREETS,
                center: [longPt, latPt],
                // center: [tokyo.lng, tokyo.lat],

                zoom: zoom,
            });

            // Tambah marker
            marker.current = new maptilersdk.Marker({ color: "red" })
                .setLngLat([longPt, latPt])
                // .setLngLat([tokyo.lng, tokyo.lat])
                .addTo(map.current);
        } else {
            // Update lokasi dan marker
            map.current.setCenter([longPt, latPt]);

            if (marker.current) {
                marker.current.setLngLat([longPt, latPt]);
            } else {
                marker.current = new maptilersdk.Marker({ color: "red" })
                    .setLngLat([longPt, latPt])
                    .addTo(map.current);
            }
        }
        // }, [tokyo.lng, tokyo.lat, zoom]);
        setIsLoading(false);
    }, [longPt, latPt, zoom]);
    if (isNaN(longPt) || isNaN(latPt)) {
        return <p className="text-red-500">Data tidak valid</p>;
    }
    return isLoading ? (
        <div className="text-center">
            <Spinner />
        </div>
    ) : (
        <div className="map-wrap h-48">
            <div
                ref={mapContainer}
                className="map w-full mt-2 rounded shadow border"
            />
        </div>
    );
}

export default MapAnchor;
