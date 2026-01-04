import AboutSection from "../components/About/About.jsx";
import ReviewsSection from "../components/ReviewsSection/ReviewsSection.jsx";
import BlogPreviewSection from "../components/BlogPreview/BlogPreview.jsx";
import ConsultationsSection from "../components/ConsultationsSection/ConsultationsSection.jsx";

const Home = () => {
  return (
    <>
      <AboutSection />
      <div className="home-secondary-bg">
        <ConsultationsSection />
        <ReviewsSection />
        <BlogPreviewSection />
      </div>
    </>
  );
};

export default Home;





