import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { axiosAPI } from "../../redux/auth/operations.js";
import { selectIsLoggedIn } from "../../redux/auth/selectors.js";
import s from "./ConsultationsSection.module.css";

const ASSET_BASE_URL = (
  import.meta.env.VITE_API_BASE || "https://harmoniq.disainnova.com"
).replace(/\/api\/?$/, "");
const withBase = (path) => `${ASSET_BASE_URL}${path}`;

export default function ConsultationsSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const consultations = useMemo(() => [
    {
      id: "1",
      title: "Money Code",
      desc: "Discover your personal money pattern, uncover hidden financial blocks, and learn how to attract stable income with confidence, clarity, and the right timing.",
      price: "£25",
      image: withBase("/uploads/chatgpt-hero-02.webp"),
      icon: "/images/money-code.svg",
    },
    {
      id: "2",
      title: "Marriage Year",
      desc: "Find out when love is truly on your side. Identify the most favorable periods for marriage and deep relationships and avoid years that bring challenges.",
      price: "£25",
      image: withBase("/uploads/chatgpt-hero-01.webp"),
    },
    {
      id: "3",
      title: "Life Purpose",
      desc: "Understand why you are here, what your natural talents are, and which direction brings fulfillment, growth, and long-term success.",
      price: "£25",
      image: withBase("/uploads/chatgpt-hero-03.webp"),
    },
  ], []);
  const countryCodes = useMemo(
    () => [
      { code: "GB", dial: "+44", label: "United Kingdom (+44)" },
      { code: "IE", dial: "+353", label: "Ireland (+353)" },
      { code: "DE", dial: "+49", label: "Germany (+49)" },
      { code: "FR", dial: "+33", label: "France (+33)" },
      { code: "ES", dial: "+34", label: "Spain (+34)" },
      { code: "IT", dial: "+39", label: "Italy (+39)" },
      { code: "NL", dial: "+31", label: "Netherlands (+31)" },
      { code: "PL", dial: "+48", label: "Poland (+48)" },
      { code: "RO", dial: "+40", label: "Romania (+40)" },
      { code: "GR", dial: "+30", label: "Greece (+30)" },
    ],
    []
  );

  const [selected, setSelected] = useState(null);
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "+44",
    phone: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const formRef = useRef(null);

  const handleSelect = (consultation) => {
    if (!isLoggedIn) {
      toast.error("Consultations are available only to authorized users.");
      navigate("/login");
      return;
    }
    setSelected(consultation);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;

    if (!isLoggedIn) {
      toast.error("Consultations are available only to authorized users.");
      navigate("/login");
      return;
    }

    const payload = {
      consultationId: selected.id,
      firstName: formState.firstName,
      lastName: formState.lastName,
      email: formState.email,
      phone: `${formState.phoneCode} ${formState.phone}`.trim(),
      phoneCode: formState.phoneCode,
      notes: formState.notes,
    };

    setIsSubmitting(true);
    axiosAPI
      .post("/consultations", payload)
      .then(() => {
        toast.success("Request sent successfully");
        setFormState({ firstName: "", lastName: "", email: "", phoneCode: "+44", phone: "", notes: "" });
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          toast.error("Consultations are available only to authorized users.");
          navigate("/login");
          return;
        }
        const message = err?.response?.data?.message || "Failed to send request";
        toast.error(message);
      })
      .finally(() => setIsSubmitting(false));
  };

  const handlePayPal = () => {
    if (!selected) {
      toast.error("Please select a consultation");
      return;
    }
    if (!isLoggedIn) {
      toast.error("Consultations are available only to authorized users.");
      navigate("/login");
      return;
    }
    if (!formState.email) {
      toast.error("Enter email before paying");
      return;
    }

    const amount = parseFloat(String(selected.price).replace(/[^\d.]/g, "")) || 0;
    const returnUrl = `${window.location.origin}/consultations?paypalStatus=return`;
    const cancelUrl = `${window.location.origin}/consultations?paypalStatus=cancel`;

    setIsCreatingOrder(true);
    axiosAPI
      .post("/paypal/orders", {
        amount,
        currency: "GBP",
        description: selected.title,
        consultationId: selected.id,
        customerEmail: formState.email,
        returnUrl,
        cancelUrl,
      })
      .then(({ data }) => {
        const approveUrl = data?.approveUrl;
        if (!approveUrl) {
          throw new Error("Missing approve URL");
        }
        window.location.href = approveUrl;
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          toast.error("Consultations are available only to authorized users.");
          navigate("/login");
          return;
        }
        const message = err?.response?.data?.message || err?.message || "Failed to create PayPal order";
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
        })
        .catch((err) => {
          if (err?.response?.status === 401) {
            toast.error("Consultations are available only to authorized users.");
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
    <section id="consultations" className={s.section}>
      <div className={s.inner}>
        {/* HEADER */}
        <div className={s.headerRow}>
          <h2 className={s.title}>Personal Consultations</h2>

          <p className={s.subtitle}>
            Thoughtfully designed consultations that help you understand your personal patterns, align with the right timing, and make clear, confident decisions in key areas of life.
          </p>
        </div>

        {/* LIST */}
        <ul className={s.list}>
          {consultations.map(({ id, title, desc, price, icon, image }) => (
            <li key={id} className={s.item}>
              <div className={s.cardWrapper}>
                <div className={s.card}>
                  {image ? (
                    <div className={s.cardMediaWrap}>
                      <img src={image} alt={title} className={s.cardMedia} />
                    </div>
                  ) : (
                    icon && (
                      <img src={icon} alt="" className={s.cardIcon} aria-hidden="true" />
                    )
                  )}
                  <h5 className={s.cardTitle}>{title}</h5>

                  <p className={s.cardText}>{desc}</p>

                  <button className={s.button} type="button" onClick={() => handleSelect({ id, title, desc, price })}>
                    Book Consultation
                  </button>
                </div>

                <div className={s.price}>{price}</div>
              </div>
            </li>
          ))}
        </ul>

        {selected && isLoggedIn && (
          <div ref={formRef} className={s.formCard} aria-live="polite">
            <h3 className={s.formTitle}>Send a request</h3>
            <p className={s.formSubtitle}>
              Selected: <strong>{selected.title}</strong>
            </p>
            <form className={s.form} onSubmit={handleSubmit}>
              <label className={s.label}>
                First name
                <input
                  className={s.input}
                  type="text"
                  name="firstName"
                  value={formState.firstName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={s.label}>
                Last name
                <input
                  className={s.input}
                  type="text"
                  name="lastName"
                  value={formState.lastName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={s.label}>
                Email
                <input
                  className={s.input}
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
            </label>
            <label className={s.label}>
              Country code
              <select
                className={s.select}
                name="phoneCode"
                value={formState.phoneCode}
                onChange={handleChange}
                required
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.dial}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={s.label}>
              Phone
              <input
                className={s.input}
                type="tel"
                name="phone"
                value={formState.phone}
                onChange={handleChange}
                required
              />
            </label>
            <label className={s.label}>
              Notes (optional)
              <textarea
                className={s.textarea}
                name="notes"
                value={formState.notes}
                onChange={handleChange}
                rows="3"
              />
            </label>

            <div className={s.actions}>
              <button type="submit" className={s.submit} disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send request"}
              </button>
              {isLoggedIn && (
                <button
                  type="button"
                  className={s.payButton}
                  onClick={handlePayPal}
                  disabled={isCreatingOrder || isCapturing}
                >
                  {isCreatingOrder ? "Paying..." : "Pay with PayPal"}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      </div>
    </section>
  );
}
