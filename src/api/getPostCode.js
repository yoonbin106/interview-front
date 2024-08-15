import { useEffect } from 'react';

export const useLoadDaumPostcodeScript = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
                document.body.removeChild(script);
            };
    }, []);
};

export const openPostcodePopup = (setPostcode, setAddress, setExtraAddress) => {
    new window.daum.Postcode({
        oncomplete: (data) => {
            let addr = ''; // 주소 변수
            let extraAddr = ''; // 참고항목 변수

            if (data.userSelectedType === 'R') {
                addr = data.roadAddress;
            } else {
                addr = data.jibunAddress;
            }

            if (data.userSelectedType === 'R') {
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')';
                }
            }
            setPostcode(data.zonecode);
            setAddress(addr);
            setExtraAddress(extraAddr);
        }
    }).open();
};