$(document).ready(function() {
    // Seleect Option Nikah dan Jumlah Anak
    $('select[name="kode_nikah"]').on('change', function() {
        let nikah = $(this).val();
        if (nikah == 1) {
            $('#anak').css('display', 'none')
            $('input[name="anak"]').val(0)
        } else {
            $('#anak').css('display', 'block')
        }
    });

    // Seleect Option Provinsi dan Kota
    $('select[name="province_id"]').on('change', function() {
        let provinceId = $(this).val();
        if (provinceId) {
            jQuery.ajax({
                url: '/province/' + provinceId + '/cities',
                type: "GET",
                dataType: 'json',
                success: function(data) {
                    $('select[name="city_id"]').empty()
                    $('select[name="city_id"]').append(
                        '<option>Pilih Kota...</option>')
                    $.each(data, function(key, value) {
                        $('select[name="city_id"]').append(
                            '<option value="' + key + '">' + value +
                            '</option>')
                    });
                },
            });
        } else {
            $('select[name="city_id"]').empty();
        }
    });

    // Select Option Status Karyawan
    $('select[name="kode_status_kerja"]').on('change', function() {
        let kode_kar = $(this).val();
        var pkwtt = $('#pkwtt')
        var pkwt = $('#pkwt')
        switch (kode_kar) {
            case '1':
                if (pkwtt.hasClass('d-none')) {
                    pkwtt.removeClass('d-none')
                    pkwt.addClass('d-none')
                }
                break;
            case '2':
                if (pkwt.hasClass('d-none')) {
                    pkwt.removeClass('d-none')
                    pkwtt.addClass('d-none')
                }
                break;
        
            default:
                break;
        }
    })

    // Seleect Option Jabatan Fungsional
    $('select[name="kode_struktural"]').on('change', function() {
        let struktur = $(this).val();
        jQuery.ajax({
            url: '/getFungsional',
            type: "GET",
            dataType: 'json',
            success: function(data) {
                $('select[name="fungsional"]').empty()
                $('select[name="fungsional"]').append(
                    '<option value="">Pilih Bagian Fungsional...</option>')
                $.each(data, function(key, value) {
                    $('select[name="fungsional"]').append(
                        '<option value="' + key + '">' + value +
                        '</option>')
                });
            },
        });
        // jQuery.ajax({
        //     url: '/getGolongan/' + struktur,
        //     type: "GET",
        //     dataType: 'json',
        //     success: function(data1) {
        //         $('select[name="kode_golongan"]').empty()
        //         $('select[name="kode_golongan"]').append(
        //             '<option>Pilih Golongan...</option>')
        //         $.each(data1, function(key1, value1) {
        //             $('select[name="kode_golongan"]').append(
        //                 '<option value="' + key1 + '">' + value1 +
        //                 '</option>')
        //         });
        //     },
        // });
        
        $('select[name="kode_fungsional"]').empty()
        $('select[name="kode_fungsional"]').append(
            '<option>Pilih Bagian Fungsional bagian terlebih dahulu</option>')
        if (struktur) {
            $('select[name="fungsional"]').on('change', function() {
                
                let fungsi = $(this).val();
                if (fungsi) {
                    jQuery.ajax({
                        url: '/getJabatanFungsional/' + struktur + '/' + fungsi,
                        type: "GET",
                        dataType: 'json',
                        success: function(data2) {
                            $('select[name="kode_fungsional"]').empty()
                            $('select[name="kode_fungsional"]').append(
                                '<option value="">Pilih Jabatan Fungsional...</option>')
                            $.each(data2, function(key2, value2) {
                                $('select[name="kode_fungsional"]').append(
                                    '<option value="' + key2 + '">' + value2 +
                                    '</option>')
                            });
                        },
                    });
                        
                }
            });
        } else {
            $('select[name="kode_struktural"]').empty();
        }
    });

    // Form tambah riwayat kerja
    $(".tambah").click(function() {
        $("#baru").clone().appendTo("#pengalaman");
    });

    $(".tambah-sertif").click(function() {
        $("#baru-sertif").clone().appendTo("#sertifikat");
    });
    $(".tambah-sertif-tambah").click(function() {
        $("#baru-sertif").clone().appendTo("#sertifikat-tambah");
    });

    // Buat Soal, PG
    $(".tambah-pilihan").click(function() {
        let no = parseInt($("#PG > .col-12:last > .input-group > input[name='text_pilihan[]']").attr('data-no'));
        
        if (no >= 1) {
            no += 1;
        } else {
            no = parseInt($(".d-none > #baru-pilihan:last > .input-group > input[name='text_pilihan[]']").attr('data-no'))
            no -= 1;
            // $('select[name="kode_jawaban_benar"]').empty()
        }
        

        $(".d-none > #baru-pilihan:last > input[name='id[]']").attr('id', 'id_' + no);
        $(".d-none > #baru-pilihan:last > input[name='id_pilihan[]']").attr('id', 'id_pilihan_' + no);
        $(".d-none > #baru-pilihan:last > .input-group > input[name='text_pilihan[]']").attr('placeholder', 'Pilihan ' + no);
        $(".d-none > #baru-pilihan:last > .input-group > input[name='text_pilihan[]']").attr('id', 'text_' + no);
        $(".d-none > #baru-pilihan:last > .input-group > input[name='text_pilihan[]']").attr('data-no', no);
        $(".d-none > #baru-pilihan:last > .input-group > input[name='foto_pilihan[]']").attr('id', 'file_' + no);
        $(".d-none > #baru-pilihan:last > .input-group > input[name='foto_pilihan[]']").attr('data-no', no);
        $(".d-none > #baru-pilihan:last > .input-group > .btn-danger").attr('data-no', no);
        $(".d-none > #baru-pilihan:last > .input-group > .btn-warning").attr('id', 'ganti_'+no);
        $(".d-none > #baru-pilihan:last > .input-group > .btn-warning").attr('data-no', no);
        $(".d-none > #baru-pilihan:last > .input-group > .btn-secondary").attr('id', 'batal_'+no);
        $(".d-none > #baru-pilihan:last > .input-group > .btn-secondary").attr('data-no', no);
        $(".d-none > #baru-pilihan:last > .input-group > #no_pilihan").html(no);
        $(".d-none > #baru-pilihan:last > .img-thumbnail").attr('id','preview_'+no);
        $(".d-none > #baru-pilihan:last").clone().appendTo("#PG");
        $('select[name="kode_jawaban_benar"]').append(
            '<option value="' + no + '" id="pg_'+no+'">' + no +
            '</option>')
        // $(this).attr('data-no', no);
    });

    $('select[name="kode_jenis_jawaban"]').on('change', function() {
        var jenis = $(this).val()
        console.log($('select[name="kode_jawaban_benar"]').attr('required'));
        if (jenis == "1") {
            $("#PG").css('display', 'block')
            $("#PG_benar").css('display', 'block')
            $("#btn_tambah_pil").css('display', 'block')
        } else {
            $("#btn_tambah_pil").css('display', 'none')
            $("#PG").css('display', 'none')
            $("#PG_benar").css('display', 'none')
        }
    });

    $('select[name="pendidikan"]').on('change', function() {
        let pend = $(this).val();
        if (pend <= 3) {
            $('#program').css('display', 'none')
            $('input[name="prodi"]').val('')
        } else {
            $('#program').css('display', 'block')
        }
    });

    $('.fa-eye').on('click', function() {
        target = $("#"+$(this).attr('data-id'))
        if (target.attr('type') == 'password') {
            target.attr('type', 'text');
        } else {
            target.attr('type', 'password');
        }
    })

});

