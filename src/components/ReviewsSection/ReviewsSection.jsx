import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "./ReviewsSection.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ReviewsSection = () => {
  const reviews = [
    { text: "The consultation was incredibly helpful and gave me a clear perspective on my next steps.", author: "Anna, London" },
    { text: "Surprisingly accurate and deeply inspiring — I highly recommend this experience!", author: "John, Manchester" },
    { text: "The reading helped me make a very important decision about relocating. Truly eye-opening.", author: "Maria, Birmingham" },
    { text: "A unique experience that brought me clarity and motivation for the future.", author: "David, Edinburgh" },
    { text: "Very insightful and delivered with warmth — I felt truly understood.", author: "Sophia, Bristol" },
    { text: "The session gave me confidence to move forward with my plans. Highly professional.", author: "Michael, Glasgow" },
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

