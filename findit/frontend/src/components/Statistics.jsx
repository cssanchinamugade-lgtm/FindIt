import "./Statistics.css";

function Statistics() {

  const stats = [
    {
      number:"1500+",
      title:"Items Reported",
      icon:"bi-box-seam"
    },
    {
      number:"1200+",
      title:"Items Returned",
      icon:"bi-check-circle"
    },
    {
      number:"800+",
      title:"Registered Users",
      icon:"bi-people"
    },
    {
      number:"98%",
      title:"Success Rate",
      icon:"bi-graph-up-arrow"
    }
  ];

  return (

    <section className="statistics-section">

      <div className="container">

        <div className="stats-grid">

          {
            stats.map((item,index)=>(

              <div className="stat-card" key={index}>

                <div className="stat-icon">

                  <i className={`bi ${item.icon}`}></i>

                </div>

                <h2>
                  {item.number}
                </h2>

                <p>
                  {item.title}
                </p>

              </div>

            ))
          }

        </div>

      </div>

    </section>

  );

}

export default Statistics;

