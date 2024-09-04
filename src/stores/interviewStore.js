import { makeAutoObservable } from 'mobx';

class InterviewStore {
    type = '';
    cameraReady = false;
    micReady = false;
    stream = '';
    countdown = 5;
    currentStep = 1;
    highContrast = false;
    audioLevel = 0;
    allReady = false;
    buttonActive = false;
    mockQuestions = { commonQuestions: [], resumeQuestions: [] };  // mockQuestions 객체로 수정
    commonQuestions = [];  // commonQuestions를 별도로 저장
    resumeQuestions = [];  // resumeQuestions를 별도로 저장
    activeTab = 'common';

    constructor() {
        makeAutoObservable(this);
        if (typeof window !== 'undefined') {
            this.loadInterviewData(); // 페이지 로드 시 사용자 데이터를 복원 (클라이언트 환경에서만)
        }
    }
    
    // mockQuestions에서 commonQuestions와 resumeQuestions를 분리하여 설정하는 함수
    parseMockQuestions() {
        if (this.mockQuestions && typeof this.mockQuestions === 'object') {
            // mockQuestions가 객체이고 commonQuestions, resumeQuestions가 배열일 경우 데이터 분리
            this.commonQuestions = Array.isArray(this.mockQuestions.commonQuestions)
                ? this.mockQuestions.commonQuestions
                : [];
            this.resumeQuestions = Array.isArray(this.mockQuestions.resumeQuestions)
                ? this.mockQuestions.resumeQuestions
                : [];
        } else {
            // mockQuestions가 올바른 형식이 아닐 경우 빈 배열로 설정
            this.commonQuestions = [];
            this.resumeQuestions = [];
        }
    }

    // mockQuestions 설정
    setMockQuestions(mockQuestions) {
        if (mockQuestions && typeof mockQuestions === 'object') {
            this.mockQuestions = mockQuestions;
        } else {
            this.mockQuestions = { commonQuestions: [], resumeQuestions: [] };
        }

        console.log('스토어 Mock 질문들: ', mockQuestions);
        this.parseMockQuestions(); // mockQuestions 설정 후 바로 분리

        if (typeof window !== 'undefined') {
            localStorage.setItem('mockQuestions', JSON.stringify(mockQuestions)); // 로컬스토리지에 저장
        }
    }

    // 초기화 함수 추가
    initializeInterviewStore() {
        this.type = '';
        if (typeof window !== 'undefined') {
            localStorage.removeItem('type');
        }
    }

    setType(type) {
        this.type = type;
        console.log('스토어 인터뷰 타입: ', type);
        if (typeof window !== 'undefined') {
            localStorage.setItem('type', type);
        }
    }

    setCameraReady(cameraReady) {
        this.cameraReady = cameraReady;
        console.log('스토어 카메라준비: ', cameraReady);
        if (typeof window !== 'undefined') {
            localStorage.setItem('cameraReady', cameraReady);
        }
    }

    setMicReady(micReady) {
        this.micReady = micReady;
        console.log('스토어 마이크준비: ', micReady);
        if (typeof window !== 'undefined') {
            localStorage.setItem('micReady', micReady);
        }
    }

    setStream(stream) {
        this.stream = stream;
        console.log('스토어 스트림준비: ', stream);
        if (typeof window !== 'undefined') {
            localStorage.setItem('stream', stream);
        }
    }

    setCountdown(countdown) {
        this.countdown = countdown;
        console.log('스토어 카운트다운: ', countdown);
        if (typeof window !== 'undefined') {
            localStorage.setItem('countdown', countdown);
        }
    }

    setCurrentStep(currentStep) {
        this.currentStep = currentStep;
        console.log('스토어 현재스텝: ', currentStep);
        if (typeof window !== 'undefined') {
            localStorage.setItem('currentStep', currentStep);
        }
    }

    setHighContrast(highContrast) {
        this.highContrast = highContrast;
        console.log('스토어 하이컨트레스트: ', highContrast);
        if (typeof window !== 'undefined') {
            localStorage.setItem('highContrast', highContrast);
        }
    }

    setAudioLevel(audioLevel) {
        this.audioLevel = audioLevel;
    }

    setAllReady(allReady) {
        this.allReady = allReady;
        console.log('스토어 올 레디: ', allReady);
        if (typeof window !== 'undefined') {
            localStorage.setItem('allReady', allReady);
        }
    }

    setButtonActive(buttonActive) {
        this.buttonActive = buttonActive;
        console.log('스토어 버튼 엑티브: ', buttonActive);
        if (typeof window !== 'undefined') {
            localStorage.setItem('buttonActive', buttonActive);
        }
    }

    setActiveTab(activeTab) {
        this.activeTab = activeTab;
        console.log('스토어 엑티브 탭: ', activeTab);
        if (typeof window !== 'undefined') {
            localStorage.setItem('activeTab', activeTab);
        }
    }

    // 로컬 스토리지에서 데이터 로드
    loadInterviewData() {
        if (typeof window !== 'undefined') {
            this.type = localStorage.getItem('type') || '';
            this.cameraReady = localStorage.getItem('cameraReady') === 'true';
            this.micReady = localStorage.getItem('micReady') === 'true';
            this.stream = localStorage.getItem('stream') || '';
            this.countdown = parseInt(localStorage.getItem('countdown'), 10) || 5;
            this.currentStep = parseInt(localStorage.getItem('currentStep'), 10) || 1;
            this.highContrast = localStorage.getItem('highContrast') === 'true';
            this.allReady = localStorage.getItem('allReady') === 'true';
            this.buttonActive = localStorage.getItem('buttonActive') === 'true';
            
            const storedMockQuestions = localStorage.getItem('mockQuestions');
            this.mockQuestions = storedMockQuestions ? JSON.parse(storedMockQuestions) : { commonQuestions: [], resumeQuestions: [] };
            this.parseMockQuestions();  // mockQuestions가 로드되면 commonQuestions와 resumeQuestions를 분리
        }
    }
}

const interviewStore = new InterviewStore();
export default interviewStore;