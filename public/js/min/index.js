window.addEventListener('load', () => {
    if ("virtualKeyboard" in navigator) {
        navigator.virtualKeyboard.overlaysContent = true
    }

    var map = L.map('map').fitWorld();
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    map.locate({setView: true, maxZoom: 16});
    map.setView([41.387917, 2.169919], 16);

    function onLocationFound(e) {
        var radius = e.accuracy;

        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();

        L.circle(e.latlng, radius).addTo(map);
    }

    map.on('locationfound', onLocationFound);

    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationerror', onLocationError);
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
    let preference_btn = document.getElementById('btn_preference');
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
});

// Path: public/js/min/index.js