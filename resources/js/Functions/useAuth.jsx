import { usePage } from "@inertiajs/react";

export const findRole = (data, id) => {
    return data.kode_role === id;
};
export default function useAuth() {
    const props = usePage().props;
    const auth = props.auth;
    const user = auth.user;
    const org = user?.org;
    // console.log("🚀 ~ useAuth ~ user:", user);
    const isDev = user.id === 1;
    const isDirut = findRole(user, 1);
    const isSU = findRole(user, 2);
    const isIT = findRole(user, 3);
    const isManager = findRole(user, 4);
    const isHC = findRole(user, 5);
    const isSV = findRole(user, 6);
    const isGM = findRole(user, 8);
    const getAtasan = () => {
        switch (org.pegawai?.kode_status_kerja) {
            case 1:
                // console.log(1, org.pegawai);
                return org?.pegawai?.kode_struktural;

                break;
            case 2:
                // console.log(2, org.pegawai.kontrak.length);
                if (org?.pegawai?.kontrak?.length > 0) {
                    const lastKontrak =
                        org.pegawai.kontrak[org.pegawai.kontrak.length - 1];
                    return lastKontrak?.kode_struktural;
                } else {
                    return null;
                }
                break;

            default:
                break;
        }
    };
    const isAtasan = getAtasan() <= 7;

    return {
        props,
        auth,
        user,
        org,
        isDev,
        isDirut,
        isSU,
        isIT,
        isManager,
        isHC,
        isSV,
        isGM,
        isAtasan,
    };
}
