declare global {
    interface Window {
        webkit: {
            messageHandlers: {
                webviewParcel: {
                    postMessage(message: string): void,
                },
            }
        }
    }
}

window.webkit = {
    messageHandlers: {
        webviewParcel: {
            postMessage: (message: string) => console.log(`Native layer received parcel: ${message}`),
        }
    }
};

export {};
