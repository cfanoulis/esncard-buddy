"use client";
import { verifyCard } from "@/app/actions";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { ESNcard, ESNcardStatus } from "esncard";
import { useActionState, useState } from "react";

export default function Home() {
  const [verificationResult, verifyCardAction, pending] = useActionState(
    verifyCard,
    { status: "idle", message: "" },
  );

  const [cameraScanning, setCameraScanning] = useState(false);
  const [cardId, setCardId] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center p-18">
      <form action={verifyCardAction} className="flex flex-col gap-4 mb-4">
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
          <button
            disabled={pending}
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 mr-2"
          >
            Check &gt;
          </button>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400"
            disabled={pending}
            type="button"
            onClick={() => setCameraScanning((prev) => !prev)}
          >
            Toggle camera
          </button>
        </div>
      </form>
      {cameraScanning && (
        <Scanner
          styles={{
            container: {
              width: 400,
              height: 400,
            },
          }}
          onScan={([result]: IDetectedBarcode[]) => {
            setCardId(result.rawValue);
            setCameraScanning(false);
          }}
          paused={!cameraScanning}
          onError={(error) => console.error(error)}
          components={{
            finder: true,
            onOff: false,
            torch: false,
            zoom: false,
          }}
        />
      )}
      {verificationResult.status !== "idle" && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md">
          <h1 className="text-xl font-bold mb-2">Card Information</h1>
          <p className="mb-1">Status: {verificationResult.status}</p>
          {verificationResult.status === "active" && (
            <>
              <div className="mb-4">
                <p>Card ID: {(verificationResult as ESNcard).code || ""}</p>
                <p>
                  Expiration date:{" "}
                  {(
                    verificationResult as ESNcard
                  ).expirationDate.toDateString() || ""}
                </p>
                <p>
                  Issued by:{" "}
                  {`${
                    SectionCodeMapping[
                      (verificationResult as ESNcard)
                        .sectionCode as keyof typeof SectionCodeMapping
                    ]
                  } (${(verificationResult as ESNcard).sectionCode})`}
                </p>
              </div>
            </>
          )}
          {verificationResult.status === ESNcardStatus.AVAILABLE && (
            <>
              <p className="text-sm italic mb-4">
                Hint: This card has not been activated on esncard.org -
                activation is required to use online offers (&amp; this tool).{" "}
                <br /> You may accept this card based on the information within
                it, but we recommend asking the holder to activate it to ensure
                acceptance.
              </p>
            </>
          )}
          {verificationResult.status === "fail" && (
            <>
              <p className="text-sm italic mb-4">
                This card number is invalid or has been removed from the ESNcard
                system. <br /> Double-check the number or contact the issuing
                section on the card for more information.
              </p>
            </>
          )}

          {verificationResult.status !== "fail" && (
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400"
              disabled={pending}
              type="button"
              onClick={() => alert("Yippee!")}
            >
              10% off on menu items - Record redemption &gt;
            </button>
          )}
        </div>
      )}
    </main>
  );
}

const SectionCodeMapping = {
  "GR-THES-TEI": "ESN IHU",
  "GR-ATHE-ESN": "ESN Athens AUEB",
  "GR-ATHE-AUA": "ESN AUA Athens",
  "GR-THES-AUT": "ESN AUTH",
  "GR-KOMO-ESN": "ESN DUTH",
  "GR-ATHE-HAR": "ESN HARO",
  "GR-IOAN-ESN": "ESN Ioannina",
  "GR-ATHE-KAP": "ESN KAPA Athens",
  "GR-NTUA-ESN": "ESN NTUA Athens",
  "GR-ATHE-PAN": "ESN Panteio Athens",
  "GR-HERA-TEI": "ESN HMU",
  "GR-KOZA-TEI": "ESN Western Macedonia", //κάποτε ημανε τει και μ' αγαπούσανε πολύ
  "GR-CHAN-ESN": "ESN TUC",
  "GR-PIRA-ESN": "ESN UniPi",
  "GR-HERA-UOC": "ESN UOC",
  "GR-THES-ESN": "ESN UOM Thessaloniki",
  "GR-PATR-ESN": "ESN UOPA",
  "GR-UTHX-ESN": "ESN UTH",
  "GR-ATHE-TEI": "ESN West Attica",
  "GR-CORF-ESN": "ESN Ionian",
};
