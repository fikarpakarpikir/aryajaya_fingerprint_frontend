import { useEffect } from "react";
import { measureNetworkSpeed } from "@/utils/checkNetworkSpeed";
import { checkCameraPermission } from "@/Functions/reqPermission";
import { useFaceContext } from "@/context/FaceContext";

export default function useCameraAndModels({ loadModels, fetchData }) {
    const { isCameraDenied, setIsCameraDenied, setLoading } = useFaceContext();

    useEffect(() => {
        const check = async () => {
            const access = await checkCameraPermission();
            if (!access) {
                if (!isCameraDenied) setIsCameraDenied(true);
                return;
            }

            await loadModels();
            await fetchData();
            setLoading(false);
        };

        check();
    }, []);
}
