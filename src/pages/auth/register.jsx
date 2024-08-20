import { useState } from 'react';
import Register from "../../components/auth/register";
import RegisterInput from "../../components/auth/registerInput";
import RegisterEnd from "../../components/auth/registerEnd";
import RegisterInputProfile from "../../components/auth/registerInputProfile";

const Index = () => {
    const [step, setStep] = useState(1);
    const [formObject, setFormObject] = useState({});

    const handleNextStep = (updatedData) => {
        // formObject를 업데이트하면서 다음 단계로 이동
        setFormObject(prevState => ({ ...prevState, ...updatedData }));
        setStep(step + 1);
    };

    const goBack = (updatedData = {}) => {
        // 이전 단계로 돌아갈 때도 formObject를 업데이트
        setFormObject(prevState => ({ ...prevState, ...updatedData }));
        setStep(step - 1);
    };

    const renderStep = () => {
        switch(step) {
            case 1:
                return <Register goToNext={() => setStep(2)} />;
            case 2:
                return (
                    <RegisterInput
                        formObject={formObject}
                        goToNext={handleNextStep}
                        goBack={goBack}  // goBack 함수 전달
                    />
                );
            case 3:
                return (
                    <RegisterInputProfile
                        formObject={formObject}
                        goToNext={handleNextStep}
                        goBack={() => goBack(formObject)}  // 현재 단계의 formObject를 유지하며 이전 단계로 이동
                    />
                );
            case 4:
                return (
                    <RegisterEnd
                        formObject={formObject}
                        goToNext={() => setStep(1)} // 회원가입 완료 후 처음 단계로 돌아가기
                    />
                );
            default:
                return <Register goToNext={() => setStep(2)} />;
        }
    };

    return (
        <div>
            {renderStep()}
        </div>
    );
};

export default Index;