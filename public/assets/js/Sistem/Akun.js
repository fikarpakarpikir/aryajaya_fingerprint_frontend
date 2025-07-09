function updateIDKaryawan(ganti) {
    akun = ganti.value
    id = ganti.getAttribute('data-id')
    db = ganti.getAttribute('data-database')
    text = document.getElementById('foto_'+ganti.getAttribute('data-file'))
    // console.log(akun,id,text, db);
    if (akun && id && db) {
        jQuery.ajax({
            url: '/Sys/updateIDKaryawan/'+ db +'/' + id + '/' + akun,
            type: 'get',
            dataType: 'json',
            success: function(data) {
                // console.log(data);
                if (data.success) {
                    $('#session').html('<div class="alert alert-success alert-dismissible fade show text-dark" role="alert">' + data.success + '<button type="button" class="btn-close text-lg py-3 opacity-50" data-bs-dismiss="alert"aria-label="Close"><i class="fa-solid fa-xmark fs-4 text-dark"></i></button></div>');
                    batal(ganti);
                    text.innerHTML = data.akun
                } else {
                    $('#session').html('<div class="alert alert-danger alert-dismissible fade show text-dark" role="alert">' + "Data gagal diupdate" + '<button type="button" class="btn-close text-lg py-3 opacity-50" data-bs-dismiss="alert"aria-label="Close"><i class="fa-solid fa-xmark fs-4 text-dark"></i></button></div>');
                }
            }
        });

    }
}