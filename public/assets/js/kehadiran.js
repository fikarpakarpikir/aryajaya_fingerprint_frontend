$(function () {
    document.getElementById("mulai_cuti").disabled = true;
    document.getElementById("selesai_cuti").disabled = true;
    document.getElementById("mulai_cuti_khusus").disabled = true;
    document.getElementById("selesai_cuti_khusus").disabled = true;
    document.getElementById("mulai_izin_khusus").disabled = true;
    document.getElementById("selesai_izin_khusus").disabled = true;
    document.getElementById("mulai_terlambat").disabled = true;
    document.getElementById("selesai_terlambat").disabled = true;
    // cuti

    $('select[name="macam_hadir"]').on("change", function () {
        let jenis = parseInt($(this).val());
        let total = parseInt($(this).attr("data-cuti"));
        let jatah_thn = 12;
        // 1-tahunan
        // 2-melahirkan
        // 3-keguguran
        // 4-haid
        // 5-haji
        // 6-umrah

        if (jenis != null && jenis != "") {
            // Cuti Tahunan
            // console.log(jenis >= 1 && jenis <= 6);
            var cutiTahunan = [1, 4, 31];
            var cutiKhusus = [3, 5, 6, 8, 9, 14, 15, 21, 22];
            var izinKhusus = [2, 7, 10, 11, 12, 13, 23, 24, 25, 26];
            var izinTerlambat = [16, 17, 18, 27];
            var lembur = [19, 20];
            var kerja = [28, 29];

            // if (jenis >= 1 && jenis <= 2 || jenis == 4) {
            if (cutiTahunan.includes(jenis)) {
                const pesanTextFotoCutiTahunan = document.getElementById(
                    "pesan_text_dan_foto_nyusul_cuti_tahunan"
                );
                var target_start = ".start-cuti";
                var target_end = ".end-cuti";
                var target_tanggal_mulai = "mulai_cuti";
                var target_tanggal_selesai = "selesai_cuti";
                var bukti = "bukti_cuti_tahunan";
                var pesan = "#pesan_cuti_tahunan";
                switch (jenis) {
                    case 1:
                        mulai_hari = 2;
                        mulai_waktu = "weeks";
                        if (total >= 3) {
                            selesai_hari = 2;
                        } else {
                            selesai_hari = total - 1;
                        }
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "text");
                        pesanTextFotoCutiTahunan.classList.add("d-none");
                        break;
                    case 4:
                        mulai_hari = 2;
                        mulai_waktu = "weeks";
                        selesai_hari = total - 1;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        pesanTextFotoCutiTahunan.classList.add("d-none");
                        break;
                    case 31:
                        mulai_hari = 0;
                        mulai_waktu = "day";
                        selesai_hari = total - 1;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "text");
                        if (
                            pesanTextFotoCutiTahunan &&
                            pesanTextFotoCutiTahunan.classList.contains(
                                "d-none"
                            )
                        ) {
                            pesanTextFotoCutiTahunan.classList.remove("d-none");
                        }
                        break;
                    default:
                        break;
                }

                $(pesan).removeClass("d-block");
                $(pesan).addClass("d-none");
                if (total > 0) {
                    custom_datepicker(
                        target_start,
                        target_end,
                        target_tanggal_mulai,
                        target_tanggal_selesai,
                        mulai_hari,
                        mulai_waktu,
                        selesai_hari,
                        selesai_waktu
                    );
                }
            } else if (cutiKhusus.includes(jenis)) {
                // Cuti Khusus
                var target_start = ".start-cuti_khusus";
                var target_end = ".end-cuti_khusus";
                var target_tanggal_mulai = "mulai_cuti_khusus";
                var target_tanggal_selesai = "selesai_cuti_khusus";
                var bukti = "bukti_cuti_khusus";
                var pesan = "#pesan_cuti_khusus";
                switch (jenis) {
                    case 3:
                        mulai_hari = 3;
                        mulai_waktu = "months";
                        selesai_hari = 40;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        break;
                    case 5:
                        mulai_hari = 2;
                        mulai_waktu = "weeks";
                        selesai_hari = 2;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "text");
                        break;
                    case 6:
                        mulai_hari = 2;
                        mulai_waktu = "weeks";
                        selesai_hari = 3;
                        selesai_waktu = "months";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        break;
                    // case 7:
                    //     mulai_hari = 0
                    //     mulai_waktu = 'days'
                    //     selesai_hari = 6
                    //     selesai_waktu = 'weeks'
                    //     break;
                    case 8:
                        mulai_hari = 2;
                        mulai_waktu = "weeks";
                        selesai_hari = 1;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        break;
                    case 9:
                        mulai_hari = 2;
                        mulai_waktu = "weeks";
                        selesai_hari = 1;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "text");
                        break;
                    // case 10:
                    //     mulai_hari = 0
                    //     mulai_waktu = 'days'
                    //     selesai_hari = 1
                    //     selesai_waktu = 'days'
                    //     break;
                    // case 11:
                    //     mulai_hari = 0
                    //     mulai_waktu = 'days'
                    //     selesai_hari = 1
                    //     selesai_waktu = 'days'
                    //     break;
                    // case 12:
                    //     mulai_hari = 0
                    //     mulai_waktu = 'days'
                    //     selesai_hari = 0
                    //     selesai_waktu = 'days'
                    //     break;
                    // case 13:
                    //     mulai_hari = 0
                    //     mulai_waktu = 'days'
                    //     selesai_hari = 1
                    //     selesai_waktu = 'days'
                    //     break;
                    case 14:
                        mulai_hari = 2;
                        mulai_waktu = "weeks";
                        selesai_hari = 0;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        break;
                    case 15:
                        mulai_hari = 2;
                        mulai_waktu = "days";
                        selesai_hari = 0;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        break;
                    case 21:
                        mulai_hari = 2;
                        mulai_waktu = "weeks";
                        selesai_hari = 1;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "text");
                        break;
                    case 22:
                        mulai_hari = 2;
                        mulai_waktu = "weeks";
                        selesai_hari = 0;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        break;
                    default:
                        break;
                }

                $(pesan).removeClass("d-block");
                $(pesan).addClass("d-none");

                custom_datepicker(
                    target_start,
                    target_end,
                    target_tanggal_mulai,
                    target_tanggal_selesai,
                    mulai_hari,
                    mulai_waktu,
                    selesai_hari,
                    selesai_waktu
                );
            } else if (izinKhusus.includes(jenis)) {
                var target_start = ".start-izin_khusus";
                var target_end = ".end-izin_khusus";
                var target_tanggal_mulai = "mulai_izin_khusus";
                var target_tanggal_selesai = "selesai_izin_khusus";
                var bukti = "bukti_izin_khusus";
                var pesan = "#pesan_izin_khusus";
                switch (jenis) {
                    case 2:
                        mulai_hari = 0;
                        mulai_waktu = "days";
                        selesai_hari = 1;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        break;
                    case 7:
                        mulai_hari = 0;
                        mulai_waktu = "days";
                        selesai_hari = 6;
                        selesai_waktu = "weeks";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        break;
                    case 10:
                        mulai_hari = 0;
                        mulai_waktu = "days";
                        selesai_hari = 1;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        break;
                    case 11:
                        mulai_hari = 0;
                        mulai_waktu = "days";
                        selesai_hari = 1;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        break;
                    case 12:
                        mulai_hari = 0;
                        mulai_waktu = "days";
                        selesai_hari = 0;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        break;
                    case 13:
                        mulai_hari = 0;
                        mulai_waktu = "days";
                        selesai_hari = 1;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        break;
                    case 23:
                        mulai_hari = 1;
                        mulai_waktu = "days";
                        selesai_hari = 6;
                        selesai_waktu = "months";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        break;
                    case 24:
                        mulai_hari = -1;
                        mulai_waktu = "days";
                        selesai_hari = 12;
                        selesai_waktu = "months";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        break;
                    case 25:
                        mulai_hari = 0;
                        mulai_waktu = "days";
                        selesai_hari = 0;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        break;
                    case 26:
                        mulai_hari = 0;
                        mulai_waktu = "days";
                        selesai_hari = 1;
                        selesai_waktu = "days";
                        document
                            .getElementById(bukti)
                            .setAttribute("type", "file");
                        break;
                    default:
                        break;
                }

                $(pesan).removeClass("d-block");
                $(pesan).addClass("d-none");

                custom_datepicker(
                    target_start,
                    target_end,
                    target_tanggal_mulai,
                    target_tanggal_selesai,
                    mulai_hari,
                    mulai_waktu,
                    selesai_hari,
                    selesai_waktu
                );
            } else if (izinTerlambat.includes(jenis)) {
                var target_start = ".start-terlambat";
                var target_end = ".end-terlambat";
                var target_tanggal_mulai = "mulai_terlambat";
                var target_tanggal_selesai = "selesai_terlambat";
                var bukti = "bukti_izin_terlambat";
                var pesan = "#pesan_terlambat";

                mulai_hari = 0;
                mulai_waktu = "days";
                selesai_hari = 0;
                selesai_waktu = "days";

                $(pesan).removeClass("d-block");
                $(pesan).addClass("d-none");

                custom_datepicker(
                    target_start,
                    target_end,
                    target_tanggal_mulai,
                    target_tanggal_selesai,
                    mulai_hari,
                    mulai_waktu,
                    selesai_hari,
                    selesai_waktu
                );
            }
        } else {
            $("#pesan_tanggal").addClass("d-block");
            $("#pesan_tanggal").removeClass("d-none");
            document.getElementById("mulai_cuti").disabled = true;
            document.getElementById("selesai_cuti").disabled = true;
            $("#pesan_izin").addClass("d-block");
            $("#pesan_izin").removeClass("d-none");
            document.getElementById("mulai_izin").disabled = true;
            document.getElementById("selesai_izin").disabled = true;
        }
    });

    $(".start-sakit").datepicker({
        templates: {
            leftArrow: '<i class="fa fa-chevron-left"></i>',
            rightArrow: '<i class="fa fa-chevron-right"></i>',
        },
        format: "yyyy-mm-dd",
        // startDate: new Date(),
        startDate: moment().add(0, "days").toDate(),
        keyboardNavigation: false,
        autoclose: true,
        todayHighlight: true,
        disableTouchKeyboard: true,
        orientation: "bottom auto",
    });

    $(".end-sakit").datepicker({
        templates: {
            leftArrow: '<i class="fa fa-chevron-left"></i>',
            rightArrow: '<i class="fa fa-chevron-right"></i>',
        },
        format: "yyyy-mm-dd",
        startDate: moment().add(0, "days").toDate(),
        // endDate: '+2w',
        // datesDisabled: '+2w',
        keyboardNavigation: false,
        autoclose: true,
        todayHighlight: true,
        disableTouchKeyboard: true,
        orientation: "bottom auto",
    });

    $(".start-sakit")
        .datepicker()
        .on("changeDate", function () {
            var startDate = $(this).datepicker("getDate");
            var oneDayFromStartDate = moment(startDate).add(0, "days").toDate();
            $(".end-sakit").datepicker("setStartDate", oneDayFromStartDate);
            $(".end-sakit").datepicker("setDate", oneDayFromStartDate);
        });

    $(".end-sakit")
        .datepicker()
        .on("show", function () {
            var startDate = $(".start-sakit").datepicker("getDate");
            $(".day.disabled")
                .filter(function (index) {
                    return $(this).text() === moment(startDate).format("D");
                })
                .addClass("active");
        });

    // $('.input-daterange input').each(function() {
    //     $(this).datepicker('clearDates');
    // });
});
// Pengajuan Izin & sakit
function izin_sakit(isi) {
    // console.log(isi.value);
    const pesanTextFotoIzin = document.getElementById(
        "pesan_text_dan_foto_nyusul_izin"
    );
    switch (isi.value) {
        case "izin":
            document.getElementById("bukti_sakit").setAttribute("type", "text");
            pesanTextFotoIzin.classList.remove("d-none");
            break;
        case "sakit":
            document.getElementById("bukti_sakit").setAttribute("type", "file");
            pesanTextFotoIzin.classList.add("d-none");
            break;

        default:
            break;
    }
}

