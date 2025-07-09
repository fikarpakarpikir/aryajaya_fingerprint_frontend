const mataUangIndo = (nominal) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(nominal);
};

export default mataUangIndo;
