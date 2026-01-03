import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "./ReviewsSection.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ReviewsSection = () => {
 const reviews = [
  {
    text: "The consultation helped me clearly understand my financial patterns and what I should focus on next. Everything was explained in a calm and practical way.",
    author: "Anna, London",
  },
  {
    text: "I received clear guidance about relationships and timing, which helped me feel more confident about my personal decisions.",
    author: "John, Manchester",
  },
  {
    text: "The session gave me a deeper understanding of my strengths and life direction. It helped me see my situation from a new perspective.",
    author: "Maria, Birmingham",
  },
  {
    text: "Very thoughtful and well-structured consultation. The insights felt personal and relevant, not generic.",
    author: "David, Edinburgh",
  },
  {
    text: "I appreciated how clear and supportive the guidance was. It helped me organize my thoughts and feel more grounded.",
    author: "Sophia, Bristol",
  },
  {
    text: "The consultation was professional and easy to follow. I left with clarity and a better understanding of my next steps.",
    author: "Michael, Glasgow",
  },
];


  return (
    <section id="reviews" className="section-reviews py-5">
      <div className="container">
        <h2 className="mb-4 text-center title-reviews">Reviews</h2>

        <div className="reviews-swiper-wrapper">
          <button className="reviews-nav reviews-prev" aria-label="Previous">‹</button>
          <button className="reviews-nav reviews-next" aria-label="Next">›</button>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              nextEl: ".reviews-next",
              prevEl: ".reviews-prev",
            }}
            pagination={{ el: ".reviews-pagination", clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
          >
            {reviews.map((review, i) => (
              <SwiperSlide key={i}>
                <div className="card review-card h-100">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <p className="card-text mb-0">"{review.text}"</p>
                    <h6 className="card-subtitle text-muted mt-3">{review.author}</h6>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="reviews-pagination"></div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