function filter_pengajuan(val) {
    data = val.getAttribute('data-val')
    target = document.querySelectorAll("#data_"+data)
    btn = document.querySelectorAll(".btn_"+data)
    input = document.querySelectorAll("#btn"+data)

    switch (data) {
        case 'semua':
            data1 = 'proses'
            data2 = 'acc'
            data3 = 'tolak'
            break;
        case 'proses':
            data1 = 'semua'
            data2 = 'acc'
            data3 = 'tolak'
            break;
        case 'acc':
            data1 = 'semua'
            data2 = 'proses'
            data3 = 'tolak'
            break;
        case 'tolak':
            data1 = 'semua'
            data2 = 'proses'
            data3 = 'acc'
            break;
    
        default:
            break;
    }

    target1 = document.querySelectorAll("#data_"+data1)
    target2 = document.querySelectorAll("#data_"+data2)
    target3 = document.querySelectorAll("#data_"+data3)

    btn1 = document.querySelectorAll(".btn_"+data1);
    btn2 = document.querySelectorAll(".btn_"+data2);
    btn3 = document.querySelectorAll(".btn_"+data3);

    input1 = document.querySelectorAll("#btn_"+data1);
    input2 = document.querySelectorAll("#btn_"+data2);
    input3 = document.querySelectorAll("#btn_"+data3);

    for (let i = 0; i < target.length; i++) {
        if(target[i].classList.contains('d-none')){
            target[i].classList.remove('d-none')
            target1[i].classList.add('d-none')
            target2[i].classList.add('d-none')
            target3[i].classList.add('d-none')
        }
        
    }
    
    for (let i = 1; i < btn.length; i++) {
        if(btn[i].classList.contains('active') == false){
            btn[i].classList.add('active')
        }
        btn1[i].classList.remove('active')
        btn2[i].classList.remove('active')
        btn3[i].classList.remove('active')
        
    }

    for (let i = 0; i < input.length; i++) {
        input[i].checked = true;
        input1[i].checked = false;
        input2[i].checked = false;
        input3[i].checked = false;
    }
};

