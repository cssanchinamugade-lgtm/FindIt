	import "./FAQ.css";

function FAQ() {

  const questions = [
    {
      question:"How do I report a lost item?",
      answer:"Click on Report Lost, fill in the item details, add description and submit your report."
    },

    {
      question:"How can I report a found item?",
      answer:"Go to Report Found and provide information about the item you found."
    },

    {
      question:"How will I know if my item is found?",
      answer:"You can search matching items and receive updates when similar items are reported."
    },

    {
      question:"Is my information safe?",
      answer:"Yes, FindIt keeps user information secure and only shares necessary details."
    },

    {
      question:"Can anyone use FindIt?",
      answer:"Yes, students, professionals and anyone who loses or finds an item can use FindIt."
    }

  ];

  return (

    <section className="faq-section">

      <div className="container">

        <div className="section-heading">

          <span>
            FAQ
          </span>

          <h2>
            Frequently Asked Questions
          </h2>

          <p>
            Find answers to common questions about FindIt.
          </p>

        </div>


        <div className="faq-container">

        {
          questions.map((item,index)=>(

            <div className="faq-card" key={index}>

              <h3>
                {item.question}
              </h3>

              <p>
                {item.answer}
              </p>

            </div>

          ))
        }

        </div>

      </div>

    </section>

  );

}

export default FAQ;
