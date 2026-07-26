import "./HowItWorks.css";

function HowItWorks() {

  const steps = [
    {
      icon:"bi-pencil-square",
      title:"Report Item",
      text:"Submit details about your lost or found item with description and image."
    },
    {
      icon:"bi-search",
      title:"Search",
      text:"Browse through reported items using categories and keywords."
    },
    {
      icon:"bi-bell",
      title:"Get Matched",
      text:"Receive updates when a similar item is found."
    },
    {
      icon:"bi-check-circle",
      title:"Recover Item",
      text:"Verify ownership and safely get your belongings back."
    }
  ];

  return (

    <section className="works-section">

      <div className="container">

        <div className="section-heading">

          <span>
            PROCESS
          </span>

          <h2>
            How FindIt Works
          </h2>

          <p>
            Recover your lost belongings in four simple steps.
          </p>

        </div>

        <div className="steps-container">

          {
            steps.map((step,index)=>(

              <div className="step-card" key={index}>

                <div className="step-number">
                  0{index+1}
                </div>

                <div className="step-icon">

                  <i className={`bi ${step.icon}`}></i>

                </div>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.text}
                </p>

              </div>

            ))
          }

        </div>

      </div>

    </section>

  );

}

export default HowItWorks;
