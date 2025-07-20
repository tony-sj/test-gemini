document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const drugInput = document.getElementById('drug-input');
    const resultContainer = document.getElementById('result-container');
    const loadingIndicator = document.getElementById('loading-indicator');

    const searchDrug = async () => {
        const drugName = drugInput.value.trim();
        if (!drugName) {
            alert('약 이름을 입력해주세요.');
            return;
        }

        // --- 중요 ---
        // 실제 사용 시, 공공데이터포털에서 발급받은 본인의 서비스 키로 교체해야 합니다.
        const serviceKey = 'YOUR_SERVICE_KEY_HERE'; 
        const url = `http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList?serviceKey=${serviceKey}&itemName=${drugName}&type=xml`;

        loadingIndicator.style.display = 'block';
        resultContainer.innerHTML = '';

        try {
            // CORS 문제를 우회하기 위한 프록시 URL
            const proxyUrl = `https://cors-anywhere.herokuapp.com/`;
            const response = await fetch(proxyUrl + url);
            
            if (!response.ok) {
                throw new Error(`HTTP 오류! 상태: ${response.status}`);
            }

            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "application/xml");
            
            const items = xmlDoc.getElementsByTagName('item');
            
            if (items.length === 0) {
                resultContainer.innerHTML = '<p>검색 결과가 없습니다. 약 이름을 다시 확인해주세요.</p>';
                return;
            }

            let html = '';
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const itemName = item.getElementsByTagName('itemName')[0]?.textContent || '정보 없음';
                const entpName = item.getElementsByTagName('entpName')[0]?.textContent || '정보 없음';
                const efcyQesitm = item.getElementsByTagName('efcyQesitm')[0]?.textContent || '정보 없음';
                const useMethodQesitm = item.getElementsByTagName('useMethodQesitm')[0]?.textContent || '정보 없음';
                const atpnWarnQesitm = item.getElementsByTagName('atpnWarnQesitm')[0]?.textContent || '정보 없음';
                const atpnQesitm = item.getElementsByTagName('atpnQesitm')[0]?.textContent || '정보 없음';
                const intrcQesitm = item.getElementsByTagName('intrcQesitm')[0]?.textContent || '정보 없음';
                const seQesitm = item.getElementsByTagName('seQesitm')[0]?.textContent || '정보 없음';
                const depositMethodQesitm = item.getElementsByTagName('depositMethodQesitm')[0]?.textContent || '정보 없음';

                html += `
                    <div class="drug-info">
                        <h2>${itemName} (제조사: ${entpName})</h2>
                        <h3>효능</h3>
                        <p>${efcyQesitm.replace(/\\n/g, '<br>')}</p>
                        <h3>사용법</h3>
                        <p>${useMethodQesitm.replace(/\\n/g, '<br>')}</p>
                        <h3>주의사항 경고</h3>
                        <p>${atpnWarnQesitm.replace(/\\n/g, '<br>')}</p>
                        <h3>주의사항</h3>
                        <p>${atpnQesitm.replace(/\\n/g, '<br>')}</p>
                        <h3>상호작용</h3>
                        <p>${intrcQesitm.replace(/\\n/g, '<br>')}</p>
                        <h3>부작용</h3>
                        <p>${seQesitm.replace(/\\n/g, '<br>')}</p>
                        <h3>보관법</h3>
                        <p>${depositMethodQesitm.replace(/\\n/g, '<br>')}</p>
                    </div>
                `;
            }
            resultContainer.innerHTML = html;

        } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
            resultContainer.innerHTML = `<p>정보를 불러오는 데 실패했습니다. (오류: ${error.message})<br>브라우저에서 API를 직접 호출할 때 발생하는 CORS 정책 문제일 수 있습니다. 이 예제는 프록시를 통해 우회하고 있습니다.</p>`;
        } finally {
            loadingIndicator.style.display = 'none';
        }
    };

    searchButton.addEventListener('click', searchDrug);
    drugInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchDrug();
        }
    });
});