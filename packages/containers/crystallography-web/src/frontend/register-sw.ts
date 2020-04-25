import { Workbox } from "workbox-window";

export function registerSW() {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) {
        return;
    }
    const wb = new Workbox("service-worker.js");
    wb.addEventListener("installed", (event) => {
        if (event.isUpdate) {
            if (confirm(`New Application version is available!. Click OK to update`)) {
              window.location.reload();
            }
        }
    });
    wb.register();
}
