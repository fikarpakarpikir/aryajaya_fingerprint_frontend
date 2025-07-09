
function getLocation(data_id) {
    loading  = document.getElementById('loading'+data_id.getAttribute('data-id'));
    loading.classList.remove('d-none');
    if (navigator.geolocation) {
        // navigator.geolocation.getCurrentPosition(showPosition);
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 20000
        };
        navigator.geolocation.getCurrentPosition(function(position) {

            var id = data_id.getAttribute('data-id');

            var waktu_awal = document.getElementById("waktu_awal" + id);
            var waktu_akhir = document.getElementById("waktu_akhir" + id);
            var text_waktu_awal = document.getElementById("text_waktu_awal" + id);
            var text_waktu_akhir = document.getElementById("text_waktu_akhir" + id);
            var m = new Date();
            var dateString =
                m.getFullYear() + "-" +
                ("0" + (m.getMonth() + 1)).slice(-2) + "-" +
                ("0" + m.getDate()).slice(-2) + "T" +
                ("0" + m.getHours()).slice(-2) + ":" +
                ("0" + m.getMinutes()).slice(-2);
            const targetWaktu = waktu_awal.value;
            const time_options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                timeZone: 'Asia/Jakarta',
                timeZoneName: 'short'
            };
            if (targetWaktu == '') {
                waktu_awal.value = dateString;
                text_waktu_awal.innerHTML = m.toLocaleDateString('id-ID', time_options);
                var long = document.getElementById("lokasi_longitude_awal" + id);
                var lat = document.getElementById("lokasi_latitude_awal" + id);
                targetMap = 'OLmap_awal' + id;
                var x = document.getElementById("demo_awal"+id);
            } else {
                waktu_akhir.value = dateString;
                text_waktu_akhir.innerHTML = m.toLocaleDateString('id-ID', time_options);
                var long = document.getElementById("lokasi_longitude_akhir" + id);
                var lat = document.getElementById("lokasi_latitude_akhir" + id);
                targetMap = 'OLmap_akhir' + id;
                var x = document.getElementById("demo_akhir"+id);
            }

            // console.log(targetWaktu == '', long, lat, targetMap, x);
            long.value = position.coords.longitude;
            lat.value = position.coords.latitude;
            document.getElementById(targetMap).classList.remove('d-none')
            const map = new ol.Map({
                view: new ol.View({
                    center: ol.proj.fromLonLat([position.coords.longitude, position.coords
                        .latitude
                    ]),
                    zoom: 15,
                }),
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.TileJSON({
                            url: 'https://api.maptiler.com/maps/basic-v2/tiles.json?key=2ibJ24OqxtTPt4wPHixM',
                            tileSize: 512,
                        })
                    }),
                ],
                target: targetMap,
            });

            const marker = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [
                        new ol.Feature({
                            geometry: new ol.geom.Point(
                                ol.proj.fromLonLat([position.coords.longitude,
                                    position.coords
                                    .latitude
                                ])
                            )
                        })
                    ],
                    style: new ol.style.Style({
                        image: new ol.style.Icon({
                            src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
                            anchor: [0.5, 1]
                        })
                    })
                })
            })

            map.addLayer(marker);

        }, function(error) {
            switch (error.code) {
                case 1:
                    x.innerHTML = "User denied the request";
                    break;
                case error.PERMISSION_DENIED:
                    x.innerHTML = "User denied the request";
                    break;
                case error.POSITION_UNAVAILABLE:
                    x.innerHTML = "Informasi lokasi";
                    break;
                case error.TIMEOUT:
                    x.innerHTML = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    x.innerHTML = "An unknown error occurred."
                    break;

                default:
                    break;
            }
            alert('cek deny');
            console.log(error);
        }, options);

    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
    loading.classList.add('d-none');

    // target(id);
}

function showPosition(id) {
    data = id.getAttribute('data-id');
    var long_awal = document.getElementById("lokasi_longitude_awal" + data);
    var lat_awal = document.getElementById("lokasi_latitude_awal" + data);
    var map_awal = 'OLmap_awal' + data
    var long_akhir = document.getElementById("lokasi_longitude_akhir" + data);
    var lat_akhir = document.getElementById("lokasi_latitude_akhir" + data);
    var map_akhir = 'OLmap_akhir' + data
    document.getElementById('OLmap_awal' + data).classList.remove('d-none')
    document.getElementById('OLmap_akhir' + data).classList.remove('d-none')
    
    map(long_awal.value, lat_awal.value, map_awal);
    map(long_akhir.value, lat_akhir.value, map_akhir);
}

function workPosition(data) {
    // console.log(data);
    loading  = document.getElementById('loading');
    loading.classList.remove('d-none');
    var data_map = data.getAttribute('data-map');
    var long_awal = data.getAttribute('data-long-mulai');
    var lat_awal = data.getAttribute('data-lat-mulai');
    var map_awal = 'OLmap_awal' + data_map
    var long_akhir = data.getAttribute('data-long-selesai');
    var lat_akhir = data.getAttribute('data-long-selesai');
    var map_akhir = 'OLmap_akhir' + data_map
    document.getElementById('OLmap_awal' + data_map).classList.remove('d-none')
    document.getElementById('OLmap_akhir' + data_map).classList.remove('d-none')
    
    map(long_awal, lat_awal, map_awal);
    map(long_akhir, lat_akhir, map_akhir);
    loading.classList.add('d-none');
}

function map(long, lat, targetMap) {
    const map = new ol.Map({
        view: new ol.View({
            center: ol.proj.fromLonLat([long, lat]),
            zoom: 15,
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.TileJSON({
                    url: 'https://api.maptiler.com/maps/basic-v2/tiles.json?key=2ibJ24OqxtTPt4wPHixM',
                    tileSize: 512,

                })
            }),
        ],
        target: targetMap,
    });

    const marker = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Point(
                        ol.proj.fromLonLat([long, lat])
                    )
                })
            ],
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
                    anchor: [0.5, 1]
                })
            })
        })
    })

    map.addLayer(marker)
}

function alasan(params) {
    answer = params.getAttribute('data-answer')
    id = params.getAttribute('data-id')
    text = document.getElementById('text_alasan' + id)
    target = document.getElementById('alasan' + id)
    jawaban_sementara = target.value
    if (answer == '11') {
        text.removeAttribute('readonly')
        text.setAttribute('required', 'true')
        target.classList.remove('d-none')
        // target.value == '' ? target.value = jawaban_sementara : target.value = ''
        target.focus()
    } else if (answer == '10') {
        target.classList.add('d-none')
        text.removeAttribute('required')
        text.setAttribute('readonly', 'true')
        text.setAttribute('onfocus', 'true')
    }
    console.log(answer, id, jawaban_sementara, target.value);
}