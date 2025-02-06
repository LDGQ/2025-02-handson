import React, {createContext, ReactNode, useContext, useState} from "react";


// Context の型定義
interface PopupContextType {
    isPopupOpen: boolean;
    openPopup: (message: string) => void;
    closePopup: () => void;
    popupMessage: string;
}

const PopupContext = createContext<PopupContextType>({
    isPopupOpen: false,
    openPopup: ()=> {},
    closePopup: ()=> {},
    popupMessage: ''
});

export const PopupProvider = ({children} : {children: ReactNode}) => {
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>("");

    // ポップアップを開く
    const openPopup = (message: string) => {
        setPopupMessage(message);
        setIsPopupOpen(true);
    };

    // ポップアップを閉じる
    const closePopup = () => {
        setIsPopupOpen(false);
        setPopupMessage("");
    };

    return (
        <PopupContext.Provider value={{ isPopupOpen, openPopup, closePopup, popupMessage }}>
            {children}
        </PopupContext.Provider>
    );
};

export const usePopupContext = () => useContext(PopupContext);