function filter_karyawan(table) {
    data = table.getAttribute('data-table')
    target = document.querySelectorAll("#list-"+data)
    
    switch (data) {
        case 'karyawan':
            data1 = 'peringatan'
            break;
        case 'peringatan':
            data1 = 'karyawan'
            break;
    
        default:
            break;
    }
    
    target1 = document.querySelectorAll("#list-"+data1)

    for (let i = 0; i < target.length; i++) {
        if(target[i].classList.contains('d-none')){
            target[i].classList.remove('d-none')
            target1[i].classList.add('d-none')
        }
        
    }
}

function profil(val) {
    data1 = val.getAttribute('data-id')

    switch (data1) {
        case 'biodata':
            data2 = 'karyawan'
            data3 = 'riwayat'
            data4 = 'akun'
            data5 = 'dokumen'
            data6 = 'sertifikat'
            break;
        case 'karyawan':
            data2 = 'biodata'
            data3 = 'riwayat'
            data4 = 'akun'
            data5 = 'dokumen'
            data6 = 'sertifikat'
            break;
        case 'riwayat':
            data2 = 'biodata'
            data3 = 'karyawan'
            data4 = 'akun'
            data5 = 'dokumen'
            data6 = 'sertifikat'
            break;
        case 'akun':
            data2 = 'biodata'
            data3 = 'karyawan'
            data4 = 'riwayat'
            data5 = 'dokumen'
            data6 = 'sertifikat'
            break;
        case 'dokumen':
            data2 = 'biodata'
            data3 = 'karyawan'
            data4 = 'riwayat'
            data5 = 'akun'
            data6 = 'sertifikat'
            break;
        case 'sertifikat':
            data2 = 'biodata'
            data3 = 'karyawan'
            data4 = 'riwayat'
            data5 = 'akun'
            data6 = 'dokumen'
            break;
    
        default:
            break;
    }
    // target1 = document.getElementById("data_"+data1)
    // target2 = document.getElementById("data_"+data2)
    // target3 = document.getElementById("data_"+data3)
    // target4 = document.getElementById("data_"+data4)
    // target5 = document.getElementById("data_"+data5)

    btn1 = document.getElementById("btn_"+data1);
    btn2 = document.getElementById("btn_"+data2);
    btn3 = document.getElementById("btn_"+data3);
    btn4 = document.getElementById("btn_"+data4);
    btn5 = document.getElementById("btn_"+data5);
    btn6 = document.getElementById("btn_"+data6);

    if(btn1.classList.contains('shadow-none')){
        btn1.classList.remove('shadow-none', 'text-dark');
        btn1.classList.add('btn-warning', 'bg-gradient-warning', 'shadow-md', 'active', 'text-white')

        btn2.classList.add('shadow-none', 'text-dark')
        btn2.classList.remove('btn-warning', 'bg-gradient-warning', 'shadow-md', 'active', 'text-white')
    
        btn3.classList.add('shadow-none', 'text-dark')
        btn3.classList.remove('btn-warning', 'bg-gradient-warning', 'shadow-md', 'active', 'text-white')
    
        btn4.classList.add('shadow-none', 'text-dark')
        btn4.classList.remove('btn-warning', 'bg-gradient-warning', 'shadow-md', 'active', 'text-white')

    
        btn5.classList.add('shadow-none', 'text-dark')
        btn5.classList.remove('btn-warning', 'bg-gradient-warning', 'shadow-md', 'active', 'text-white')
        
        btn6.classList.add('shadow-none', 'text-dark')
        btn6.classList.remove('btn-warning', 'bg-gradient-warning', 'shadow-md', 'active', 'text-white')
    }
};

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#blah')
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function ganti(jenis) {
    file = jenis.getAttribute('data-file');
    $('#foto_' + file).css('display', 'none');
    $('#ganti_' + file).css('display', 'none');
    $('#file_' + file).css('display', 'inline-block');
    $('#file_' + file).attr('type', 'file');
    $('#batal_' + file).css('display', 'inline-block');
}

