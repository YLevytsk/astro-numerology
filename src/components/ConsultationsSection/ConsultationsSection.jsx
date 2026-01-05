import s from "./ConsultationsSection.module.css";

const ASSET_BASE_URL = (
  import.meta.env.VITE_API_BASE || "https://harmoniq.disainnova.com"
).replace(/\/api\/?$/, "");
const withBase = (path) => `${ASSET_BASE_URL}${path}`;

export default function ConsultationsSection() {
  const consultations = [
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
  ];

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

                  <button className={s.button}>
                    Book Consultation
                  </button>
                </div>

                <div className={s.price}>{price}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
