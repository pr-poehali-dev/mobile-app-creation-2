interface QRCodeProps {
  value: string;
}

export default function QRCode({ value }: QRCodeProps) {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    value
  )}`;

  return (
    <div className="flex justify-center">
      <div className="bg-white p-4 rounded-xl shadow-md">
        <img
          src={qrCodeUrl}
          alt="QR Code"
          className="w-48 h-48"
        />
      </div>
    </div>
  );
}
