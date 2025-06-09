var HOME_PATH = window.HOME_PATH || '.';
var position = new naver.maps.LatLng(35.8127097938299, 127.157156787256);

var map = new naver.maps.Map('map', {
    center: position,
    zoom: 17
});

var markerOptions = {
    position: position.destinationPoint(90, 15),
    map: map,
    icon: {
        url: HOME_PATH +'/images/mapitem/mapitemV1.png',
        size: new naver.maps.Size(50, 52),
        origin: new naver.maps.Point(0, 0),
        anchor: new naver.maps.Point(25, 26)
    }
};

var marker = new naver.maps.Marker(markerOptions);