import "./FoundPreview.css";

function FoundPreview() {

  const items = [
    {
      image:"https://images.unsplash.com/photo-1518544889288-7d4e3d0c7c13",
      name:"Blue Backpack",
      category:"Bag",
      location:"University Library",
      date:"24 July 2026"
    },

    {
      image:"https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
      name:"Digital Camera",
      category:"Electronics",
      location:"Central Park",
      date:"22 July 2026"
    },

    {
      image:"https://images.unsplash.com/photo-1572635196237-14b3f281503f",
      name:"Eyeglasses",
      category:"Personal Item",
      location:"Metro Station",
      date:"19 July 2026"
    }
  ];

  return (

    <section className="found-section">

      <div className="container">

        <div className="section-heading">

          <span>
            RECENT FINDS
          </span>

          <h2>
            Recently Found Items
          </h2>

          <p>
            Help return found items to their rightful owners.
          </p>

        </div>


        <div className="items-grid">

        {
          items.map((item,index)=>(

            <div className="found-card" key={index}>

              <img 
                src={item.image}
                alt={item.name}
              />

              <div className="found-content">

                <span className="found-badge">
                  Found
                </span>

                <h3>
                  {item.name}
                </h3>

                <p>
                  <i className="bi bi-tag"></i>
                  {item.category}
                </p>

                <p>
                  <i className="bi bi-geo-alt"></i>
                  {item.location}
                </p>

                <p>
                  <i className="bi bi-calendar"></i>
                  {item.date}
                </p>

                <button>
                  Claim Item
                </button>

              </div>

            </div>

          ))
        }

        </div>

      </div>

    </section>

  );
}

export default FoundPreview;

