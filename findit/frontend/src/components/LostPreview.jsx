import "./LostPreview.css";

function LostPreview() {

  const items = [
    {
      image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      name:"Smart Watch",
      category:"Electronics",
      location:"Mumbai Railway Station",
      date:"25 July 2026"
    },

    {
      image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      name:"Black Wallet",
      category:"Personal Item",
      location:"College Campus",
      date:"20 July 2026"
    },

    {
      image:"https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
      name:"Camera",
      category:"Gadget",
      location:"City Park",
      date:"18 July 2026"
    }
  ];

  return (

    <section className="lost-section">

      <div className="container">

        <div className="section-heading">

          <span>
            RECENT REPORTS
          </span>

          <h2>
            Recently Lost Items
          </h2>

          <p>
            Help people find their missing belongings.
          </p>

        </div>


        <div className="items-grid">

        {
          items.map((item,index)=>(

            <div className="item-card" key={index}>

              <img 
                src={item.image}
                alt={item.name}
              />

              <div className="item-content">

                <span className="lost-badge">
                  Lost
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
                  View Details
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

export default LostPreview;
