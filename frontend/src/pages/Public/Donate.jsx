import React, { useState } from "react";
import { HeartHandshake, ExternalLink, Heart } from "lucide-react";
import Button from "../../components/common/Button";
import { Input } from "../../components/common/FormField";
import useToast from "../../hooks/useToast";
import heroDogImg from "../../assets/dog.jpg";
import "./Donate.css";

const PRESET_AMOUNTS = [10, 25, 50, 100];

export default function Donate() {
  const [amount, setAmount] = useState(25);
  const [custom, setCustom] = useState("");
  const toast = useToast();

  const handleDonate = () => {
    const finalAmount = custom ? Number(custom) : amount;
    if (!finalAmount || finalAmount <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }
    // FR15: system shall NOT store payment card info — redirect to a
    // third-party payment gateway instead of collecting card details here.
    toast.info(`Redirecting you to our secure payment partner for $${finalAmount}…`);
  };

  return (
    <div className="section container donate">
      <div className="donate__card">
        <div className="donate__banner">
          <img
            src={heroDogImg}
            alt="Shelter puppies helped by donations"
            className="donate__banner-img"
          />
          <div className="donate__banner-overlay">
            <span className="donate__banner-chip">
              <Heart size={13} /> 100% Goes To Animal Care
            </span>
          </div>
        </div>

        <div className="donate__body">
          <div className="donate__icon">
            <HeartHandshake size={26} />
          </div>
          <h1>Support the shelter</h1>
          <p>
            Your donation directly funds nutritious food, lifesaving medical care, and cozy shelter
            for pets waiting for their forever families.
          </p>

          <div className="donate__amounts">
            {PRESET_AMOUNTS.map((a) => (
              <button
                key={a}
                className={`donate__amount ${amount === a && !custom ? "donate__amount--active" : ""}`}
                onClick={() => {
                  setAmount(a);
                  setCustom("");
                }}
              >
                ${a}
              </button>
            ))}
          </div>

          <Input
            name="custom"
            label="Or enter a custom amount"
            type="number"
            min="1"
            placeholder="e.g. 75"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />

          <Button variant="accent" size="lg" fullWidth icon={ExternalLink} onClick={handleDonate}>
            Continue to secure payment
          </Button>
        </div>
      </div>
    </div>
  );
}
