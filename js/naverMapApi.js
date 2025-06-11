// var HOME_PATH = window.HOME_PATH || '.';
// var position = new naver.maps.LatLng(35.8127097938299, 127.157156787256);

// var map = new naver.maps.Map('map', {
//     center: position,
//     zoom: 17,
//     scrollWheel: true, // 마우스 휠 줌 비활성화
//     pinchZoom: false, // 터치 기기 핀치 줌 비활성화
//     disableDoubleClickZoom: false, // 더블 클릭 줌 비활성화
//     zoomControl: true // 줌 컨트롤 버튼 숨김
// });


var map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(35.8127097938299, 127.157156787256),
    zoom: 17
});

var marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(35.8127097938299, 127.157156787256),
    map: map
});

// var size = new naver.maps.Size(350, 250),
//     sizeObject = {
//         width: 350,
//         height: 250
//     };

// map.setSize(sizeObject);

// var markerOptions = {
//     position: position.destinationPoint(90, 15),
//     map: map,
//     icon: {
//         url: HOME_PATH +'/images/mapitem/mapitemV2.png',
//         size: new naver.maps.Size(90, 90),
//         scaledSize: new naver.maps.Size(90, 90),
//         origin: new naver.maps.Point(0, 0),
//         anchor: new naver.maps.Point(52, 64)
//     }
// };

// var marker = new naver.maps.Marker(markerOptions);

// makeMarker(map, new naver.maps.LatLng(37.3618025, 127.1153248), 1);

// var marker = new naver.maps.Marker({
//     position: new naver.maps.LatLng(35.8127097938299, 127.157156787256),
//     map: map
// });
