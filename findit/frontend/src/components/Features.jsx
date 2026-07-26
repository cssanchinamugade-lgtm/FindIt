import "./Features.css";

function Features() {

  const features = [
    {
      icon:"bi-search",
      title:"Smart Search",
      text:"Find lost items quickly using keywords, category and location."
    },
    {
      icon:"bi-pencil-square",
      title:"Easy Reporting",
      text:"Report lost or found items with complete details and images."
    },
    {
      icon:"bi-shield-check",
      title:"Secure Platform",
      text:"A trusted platform to safely connect item owners."
    },
    {
      icon:"bi-lightning-charge",
      title:"Fast Recovery",
      text:"Increase chances of recovering your belongings quickly."
    },
    {
      icon:"bi-people",
      title:"Community Help",
      text:"People can help each other by sharing found items."
    },
    {
      icon:"bi-bell",
      title:"Instant Updates",
      text:"Get notifications about possible item matches."
    }
  ];

  return (

    <section className="features-section">

      <div className="container">

        <div className="section-heading">

          <span>
            FEATURES
          </span>

          <h2>
            Why Choose FindIt?
          </h2>

          <p>
            A simple and reliable platform to reconnect people with their belongings.
          </p>

        </div>

        <div className="feature-grid">

          {
            features.map((item,index)=>(

              <div className="feature-card" key={index}>

                <div className="feature-icon">

                  <i className={`bi ${item.icon}`}></i>

                </div>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.text}
                </p>

              </div>

            ))
          }

        </div>

      </div>

    </section>

  );
}

export default Features;