// tanggal_mulai = document.querySelectorAll('input[name="mulai"]')
// tanggal_selesai = document.querySelectorAll('input[name="selesai"]')

// for (let i = 0; i < tanggal_mulai.length; i++) {
//     tanggal_mulai[i].setAttribute('disabled', 'disabled')
//     tanggal_selesai[i].setAttribute('disabled', 'disabled')
// }

function overshift(val) {
    let id = parseInt(val.getAttribute("data-id"));
    let durasi = parseInt(val.getAttribute("data-durasi"));
    let sisa = parseInt(val.getAttribute("data-sisa-lembur"));

    target_start = ".start-tanggal" + id;
    target_end = ".end-tanggal" + id;
    mulai_hari = 0;
    mulai_waktu = "days";
    selesai_hari = durasi - 1;
    selesai_waktu = "days";

    target_tanggal_mulai = "start_tanggal" + id;
    target_tanggal_selesai = "end_tanggal" + id;

    custom_datepicker(
        target_start,
        target_end,
        target_tanggal_mulai,
        target_tanggal_selesai,
        mulai_hari,
        mulai_waktu,
        selesai_hari,
        selesai_waktu
    );
}
// Pengajuan Lembur
function lembur(durasi_mulai) {
    $("#loading").removeClass("d-none");
    target_start = ".start-lembur";
    target_end = ".end-lembur";
    mulai_hari = durasi_mulai;
    mulai_waktu = "days";
    selesai_hari = 100;
    selesai_waktu = "days";

    target_tanggal_mulai = "mulai_lembur";
    target_tanggal_selesai = "selesai_lembur";

    custom_datepicker(
        target_start,
        target_end,
        target_tanggal_mulai,
        target_tanggal_selesai,
        mulai_hari,
        mulai_waktu,
        selesai_hari,
        selesai_waktu
    );

    $("#loading").addClass("d-none");
}

