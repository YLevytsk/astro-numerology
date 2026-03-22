import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { axiosAPI } from "../../redux/auth/operations.js";
import { selectIsLoggedIn } from "../../redux/auth/selectors.js";
import styles from "./CompatibilityPage.module.css";

const SERVICE = {
  id: "compatibility",
  title: "Compatibility by Birth Date",
  price: "£25",
};
const MAX_YEAR = 2026;
const MIN_YEAR = 1900;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const YEARS = Array.from(
  { length: MAX_YEAR - MIN_YEAR + 1 },
  (_, i) => String(MAX_YEAR - i)
);

export default function CompatibilityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [birthData, setBirthData] = useState({
    first: { day: "", month: "", year: "" },
    second: { day: "", month: "", year: "" },
  });
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "+44",
    phone: "",
  });
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const formRef = useRef(null);

  const isBirthComplete = Boolean(
    birthData.first.day &&
      birthData.first.month &&
      birthData.first.year &&
      birthData.second.day &&
      birthData.second.month &&
      birthData.second.year
  );

  const handleBirthChange = (person, field) => (e) => {
    const { value } = e.target;
    setBirthData((prev) => ({
      ...prev,
      [person]: {
        ...prev[person],
        [field]: value,
      },
    }));
  };

  const openOrder = () => {
    if (!isBirthComplete) return;
    if (!isLoggedIn) {
      toast.error("Compatibility consultations are available only to authorized users.");
      navigate("/login");
      return;
    }
    setIsOrderOpen(true);
    if (formRef.current) {
      formRef.current.focus();
    }
  };

  const closeOrder = () => {
    setIsOrderOpen(false);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      closeOrder();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayPal = () => {
    if (!isLoggedIn) {
      toast.error("Compatibility consultations are available only to authorized users.");
      navigate("/login");
      return;
    }
    if (!formState.email) {
      toast.error("Enter email before paying");
      return;
    }
    if (!formState.firstName || !formState.lastName || !formState.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(String(SERVICE.price).replace(/[^\d.]/g, "")) || 0;
    const returnUrl = `${window.location.origin}/numerology/compatibility?paypalStatus=return`;
    const cancelUrl = `${window.location.origin}/numerology/compatibility?paypalStatus=cancel`;

    setIsCreatingOrder(true);
    axiosAPI
      .post("/paypal/orders", {
        amount,
        currency: "GBP",
        description: SERVICE.title,
        consultationId: SERVICE.id,
        customerEmail: formState.email,
        returnUrl,
        cancelUrl,
      })
      .then((res) => {
        const approveUrl = res.data?.data?.approveUrl;
        if (!approveUrl) {
          throw new Error("PayPal approveUrl missing");
        }
        window.location.href = approveUrl;
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          toast.error("Compatibility consultations are available only to authorized users.");
          navigate("/login");
          return;
        }
        const message =
          err?.response?.data?.message || err?.message || "Failed to create PayPal order";
        toast.error(message);
      })
      .finally(() => setIsCreatingOrder(false));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("paypalStatus");
    const orderId = params.get("orderId") || params.get("token");

    if (status === "cancel") {
      toast.error("Payment was cancelled");
      navigate(location.pathname, { replace: true });
      return;
    }

    if (status === "return" && orderId && !isCapturing) {
      setIsCapturing(true);
      axiosAPI
        .post("/paypal/capture", { orderId })
        .then(() => {
          toast.success("Payment confirmed");
          setIsOrderOpen(false);
        })
        .catch((err) => {
          if (err?.response?.status === 401) {
            toast.error("Compatibility consultations are available only to authorized users.");
            navigate("/login");
            return;
          }
          const message = err?.response?.data?.message || "Failed to confirm payment";
          toast.error(message);
        })
        .finally(() => {
          setIsCapturing(false);
          navigate(location.pathname, { replace: true });
        });
    }
  }, [location.pathname, location.search, navigate, isCapturing]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Compatibility by Birth Date</h1>
          <p className={styles.subtitle}>
            Enter both birth dates to unlock a paid compatibility consultation.
          </p>
        </div>

        <div className={styles.formCard}>
          <div className={styles.row}>
            <div className={styles.label}>Person 1</div>
            <div className={styles.dateFields}>
              <select
                className={styles.select}
                value={birthData.first.day}
                onChange={handleBirthChange("first", "day")}
              >
                <option value="">Day</option>
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                className={styles.select}
                value={birthData.first.month}
                onChange={handleBirthChange("first", "month")}
              >
                <option value="">Month</option>
                {MONTHS.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className={styles.select}
                value={birthData.first.year}
                onChange={handleBirthChange("first", "year")}
              >
                <option value="">Year</option>
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>Person 2</div>
            <div className={styles.dateFields}>
              <select
                className={styles.select}
                value={birthData.second.day}
                onChange={handleBirthChange("second", "day")}
              >
                <option value="">Day</option>
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                className={styles.select}
                value={birthData.second.month}
                onChange={handleBirthChange("second", "month")}
              >
                <option value="">Month</option>
                {MONTHS.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className={styles.select}
                value={birthData.second.year}
                onChange={handleBirthChange("second", "year")}
              >
                <option value="">Year</option>
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isBirthComplete && (
            <button
              className="btn btn-primary btn-pill"
              type="button"
              onClick={openOrder}
            >
              Book Consultation
            </button>
          )}
        </div>
      </div>

      {isOrderOpen && isLoggedIn && (
        <div
          className={styles.modalOverlay}
          onClick={handleOverlayClick}
          role="presentation"
        >
          <div
            ref={formRef}
            className={`${styles.formCard} ${styles.modalCard}`}
            aria-live="polite"
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={closeOrder}
              aria-label="Close consultation form"
            >
              X
            </button>
            <h3 className={styles.formTitle}>Send a request</h3>
            <p className={styles.formSubtitle}>
              Selected: <strong>{SERVICE.title}</strong>
            </p>
            <form className={styles.form}>
              <label className={styles.formLabel}>
                First name
                <input
                  className={styles.formInput}
                  type="text"
                  name="firstName"
                  value={formState.firstName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={styles.formLabel}>
                Last name
                <input
                  className={styles.formInput}
                  type="text"
                  name="lastName"
                  value={formState.lastName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={styles.formLabel}>
                Email
                <input
                  className={styles.formInput}
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={styles.formLabel}>
                Country code
                <select
                  className={styles.formSelect}
                  name="phoneCode"
                  value={formState.phoneCode}
                  onChange={handleChange}
                  required
                >
                  <option value="+44">United Kingdom (+44)</option>
                  <option value="+353">Ireland (+353)</option>
                  <option value="+49">Germany (+49)</option>
                  <option value="+33">France (+33)</option>
                  <option value="+34">Spain (+34)</option>
                  <option value="+39">Italy (+39)</option>
                  <option value="+31">Netherlands (+31)</option>
                  <option value="+48">Poland (+48)</option>
                  <option value="+40">Romania (+40)</option>
                  <option value="+30">Greece (+30)</option>
                </select>
              </label>
              <label className={styles.formLabel}>
                Phone
                <input
                  className={styles.formInput}
                  type="tel"
                  name="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  required
                />
              </label>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.payButton}
                  onClick={handlePayPal}
                  disabled={isCreatingOrder || isCapturing}
                >
                  {isCreatingOrder
                    ? "Paying..."
                    : isCapturing
                    ? "Confirming..."
                    : "Pay with PayPal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
