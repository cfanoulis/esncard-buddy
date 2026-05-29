"use client";
import { verifyCard } from "@/app/actions";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useActionState, useState } from "react";

export default function Home() {
  const [verificationResult, verifyCardAction, pending] = useActionState(
    verifyCard,
    { status: "idle", message: "" },
  );

  const [cameraScanning, setCameraScanning] = useState(false);
  const [cardId, setCardId] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-18">
      <form action={verifyCardAction} className="flex flex-col gap-4">
        <label htmlFor="cardid">ESNcard number:</label>
        <input
          type="text"
          id="cardid"
          name="cardid"
          value={cardId}
          onChange={(e) => setCardId(e.target.value)}
          className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div>
          <button disabled={pending} type="submit">
            Check &gt;
          </button>
          <button
            disabled={pending}
            type="button"
            onClick={() => setCameraScanning((prev) => !prev)}
          >
            Toggle camera
          </button>
        </div>
      </form>
      {verificationResult.status !== "idle" && (
        <div>{JSON.stringify(verificationResult)}</div>
      )}
      {cameraScanning && (
        <Scanner
          onScan={([result]: IDetectedBarcode[]) => {
            setCardId(result.rawValue);
            setCameraScanning(false);
          }}
          paused={!cameraScanning}
          onError={(error) => console.error(error)}
        />
      )}
    </main>
  );
}
