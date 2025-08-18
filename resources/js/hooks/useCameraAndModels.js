import { useEffect } from "react";
import { measureNetworkSpeed } from "@/utils/checkNetworkSpeed";
import { checkCameraPermission } from "@/Functions/reqPermission";
import { useFaceContext } from "@/context/FaceContext";

export default function useCameraAndModels(
    dataUser,
    { loadModels, fetchData }
) {
    const { isCameraDenied, setIsCameraDenied, setSpeedNetwork, setLoading } =
        useFaceContext();

    useEffect(() => {
        if (!dataUser?.id) return;

        const check = async () => {
            const checkSpeed = measureNetworkSpeed();
            setSpeedNetwork(checkSpeed);

            const access = await checkCameraPermission();
            if (!access) {
                if (!isCameraDenied) setIsCameraDenied(true);
                return;
            }

            if (dataUser?.face?.length >= 2) {
                await loadModels();
                await fetchData();
            } else {
                setLoading(false);
                loadModels();
            }
        };

        check();
    }, [dataUser?.id]);
}
