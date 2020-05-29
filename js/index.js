
var map;
var markers = [];
var infoWindow;
function initMap() {
    var losAngeles = {
        lat: 34.063380,
        lng: -118.358080
    }
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 8,
        styles: [
            {elementType: 'geometry', stylers: [{color: '#241f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d999863'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            }
          ]
    });
    infoWindow = new google.maps.InfoWindow();
    procedures(stores)
   
}

function procedures(targetStore) {
    clearLocation()
    displayStores(targetStore)
    showStoresMarkers(targetStore)
    setOnClickListener()
}


function searchStores() {
    var foundStores = []
    var zipCope = document.getElementById("zip-code-input").value;
    if (zipCope) {
        stores.forEach(function (store) {
            var postal = store.address.postalCode.substring(0,5);
            if (postal == zipCope){
                foundStores.push(store)
            }
        });
    } else {
        foundStores = stores;
    }
    procedures(foundStores)
}

function clearLocation() {
    infoWindow.close()
    for (var i = 0; i< markers.length; i++){
        markers[i].setMap(null)
    }
    markers.length = 0
}
function setOnClickListener() {
    var storeElements = document.querySelectorAll(".store-container");
    storeElements.forEach(function(elem, index)  {
        elem.addEventListener("click", function() {
            google.maps.event.trigger(markers[index], "click");
        });
    });
}
function displayStores(filteredStores=stores) {
    var storesHtml = "";
    filteredStores.forEach(function(store, index){
        var address = store.addressLines;
        var phone = store.phoneNumber;
        storesHtml += `
        
        <div class="store-container">
            <div class="store-container-background">

                <div class="store-info-container">
                    <div class="store-address">
                        <span>${address[0]}</span>
                        <span>${address[1]}</span>
                    </div>
                    <div class="store-phone-number">${phone}</div>
                </div>
                <div class="store-number-container">
                    <div class="store-number">
                        ${index+1}
                    </div>
                </div>
            </div>
        </div>
    `
    });
    document.querySelector('.stores-list').innerHTML = storesHtml;
}


function showStoresMarkers(filteredStores) {
    var bounds = new google.maps.LatLngBounds();
    filteredStores.forEach(function(store, index){
        var latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude);
        console.log(latlng);
        var name = store.name;
        var address = store.addressLines[0];
        var phone = store.phoneNumber;
        var statusText = store.openStatusText;
        bounds.extend(latlng);
        createMarker(latlng, name, address, phone, statusText, index+ 1);
    })
    map.fitBounds(bounds);
}


function createMarker(latlng, name, address, phone, statusText, index) {

    var html = `
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}            
            </div>

            <div class="store-info-status">
                ${statusText}
            </div>

            <div class="store-info-address">
            
                <div class="circle">
                    <i class="fas fa-location-arrow"></i>    
                </div>
                <a href="https://www.google.com/maps/dir/?api=1&origin=Space+Needle+Seattle+WA&destination=${address}&travelmode=bicycling">
                    ${address}

                </a>
            </div>

            <div class="store-info-phone">
                <div class="circle">
                   <i class="fas fa-phone-alt"></i>

                </div>
               ${phone}
            </div>
        </div>
    `
      var iconBase ='http://maps.google.com/mapfiles/kml/pal2/icon38.png';
      var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      label: `${index}`,
      icon:iconBase
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
}







