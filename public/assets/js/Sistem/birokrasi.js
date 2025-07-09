$(document).ready(function() {
    $('input[name="status"]').change(function() {
        status = this.value;
        divisi = parseInt(this.getAttribute('data-divisi'))
        id_karyawan = parseInt(this.getAttribute('data-id_karyawan'))
        if (status && divisi && id_karyawan) {
            $('#loading').removeClass('d-none');
            jQuery.ajax({
                url: '/updateBirokrasi/' + id_karyawan + '/' + divisi + '/' + status,
                type: 'get',
                dataType: 'json',
                success: function(data) {
                    // console.log(data);
                    $('#loading').addClass('d-none');
                    if (data.success) {
                        $('#session').html(
                            '<div class="alert alert-success alert-dismissible fade show text-dark" role="alert">' +
                            data.success +
                            '<button type="button" class="btn-close text-lg py-3 opacity-50" data-bs-dismiss="alert"aria-label="Close"><i class="fa-solid fa-xmark fs-4 text-dark"></i></button></div>'
                        );

                    } else {
                        $('#session').html(
                            '<div class="alert alert-danger alert-dismissible fade show text-dark" role="alert">' +
                            "Data gagal diupdate" +
                            '<button type="button" class="btn-close text-lg py-3 opacity-50" data-bs-dismiss="alert"aria-label="Close"><i class="fa-solid fa-xmark fs-4 text-dark"></i></button></div>'
                        );
                    }
                }
            });
        }
    })
})
