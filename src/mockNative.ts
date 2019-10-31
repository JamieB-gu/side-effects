declare global {
    interface Window {
        nativeParcel: (message: string) => void,
    }
}

// Mock a native parcel
setTimeout(() => {
    window.nativeParcel('Hello from the native layer!');
}, 3000);

export {};
