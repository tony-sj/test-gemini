document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('map-container');
    const tooltip = document.getElementById('tooltip');
    const loadingStatus = document.getElementById('loading-status');

    // 1. SVG 지도 데이터 (대한민국 시도)
    // viewBox는 지도의 전체 크기와 비율을 결정합니다.
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 500 850"); // 지도 모양에 맞는 비율 설정

    // 각 시도별 경로 데이터 (단순화된 버전)
    const provincesPaths = {
        "seoul": "M213 187 L222 183 L232 184 L236 193 L226 200 L216 197 Z",
        "busan": "M418 553 L428 545 L436 550 L431 560 L422 562 Z",
        "daegu": "M368 441 L380 435 L390 443 L382 452 Z",
        "incheon": "M160 195 L170 188 L185 192 L190 205 L170 210 Z",
        "gwangju": "M220 550 L230 545 L240 555 L230 560 Z",
        "daejeon": "M260 360 L275 355 L285 365 L270 370 Z",
        "ulsan": "M430 490 L440 485 L450 495 L440 500 Z",
        "gyeonggi": "M225 120 L290 125 L300 200 L240 220 L190 210 L180 150 Z",
        "gangwon": "M300 100 L420 110 L410 250 L310 240 Z",
        "chungbuk": "M280 250 L350 260 L340 380 L270 370 Z",
        "chungnam": "M190 280 L270 290 L260 400 L180 390 Z",
        "jeonbuk": "M200 420 L280 430 L270 520 L190 510 Z",
        "jeonnam": "M180 530 L270 540 L260 650 L170 640 Z",
//        "gyeongbuk": "M360 280 L460 290 L450 480 L350 470 Z",
        "gyeongbuk": "M360 280 L460 290 L450 480 L350 470 Z",
        "gyeongnam": "M300 500 L420 510 L410 600 L290 590 Z",
        "jeju": "M150 750 L200 755 L190 780 L140 775 Z"
    };

    for (const province in provincesPaths) {
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", provincesPaths[province]);
        path.setAttribute("class", "province");
        path.setAttribute("id", province);
        svg.appendChild(path);
    }
    mapContainer.appendChild(svg);

    // 2. 좌표 변환 함수 (위도/경도 -> SVG x/y)
    const mapWidth = 500;
    const mapHeight = 850;
    const minLon = 124.5, maxLon = 132.0;
    const minLat = 33.0, maxLat = 38.8;

    function project(lon, lat) {
        const x = (lon - minLon) / (maxLon - minLon) * mapWidth;
        const y = (maxLat - lat) / (maxLat - minLat) * mapHeight;
        return { x, y };
    }

    // 3. CSV 데이터 로드 및 시각화
    async function loadAndDrawData() {
        const response = await fetch('medical_facilities.csv');
        const csvText = await response.text();

        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data;
                loadingStatus.textContent = `총 ${data.length}개의 데이터를 불러왔습니다. 지도에 표시하는 중...`;

                // 한 번에 너무 많은 점을 그리면 브라우저가 느려지므로, 일부만 샘플링
                const sampleSize = 20000;
                const sampledData = data.length > sampleSize ? 
                    data.sort(() => 0.5 - Math.random()).slice(0, sampleSize) : data;

                const pointsGroup = document.createElementNS(svgNS, "g");
                pointsGroup.setAttribute("class", "data-points-group");

                sampledData.forEach(row => {
                    const lon = parseFloat(row['좌표(X)']);
                    const lat = parseFloat(row['좌표(Y)']);
                    const name = row['사업장명'];

                    if (!isNaN(lon) && !isNaN(lat) && name) {
                        const { x, y } = project(lon, lat);
                        
                        const circle = document.createElementNS(svgNS, "circle");
                        circle.setAttribute("cx", x);
                        circle.setAttribute("cy", y);
                        circle.setAttribute("r", "0.8"); // 점 크기
                        circle.setAttribute("class", "data-point");
                        
                        // 툴팁 이벤트 리스너 추가
                        circle.addEventListener('mouseover', (e) => {
                            tooltip.style.display = 'block';
                            tooltip.textContent = name;
                        });
                        circle.addEventListener('mousemove', (e) => {
                            tooltip.style.left = `${e.pageX + 10}px`;
                            tooltip.style.top = `${e.pageY + 10}px`;
                        });
                        circle.addEventListener('mouseout', () => {
                            tooltip.style.display = 'none';
                        });

                        pointsGroup.appendChild(circle);
                    }
                });
                svg.appendChild(pointsGroup);
                loadingStatus.textContent = `완료! (샘플 ${sampledData.length}개 표시)`;
            },
            error: (err) => {
                loadingStatus.textContent = `오류: ${err.message}. medical_facilities.csv 파일이 있는지 확인해주세요.`;
                loadingStatus.style.color = 'red';
            }
        });
    }

    loadAndDrawData();
});
