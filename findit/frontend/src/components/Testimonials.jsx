import "./Testimonials.css";

function Testimonials() {

  const reviews = [
    {
      name:"Rahul Sharma",
      role:"Student",
      review:"I lost my wallet during college. FindIt helped me connect with the person who found it.",
      rating:"★★★★★"
    },

    {
      name:"Priya Patil",
      role:"Working Professional",
      review:"The reporting process was simple and I found my missing bag quickly.",
      rating:"★★★★★"
    },

    {
      name:"Amit Verma",
      role:"User",
      review:"A great platform that helps people support each other.",
      rating:"★★★★☆"
    }
  ];

  return (

    <section className="testimonial-section">

      <div className="container">

        <div className="section-heading">

          <span>
            USER REVIEWS
          </span>

          <h2>
            What People Say About FindIt?
          </h2>

          <p>
            Real experiences from our community.
          </p>

        </div>


        <div className="testimonial-grid">

        {
          reviews.map((review,index)=>(

            <div 
              className="testimonial-card"
              key={index}
            >

              <div className="stars">
                {review.rating}
              </div>

              <p>
                "{review.review}"
              </p>

              <h3>
                {review.name}
              </h3>

              <span>
                {review.role}
              </span>

            </div>

          ))
        }

        </div>

      </div>

    </section>

  );

}

export default Testimonials;
