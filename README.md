# test-gemini
Gemini-CLI test

깃허브 코드스페이스에서 구글 제미나이 CLI를 사용하는 방법을 다시 알려드리겠습니다.
이전에 논의했던 내용에 따르면, 아이패드와 같은 환경에서 login with Google 방식은 네트워크 연결 문제로 인해 오류가 발생할 수 있습니다. 따라서 가장 안정적이고 권장되는 방법은 API Key를 환경 변수로 설정하는 것입니다.
1. Gemini CLI 설치
Codespaces 터미널을 열고 아래 명령어를 입력하여 Gemini-cli를 설치합니다.
npm install -g @google/gemini-cli

2. Gemini API 키 발급
 * Google AI Studio 웹사이트에 접속하여 로그인합니다.
 * 왼쪽 메뉴에서 **"Get API key"**를 클릭합니다.
 * **"Create API key in new project"**를 선택하여 새로운 키를 발급받고 복사해 둡니다.
3. GitHub Codespaces에 API 키 저장
API 키가 코드에 노출되지 않도록 GitHub의 비밀 변수(Secrets) 기능을 사용해야 합니다.
 * GitHub 웹사이트에서 Gemini-cli를 사용하려는 저장소로 이동합니다.
 * 상단 탭에서 **Settings**를 클릭합니다.
 * 왼쪽 사이드바에서 Secrets and variables > **Codespaces**를 선택합니다.
 * New repository secret 버튼을 클릭합니다.
 * Name에는 **GEMINI_API_KEY**라고 정확하게 입력합니다.
 * Secret에는 발급받은 API 키를 붙여넣고 저장합니다.
4. Codespace 재시작
API 키를 비밀 변수에 등록한 후에는 현재 열려 있는 Codespace를 완전히 닫았다가 다시 열어야 변경된 환경 변수가 적용됩니다. 이 과정은 매우 중요합니다.
5. Gemini CLI 사용
Codespace가 재시작되면 별도의 로그인 절차 없이 터미널에서 gemini 명령어를 바로 사용할 수 있습니다.
gemini

만약 이 방법으로도 문제가 해결되지 않는다면, Codespaces 터미널에서 echo $GEMINI_API_KEY 명령어를 입력하여 환경 변수가 제대로 설정되었는지 확인해 볼 수 있습니다.

export 명령어를 사용하여 GEMINI_API_KEY 환경 변수를 터미널에 일시적으로 설정하는 방법은 다음과 같습니다.
export GEMINI_API_KEY="[여기에 발급받은 API 키를 붙여넣기]"

이 명령어는 현재 열려 있는 터미널 세션에서만 유효하며, 터미널을 닫거나 새로운 세션을 열면 사라집니다. 따라서 영구적인 설정을 위해서는 GitHub Codespaces의 비밀 변수(Secrets) 기능을 사용하는 것이 가장 안전하고 권장되는 방법입니다.
