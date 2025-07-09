export default function fullDateDiff(date1, date2) {
    // Convert the dates to JavaScript Date objects
    const jsDate1 = new Date(date1);
    const jsDate2 = new Date(date2);

    // Calculate absolute time difference in milliseconds
    const timeDiff = Math.abs(jsDate2 - jsDate1);

    // Calculate years, months, and days
    const year1 = jsDate1.getFullYear();
    const year2 = jsDate2.getFullYear();
    const month1 = jsDate1.getMonth();
    const month2 = jsDate2.getMonth();
    const day1 = jsDate1.getDate();
    const day2 = jsDate2.getDate();

    let years = year2 - year1;
    let months = month2 - month1;
    let days = day2 - day1;
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    const totalHours = Math.floor(timeDiff / (1000 * 60 * 60)) + 1;
    const totalMinutes = Math.floor(timeDiff / (1000 * 60)) + 1;
    const totalMinutesInHour =
        Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)) + 1;
    // Tambahan: arah waktu (maju atau mundur)
    const isLate = jsDate2 <= jsDate1; // true jika telat (date2 < date1)
    const isEarly = jsDate2 > jsDate1; // true jika lebih awal (date2 > date1)

    if (days < 0) {
        // Adjust for negative days
        const prevMonth = new Date(
            jsDate2.getFullYear(),
            jsDate2.getMonth(),
            0
        );
        days += prevMonth.getDate();
        months -= 1;
    }

    if (months < 0) {
        // Adjust for negative months
        months += 12;
        years -= 1;
    }

    // Calculate weeks, hours, minutes, and seconds
    const weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
    const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // Return the difference as an object
    return {
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
        totalDays,
        totalHours,
        totalMinutes,
        totalMinutesInHour,
        isLate,
        isEarly,
    };
}

