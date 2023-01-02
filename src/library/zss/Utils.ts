export default abstract class Binary {
  public static base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  };

  public static arrayBufferToBase64(buffer: ArrayBuffer): string {
    var binary_string = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary_string += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary_string);
  }
}
