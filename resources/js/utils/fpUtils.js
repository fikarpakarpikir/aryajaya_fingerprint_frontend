export const panggilanKaryawan = (nama) => {
    const wordsToRemove = [
        "Muhammad",
        "Muhamad",
        "Muh",
        "Mochammad",
        "Mochamad",
        "Mohammad",
        "M",
        "Siti",
    ];
    return nama?.split(" ").filter((part) => !wordsToRemove.includes(part));
};

export const getIndex = (id, jenisKehadiran) => {
    let color,
        text = "white",
        title = jenisKehadiran?.find((item) => item.id == id)?.title;

    switch (id) {
        case 1:
            color = "#00954a";
            break;
        case 2:
        case 3:
        case 4:
        case 5:
            color = "#64748b";
            break;
        case 6:
        case 8:
            color = "#ae0a0a";
            break;
        case 7:
            color = "#ffa151";
            text = "dark";
            break;
        case 9:
            color = "#55a6f8";
            break;
        case 10:
            color = "#ffe421";
            text = "dark";
            break;
        case 11:
            color = "#55a6f8";
            break;
        case 12:
        case 13:
            color = "#64748b";
            break;
        default:
            color = "light border border-dark border-2";
            title = "Ruangan";
            text = "dark";
            break;
    }

    return { color, text, title };
};

export const selamatBekerja = [
    { id: 1, msg: "Selamat bekerja, semoga lancar!" },
    { id: 2, msg: "Tetap bahagia, terus semangat!" },
    { id: 3, msg: "Awali hari dengan penuh semangat!" },
    { id: 4, msg: "Semangat untuk orang sukses!" },
];

export const getRandomMessageById = (id) => {
    const message = selamatBekerja.find((item) => item.id === id);
    return message
        ? message.msg
        : getRandomMessageById(
              Math.floor(Math.random() * selamatBekerja.length) + 1
          );
};
