import "./Footer.css";

function Footer() {

  return (

    <footer className="footer">

      <div className="footer-container">

        <div className="footer-section">

          <h2>FindIt</h2>

          <p>
            A smart Lost and Found portal that helps users
            reconnect with their missing items.
          </p>

        </div>



        <div className="footer-section">

          <h3>Quick Links</h3>

          <p>Home</p>
          <p>Search Items</p>
          <p>Report Lost</p>
          <p>Report Found</p>

        </div>




        <div className="footer-section">

          <h3>Contact</h3>

          <p>Email: support@findit.com</p>

          <p>Phone: +91 9876543210</p>

          <p>Location: India</p>

        </div>


      </div>



      <div className="footer-bottom">

        © 2026 FindIt. All Rights Reserved.

      </div>


    </footer>

  );

}

export default Footer;
