window.addEventListener('load', () => {
    let CURRENT_LOCATION;
    if ("virtualKeyboard" in navigator) {
        navigator.virtualKeyboard.overlaysContent = true
    }

    var map = L.map('map').fitWorld();
    let TILESLAYER_DATA = {
        url: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 'https://{s}.tile.osm.org/{z}/{x}/{y}.png', 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'],
        defaultIndex: (localStorage.getItem('layerMap')) ? localStorage.getItem('layerMap') : 0,
    }
    L.tileLayer(TILESLAYER_DATA.url[TILESLAYER_DATA.defaultIndex], {
        maxZoom: 19,
        attribution: '©'
    }).addTo(map);

    map.locate({setView: true, maxZoom: 16});

    function onLocationFound(e) {
        // L.marker(e.latlng).addTo(map).bindPopup("You are here").openPopup();
        L.circle(e.latlng, {
            color: 'red',
            fillColor: 'red',
            fillOpacity: 1,
            radius: 5
        }).addTo(map);

        CURRENT_LOCATION = e.latlng;
    }

    map.on('locationfound', onLocationFound);

    function onLocationError(e) {
        map.setView([39.4636864, -0.3637378], 14);
    }

    map.on('locationerror', onLocationError);
    // ====================
    // Search Data
    let search_data_inputDOM = document.getElementById('search-data');
    let search_dataDOM = document.querySelector('.search_data');
    let search_data_listDOM = search_dataDOM.querySelector('.data_content_list');

    const close_search_tab = () => {
        search_dataDOM.classList.remove('active');
        search_data_inputDOM.value = '';
        search_data_listDOM.innerHTML = '';
    }

    search_data_inputDOM.addEventListener('keyup', () =>{
        if(search_data_inputDOM.value.length == 0){
            close_search_tab();
        }else{

            fetch('/api/search/'+search_data_inputDOM.value, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                search_dataDOM.classList.add('active');
                search_data_listDOM.innerHTML = '';

                data.forEach(elements => {
                    elements.forEach(element => {
                        search_data_listDOM.innerHTML += `
                            <div class="data_content border-radius drop-shadow">
                                <span>${element.Name}</span>
                            </div>
                        `;
                    });   
                }); 
                
                console.log(JSON.stringify(data, null, 2));
            });
        }
    });
    let ROUTE;
    // ====================
    let new_routeDATA = {
        active: true,
        scrollTop: true,
        enableScroll: false,
        posY: 0,
    }
    let new_routeDOM = document.getElementById('new_route');
    let new_routeLineDom = new_routeDOM.querySelector('.route_line');
    const new_route_windowHeight = (window.innerHeight * 0.15 || new_routeDOM.getBoundingClientRect().top);
    // drag and move mobile

    // ====================
    let touchFnc = {
        touchStart: (e, el, data) => {
            // close transition
            el.style.transition = 'none';

            // save y position and save it into new_routeDATA.posY
            data.posY = e.touches[0].clientY;
        },
        touchMove: (e, el) => {
            e.preventDefault();

            let touch = e.touches[0];
            if(touch.pageY > new_route_windowHeight) {
                el.style.top = (touch.clientY - 25) + 'px';
            }
        },
        touchEnd: (e, el, data, disable=false) => {
            // open transition
            el.style.transition = 'top 0.3s ease-out';

            e.preventDefault();
            let touch = e.changedTouches[0];

            if(Math.abs(touch.clientY - data.posY) > 50) {
                if(data.active && touch.clientY > data.posY) {
                    el.style.top = (!disable) ? window.innerHeight * 0.85 + 'px' : window.innerHeight + 'px';
                    // new_routeDATA.enableScroll = true;
                }else{
                    el.style.top = window.innerHeight * 0.15 + 'px';
                }
                data.active = !data.active;
            }else{
                if(data.active) {
                    el.style.top = window.innerHeight * 0.15 + 'px';
                }else{
                    el.style.top = window.innerHeight * 0.85 + 'px';
                }
            }
        }
    }


    new_routeLineDom.addEventListener('touchstart', e => touchFnc.touchStart(e, new_routeDOM, new_routeDATA));
    new_routeLineDom.addEventListener('touchmove', e => touchFnc.touchMove(e, new_routeDOM));
    new_routeLineDom.addEventListener('touchend', e => touchFnc.touchEnd(e, new_routeDOM, new_routeDATA, false));
    // ====================
    let new_routeSearchDATA = {
        active: true,
        scrollTop: true,
        enableScroll: false,
        posY: 0,
    }
    let new_routeSearchDOM = document.getElementById('new_route_search');
    let new_routeSearchLineDom = new_routeSearchDOM.querySelector('.route_line');

    new_routeSearchLineDom.addEventListener('touchstart', e => touchFnc.touchStart(e, new_routeSearchDOM, new_routeSearchDATA));
    new_routeSearchLineDom.addEventListener('touchmove', e => touchFnc.touchMove(e, new_routeSearchDOM));
    new_routeSearchLineDom.addEventListener('touchend', e => touchFnc.touchEnd(e, new_routeSearchDOM, new_routeSearchDATA, true));

    // ====================
    // Event actions
    //
    let new_route_btn = document.getElementById('btn_new_route');

    let preference_back_btn = document.getElementById('preference_back_btn');
    let preference_btn = document.getElementById('btn_preference');

    let add_favourite_back_btn = document.getElementById('add_favourite_back_btn');
    let add_favourite_btn = document.getElementById('btn_add_favourite');

    // Layer
    let preferenceDOM = document.getElementById('preference');
    let add_favouriteDOM = document.getElementById('add_favourite');

    new_route_btn.addEventListener('click', e => {
        // open trasition
        new_routeSearchDOM.style.transition = 'top 0.3s ease-in-out';

        e.preventDefault();
        new_routeSearchDOM.style.top = window.innerHeight * 0.15 + 'px';
    });

    preference_btn.addEventListener('click', e => {
        e.preventDefault();
        preferenceDOM.classList.add('active');
    });
    add_favourite_btn.addEventListener('click', e => {
        e.preventDefault();
        add_favouriteDOM.classList.add('active');
    });

    // Back btn
    preference_back_btn.addEventListener('click', e => {
        e.preventDefault();
        preferenceDOM.classList.remove('active');
    });
    add_favourite_back_btn.addEventListener('click', e => {
        e.preventDefault();
        add_favouriteDOM.classList.remove('active');
    });

    //! Prototipe use, remove it and change it to your own
    const createRandomRoute = () => {
        // Clear Map
        if(ROUTE){
            ROUTE.spliceWaypoints(0, 5);
        }

        fetch('/api/random', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            ROUTE = L.Routing.control({
                waypoints: [
                    CURRENT_LOCATION,
                    L.latLng(res[0].la,res[0].lo),
                    L.latLng(res[1].la,res[1].lo),
                    L.latLng(res[2].la,res[2].lo)
                ],
                routeWhileDragging: false,
                // router: L.Routing.graphHopper('e197d1a4-153c-48d4-bfa4-422518e288e6	')
                serviceUrl: 'https://router.project-osrm.org/route/v1',
            }).addTo(map);


            console.log(JSON.stringify(res, null, 2));
            document.getElementById('return-data').textContent = JSON.stringify(res, null, 2);
        });
    };

    let create_routeDOM = document.getElementById('create_route');
    create_routeDOM.addEventListener('click', e => {
        close_search_tab();

        e.preventDefault();
        new_routeDOM.style.transition = 'top 0.5s ease-in-out';
        new_routeSearchDOM.style.transition = 'top 0.5s ease-in-out';

        new_routeSearchDOM.style.top = window.innerHeight + 'px';
        new_routeDOM.style.top = window.innerHeight * 0.15 + 'px';

        // Open route extra info
        document.querySelectorAll('.active-route').forEach(el => el.classList.add('active'));

        // Prototipe use
        createRandomRoute();
    });

    let return_homeDOM = document.getElementById('return-home');
    return_homeDOM.addEventListener('click', e => {
        e.preventDefault();
        new_routeDOM.style.transition = 'top 0.5s ease-in-out';
        new_routeDOM.style.top = window.innerHeight + 'px';

        // Close route extra info
        document.querySelectorAll('.active-route').forEach(el => el.classList.remove('active'));

        ROUTE.spliceWaypoints(0, 5);

        map.locate({setView: true, maxZoom: 16});
    });

    let locate_user = document.getElementById('locate-user');
    locate_user.addEventListener('click', e => {
        e.preventDefault();
        map.locate({setView: true, maxZoom: 16});
    });

    let repeat_route = document.getElementById('repeat-route');
    repeat_route.addEventListener('click', e => {
        e.preventDefault();
        createRandomRoute();
    });

    let map_layer_arr = document.querySelectorAll('.map-layer');
    map_layer_arr.forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault();
            TILESLAYER_DATA.defaultIndex = el.getAttribute('data-layer');

            localStorage.setItem('layerMap', TILESLAYER_DATA.defaultIndex);

            L.tileLayer(TILESLAYER_DATA.url[TILESLAYER_DATA.defaultIndex], {
                maxZoom: 19,
                attribution: '©'
            }).addTo(map);
        }
    )});
});

// Path: public/js/min/index.js