function kerja(val) {
    const btnHari = document.getElementById("btn-hari");
    const btn_hari = document.querySelectorAll(".btn-hari");
    if (val == 0) {
        btnHari.classList.add("d-none");
        for (let i = 0; i < btn_hari.length; i++) {
            btn_hari[i].checked = false;
        }
    } else if (val == 1) {
        btnHari.classList.remove("d-none");
    }
    jadwal_kerja("kerja");
}
function jadwal_kerja(kategori) {
    $("#loading").removeClass("d-none");
    target_start = ".start-" + kategori;
    target_end = ".end-" + kategori;
    mulai_hari = -50;
    mulai_waktu = "days";
    selesai_hari = kategori == "kerja" ? 0 : 30;
    selesai_waktu = "days";

    target_tanggal_mulai = "mulai_" + kategori;
    target_tanggal_selesai = "selesai_" + kategori;

    custom_datepicker(
        target_start,
        target_end,
        target_tanggal_mulai,
        target_tanggal_selesai,
        mulai_hari,
        mulai_waktu,
        selesai_hari,
        selesai_waktu
    );

    $("#loading").addClass("d-none");
}

function custom_datepicker(
    target_start,
    target_end,
    target_tanggal_mulai,
    target_tanggal_selesai,
    mulai_hari,
    mulai_waktu,
    selesai_hari,
    selesai_waktu
) {
    document.getElementById(target_tanggal_mulai).disabled = false;
    document.getElementById(target_tanggal_selesai).disabled = false;
    $(target_start).val("");
    $(target_end).val("");
    $(target_start).datepicker(
        "setStartDate",
        moment().add(mulai_hari, mulai_waktu).toDate()
    );
    $(target_start).datepicker("format", "yyyy-mm-dd");

    $(target_start).datepicker({
        templates: {
            leftArrow: '<i class="fa fa-chevron-left"></i>',
            rightArrow: '<i class="fa fa-chevron-right"></i>',
        },
        format: "yyyy-mm-dd",
        // startDate: new Date(),
        startDate: moment().add(mulai_hari, mulai_waktu).toDate(),
        keyboardNavigation: false,
        autoclose: true,
        todayHighlight: true,
        disableTouchKeyboard: true,
        orientation: "bottom auto",
    });

    $(target_end).datepicker({
        templates: {
            leftArrow: '<i class="fa fa-chevron-left"></i>',
            rightArrow: '<i class="fa fa-chevron-right"></i>',
        },
        format: "yyyy-mm-dd",
        startDate: moment().add(0, "days").toDate(),
        // endDate: '+2w',
        // datesDisabled: '+2w',
        keyboardNavigation: false,
        autoclose: true,
        todayHighlight: true,
        disableTouchKeyboard: true,
        orientation: "bottom auto",
    });

    $(target_start)
        .datepicker()
        .on("changeDate", function () {
            var startDate = $(this).datepicker("getDate");
            var oneDayFromStartDate = moment(startDate).add(0, "days").toDate();
            var oneDayFromEndDate = moment(startDate)
                .add(selesai_hari, selesai_waktu)
                .toDate();
            $(target_end).datepicker("setStartDate", oneDayFromStartDate);
            $(target_end).datepicker("setEndDate", oneDayFromEndDate);
            $(target_end).datepicker("setDate", oneDayFromStartDate);
        });

    $(target_end)
        .datepicker()
        .on("show", function () {
            var startDate = $(target_start).datepicker("getDate");
            $(".day.disabled")
                .filter(function (index) {
                    return $(this).text() === moment(startDate).format("D");
                })
                .addClass("active");
        });
}
