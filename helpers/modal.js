import { v4 as uuidv4 } from 'uuid';

const Modal = () => {
    const id = uuidv4();

    return {
        Create: function (html) {
            const open = html?.open || "Open Modal";
            const shown = html?.shown || false;
            const btnStyles = html?.styles || "";

            return (
                <>  
                    <label htmlFor={id} className={`btn ${btnStyles}`}>{open || "open modal"}</label>
                    <input type="checkbox" id={id} className="modal-toggle" defaultChecked={shown} />
                
                    <label htmlFor={id} className="modal cursor-pointer">
                        <label className="modal-box relative" htmlFor="">
                            {html?.children || "Click anywhere to close"}
                        </label>
                    </label>
                </>
            )
        },
        Show: function () {
            if (!document) return;

            const modal = document.getElementById(id);
            if (!modal) return;

            modal.checked = true;
            modal.dispatchEvent(new Event("change"));
        },
        Hide: function () {
            if (!document) return;

            const modal = document.getElementById(id);
            if (!modal) return;

            modal.checked = false;
            modal.dispatchEvent(new Event("change"));
        }
    }
}

export { Modal };