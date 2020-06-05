import * as React from "react";

export const ContactsPage = () => {
  return (
      <div>
          <header className="app-layout-header">
              <h2 className="text-primary">Contact Us</h2>
          </header>
          <div className="app-layout-content">
              <div className="app-layout-page">
              <p>If you have any questions, suggestions, bug reports, future
                  requests : please feel to contact us via email or skype
                  provided below.<br /> Thank you.</p>
              <p>skype: vreshch.work</p>
              <p>email: <a href="mailto:crystallography.online@gmail.com">
              crystallography.online@gmail.com</a></p>
              <p>web: <a href="http://vreshch.com">vreshch.com</a></p>
              <p>Dr. Volodymyr Vreshch</p>
              </div>
          </div>
      </div>
  );
};