export function fullDateDiffRaw(date1, date2) {
    // Convert the dates to JavaScript Date objects
    const jsDate1 = new Date(date1);
    const jsDate2 = new Date(date2);

    // Hitung raw difference (bisa negatif)
    const rawDiffMs = jsDate2 - jsDate1;
    const rawDiffInMinutes = Math.floor(rawDiffMs / (1000 * 60));

    // Hitung absolute time difference (selalu positif)
    const timeDiff = Math.abs(rawDiffMs);

    // Extract date parts
    const year1 = jsDate1.getFullYear();
    const year2 = jsDate2.getFullYear();
    const month1 = jsDate1.getMonth();
    const month2 = jsDate2.getMonth();
    const day1 = jsDate1.getDate();
    const day2 = jsDate2.getDate();

    // Hitung Y-M-D difference
    let years = year2 - year1;
    let months = month2 - month1;
    let days = day2 - day1;

    if (days < 0) {
        const prevMonth = new Date(year2, month2, 0);
        days += prevMonth.getDate();
        months -= 1;
    }

    if (months < 0) {
        months += 12;
        years -= 1;
    }

    // Total waktu
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    const totalHours = Math.floor(timeDiff / (1000 * 60 * 60)) + 1;
    const totalMinutes = Math.floor(timeDiff / (1000 * 60)) + 1;
    const totalMinutesInHour = Math.floor(
        (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
    );

    // Tambahan waktu detail
    const weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
    const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // Logika arah waktu
    const isEarly = rawDiffMs <= 0;
    const isLate = rawDiffMs > 0;
    const sameTime = rawDiffMs === 0;

    // Logika waktu (jam & menit) saja
    const timeOnly1 = jsDate1.getHours() * 60 + jsDate1.getMinutes();
    const timeOnly2 = jsDate2.getHours() * 60 + jsDate2.getMinutes();
    const isTimeEarlier = timeOnly2 < timeOnly1;
    const isTimeLater = timeOnly2 > timeOnly1;
    const sameTimeOfDay = timeOnly1 === timeOnly2;

    return {
        // Absolute time diff
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
        totalDays,
        totalHours,
        totalMinutes,
        totalMinutesInHour,

        // Arah waktu penuh
        isEarly, // true jika date2 lebih awal atau sama dengan date1
        isLate, // true jika date2 lebih lambat dari date1
        sameTime, // true jika persis sama

        // Detail menit kasar (bisa negatif)
        rawDiffInMinutes,

        // Waktu harian saja
        isTimeEarlier, // hanya bandingkan jam & menit
        isTimeLater,
        sameTimeOfDay,
    };
}

export const DateDiff = (date1 = new Date(), date2 = new Date(), units) => {
    const date = (date1, date2, unit) => {
        const diff = fullDateDiff(date1, date2);
        let satuan;
        switch (unit) {
            case "years":
                satuan = "tahun";
                break;
            case "months":
                satuan = "bulan";
                break;
            case "weeks":
                satuan = "minggu";
                break;
            case "totalDays":
            case "days":
                satuan = "hari";
                break;
            case "totalHours":
            case "hours":
                satuan = "jam";
                break;
            case "minutes":
                satuan = "menit";
                break;
            case "seconds":
                satuan = "detik";
                break;

            default:
                break;
        }
        return `${diff[unit]} ${satuan}`;
    };

    return ["object", "array"].includes(typeof units)
        ? units.map((unit) => date(date1, date2, unit)).join(" ")
        : DateDiff(date1, date2, units);
};

export function timeDiff(date1, date2) {
    let jsDate1 = new Date(date1);
    let jsDate2 = new Date(date2);

    // Ensure jsDate1 is always earlier than jsDate2
    if (jsDate1 > jsDate2) {
        [jsDate1, jsDate2] = [jsDate2, jsDate1];
    }

    let year1 = jsDate1.getFullYear();
    let year2 = jsDate2.getFullYear();
    let month1 = jsDate1.getMonth();
    let month2 = jsDate2.getMonth();
    let day1 = jsDate1.getDate();
    let day2 = jsDate2.getDate();
    let hour1 = jsDate1.getHours();
    let hour2 = jsDate2.getHours();
    let minute1 = jsDate1.getMinutes();
    let minute2 = jsDate2.getMinutes();
    let second1 = jsDate1.getSeconds();
    let second2 = jsDate2.getSeconds();

    let years = Math.abs(year2 - year1);
    let months = Math.abs(month2 - month1);
    let days = Math.abs(day2 - day1);
    let hours = Math.abs(hour2 - hour1);
    let minutes = Math.abs(minute2 - minute1);
    let seconds = Math.abs(second2 - second1);

    return { years, months, days, hours, minutes, seconds };
    // const jsDate1 = new Date(date1);
    // const jsDate2 = new Date(date2);

    // // Ensure the first date is always earlier
    // if (jsDate1 > jsDate2) {
    //     [jsDate1, jsDate2] = [jsDate2, jsDate1];
    // }

    // // Extract components
    // let year1 = jsDate1.getFullYear();
    // let year2 = jsDate2.getFullYear();
    // let month1 = jsDate1.getMonth();
    // let month2 = jsDate2.getMonth();
    // let day1 = jsDate1.getDate();
    // let day2 = jsDate2.getDate();

    // let years = year2 - year1;
    // let months = month2 - month1;
    // let days = day2 - day1;

    // if (days < 0) {
    //     // Get the last day of the previous month
    //     const prevMonth = new Date(year2, month2, 0).getDate();
    //     days += prevMonth;
    //     months -= 1;
    // }

    // if (months < 0) {
    //     months += 12;
    //     years -= 1;
    // }

    // // Create a new Date object for precise time calculations
    // const remainingTime1 = new Date(
    //     year2,
    //     month2,
    //     day2,
    //     jsDate1.getHours(),
    //     jsDate1.getMinutes(),
    //     jsDate1.getSeconds()
    // );
    // const timeDiffMs = remainingTime1 - jsDate2;

    // const hours = Math.floor(timeDiffMs / (1000 * 60 * 60));
    // const minutes = Math.floor((timeDiffMs % (1000 * 60 * 60)) / (1000 * 60));
    // const seconds = Math.floor((timeDiffMs % (1000 * 60)) / 1000);

    // // Return the result
    // return { years, months, days, hours, minutes, seconds };
}
