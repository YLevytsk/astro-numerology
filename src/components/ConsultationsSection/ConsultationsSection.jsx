import s from "./ConsultationsSection.module.css";

export default function ConsultationsSection() {
const consultations = [
  {
    id: "1",
    title: "Money Code",
    desc: "Discover your personal money pattern, uncover hidden financial blocks, and learn how to attract stable income with confidence, clarity, and the right timing.",
    price: "£25",
  },
  {
    id: "2",
    title: "Marriage Year",
    desc: "Find out when love is truly on your side. Identify the most favorable periods for marriage and deep relationships — and avoid years that bring challenges.",
    price: "£25",
  },
  {
    id: "3",
    title: "Life Purpose",
    desc: "Understand why you are here, what your natural talents are, and which direction brings fulfillment, growth, and long-term success.",
    price: "£25",
  },
];

  return (
    <section id="consultations" className={s.section}>
      <div className={s.inner}>
        {/* HEADER */}
        <div className={s.headerRow}>
          <h2 className={s.title}>Personal Consultations</h2>

          <p className={s.subtitle}>
            Choose the guidance that fits your journey
          </p>
        </div>

        {/* LIST */}
        <ul className={s.list}>
          {consultations.map(({ id, title, desc, price }) => (
            <li key={id} className={s.item}>
              <div className={s.cardWrapper}>
                <div className={s.card}>
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



