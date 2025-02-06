import {usePopupContext} from "@/app/context/PopupContext";

export default function Popup() {
    const { isPopupOpen, closePopup, popupMessage } = usePopupContext();

    if (!isPopupOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <p className="text-lg font-semibold">{popupMessage}</p>
                <button
                    onClick={closePopup}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                    閉じる
                </button>
            </div>
        </div>
    );
}