function batal(jenis) {
    file = jenis.getAttribute('data-file');
    $('#foto_' + file).css('display', 'inline-block');
    $('#ganti_' + file).css('display', 'inline-block');
    $('#file_' + file).attr('type', 'text');
    $('#file_' + file).css('display', 'none');
    $('#batal_' + file).css('display', 'none');
}

function gantiRole(ganti) {
    role = ganti.value
    id = ganti.getAttribute('data-id')
    text = document.getElementById('foto_'+ganti.getAttribute('data-file'))
    if (role && id) {
        jQuery.ajax({
            url: '/updateRole/' + id + '/' + role,
            type: "get",
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    $('#session').html('<div class="alert alert-success alert-dismissible fade show text-dark" role="alert">' + data.success + '<button type="button" class="btn-close text-lg py-3 opacity-50" data-bs-dismiss="alert"aria-label="Close"><i class="fa-solid fa-xmark fs-4 text-dark"></i></button></div>');
                    batal(ganti);
                    text.innerHTML = data.role
                } else {
                    $('#session').html('<div class="alert alert-danger alert-dismissible fade show text-dark" role="alert">' + "Data gagal diupdate" + '<button type="button" class="btn-close text-lg py-3 opacity-50" data-bs-dismiss="alert"aria-label="Close"><i class="fa-solid fa-xmark fs-4 text-dark"></i></button></div>');
                }
            }
        });

    }
}


function getFileExtensions(filename) {
    return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
    // return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
}

