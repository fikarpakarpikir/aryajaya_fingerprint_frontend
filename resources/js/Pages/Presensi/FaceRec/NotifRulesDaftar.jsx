export const NotifRulesDaftar = ({ handleSiap }) => {
    return (
        <div className="bg-white rounded-lg shadow p-2 text-center lg:w-1/3 md:w-2/3 w-full mx-auto">
            <div className="font-bold text-uppersize badge bg-amber-500 text-white mb-3">
                Mohon Perhatikan!
            </div>
            <ul className="text-start list-disc mx-8 mb-3">
                <li>Pastikan wajah berada di tengah lingkaran</li>
                <li>Mendapatkan cahaya yang cukup</li>
                <li>Tidak memakai atribut kepala/wajah</li>
                <li>Tidak ada orang lain disekitar Anda</li>
                <li>
                    Scan Wajah Pertama, Anda harus berekspresi{" "}
                    <strong>netral</strong>
                </li>
                <li>
                    Scan Wajah Kedua, Anda harus <strong>senyum</strong>
                </li>
            </ul>

            <span className="font-bold">Anda sudah siap?</span>
            <br />
            <button
                onClick={handleSiap}
                className="btn-primary rounded-full py-1 uppercase font-bold"
            >
                Mulai
            </button>
        </div>
    );
};
