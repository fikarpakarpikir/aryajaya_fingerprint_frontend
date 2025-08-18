export default function useJadwalCheck({
    dataUser,
    jadwal,
    cekJadwal,
    diffHours,
    diffMinutes,
    props,
}) {
    const { setLoading, setMessage, setSubMessage, setNotif, goToHome } =
        useFaceContext();

    useEffect(() => {
        if (!(dataUser && jadwal)) return;

        if (cekJadwal === 2 && props.jadwalKerja?.jadwal !== "libur") {
            const presensi = props.jadwalKerja?.presensi?.[0];
            setLoading(false);
            setMessage("Anda hari ini telah presensi");
            setSubMessage(
                <>
                    Masuk:{" "}
                    <span className="badge bg-primary">
                        {fullWaktuIndo(presensi?.mulai)}
                    </span>
                    <br />
                    Pulang:{" "}
                    <span className="badge bg-primary">
                        {fullWaktuIndo(presensi?.selesai)}
                    </span>
                </>
            );
            setNotif(true);
            goToHome(3000);
            return;
        }

        if (cekJadwal === 3 || props.jadwalKerja?.jadwal === "libur") {
            setLoading(false);
            setNotifKosong(true);
            goToHome(5500);
            return;
        }

        if (cekJadwal === 1 && diffHours <= 0 && diffMinutes <= 5) {
            setLoading(false);
            setMessage("Presensi Pulang masih Ditutup");
            setSubMessage(
                <>
                    Jam kerja anda hari ini:{" "}
                    <span className="badge bg-primary">
                        {jamIndo(jadwal.mulai)} - {jamIndo(jadwal.selesai)}
                    </span>
                    <br />
                    Baru bisa presensi pulang setelah{" "}
                    <span className="badge bg-primary">
                        {jamIndo(modifyTime(jadwal.mulai, 5, "menit"))}
                    </span>
                </>
            );
            setNotif(true);
            goToHome(5500);
        }
    }, [dataUser, jadwal, cekJadwal, diffHours, diffMinutes]);
}