function gantiMacamHadir(ganti) {
    hadir = parseInt(ganti.value)
    id = parseInt(ganti.getAttribute('data-id'))
    text = document.getElementById('foto_'+ganti.getAttribute('data-file'))
    // console.log(hadir,id,text);
    if (hadir && id) {
        jQuery.ajax({
            url: '/updateMacam_Hadir/' + id + '/' + hadir,
            type: 'get',
            dataType: 'json',
            success: function(data) {
                // console.log(data);
                if (data.success) {
                    $('#session').html('<div class="alert alert-success alert-dismissible fade show text-dark" role="alert">' + data.success + '<button type="button" class="btn-close text-lg py-3 opacity-50" data-bs-dismiss="alert"aria-label="Close"><i class="fa-solid fa-xmark fs-4 text-dark"></i></button></div>');
                    batal(ganti);
                    text.innerHTML = data.hadir
                } else {
                    $('#session').html('<div class="alert alert-danger alert-dismissible fade show text-dark" role="alert">' + "Data gagal diupdate" + '<button type="button" class="btn-close text-lg py-3 opacity-50" data-bs-dismiss="alert"aria-label="Close"><i class="fa-solid fa-xmark fs-4 text-dark"></i></button></div>');
                }
            }
        });

    }
}

function hapusPG(pg) {
    no = parseInt(pg.getAttribute('data-no'))
    document.getElementById('preview_'+no).remove()
    document.getElementById('pg_'+no).remove()
    document.getElementById('id_'+no).remove()
    document.getElementById('id_pilihan_'+no).remove()
    // document.getElementById('kode_jawaban_benar').remove(no)
    
    if (no >= 1) {
        no += 1;
    } else {
        no = 1;
    }
    // no -= 1;

    $(".d-none > #baru-pilihan:last > .input-group > input[name='text_pilihan[]']").attr('placeholder', 'Pilihan ' + no);
    $(".d-none > #baru-pilihan:last > .input-group > input[name='text_pilihan[]']").attr('id', 'text_' + no);
    $(".d-none > #baru-pilihan:last > .input-group > input[name='text_pilihan[]']").attr('data-no', no);
    $(".d-none > #baru-pilihan:last > .input-group > input[name='foto_pilihan[]']").attr('id', 'file_' + no);
    $(".d-none > #baru-pilihan:last > .input-group > input[name='foto_pilihan[]']").attr('data-no', no);
    $(".d-none > #baru-pilihan:last > .input-group > .btn-danger").attr('data-no', no);
    $(".d-none > #baru-pilihan:last > .input-group > .btn-warning").attr('id', 'ganti_'+no);
    $(".d-none > #baru-pilihan:last > .input-group > .btn-warning").attr('data-no', no);
    $(".d-none > #baru-pilihan:last > .input-group > .btn-secondary").attr('id', 'batal_'+no);
    $(".d-none > #baru-pilihan:last > .input-group > .btn-secondary").attr('data-no', no);
    $(".d-none > #baru-pilihan:last > .input-group > #no_pilihan").html(no);
    pg.parentNode.remove()
}

function fotoPG(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        no = input.getAttribute('data-no')
        reader.onload = function(e) {
            $('#preview_'+no)
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function gantiPG(jenis) {
    file = jenis.getAttribute('data-no');
    $('#text_' + file).css('display', 'none');
    $('#ganti_' + file).css('display', 'none');
    $('#foto_' + file).css('display', 'inline-block');
    $('#preview_' + file).css('display', 'inline-block');
    $('#file_' + file).css('display', 'inline-block');
    $('#batal_' + file).css('display', 'inline-block');
}
function batalPG(jenis) {
    file = jenis.getAttribute('data-no');
    $('#text_' + file).css('display', 'inline-block');
    $('#ganti_' + file).css('display', 'inline-block');
    $('#foto_' + file).css('display', 'none');
    $('#preview_' + file).css('display', 'none');
    $('#file_' + file).css('display', 'none');
    $('#batal_' + file).css('display', 'none');
}

function loading() {
    $('#loading').removeClass('d-none');
    let time = 5;
    setInterval(() => {
        time -= 1;
        if (time <= 0) {
            location.reload()
        }
    }, 1000);
}