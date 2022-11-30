import React from "react";

function Footer() {
    return (
        <div>
            <footer
                className="bg-dark text-center text-lg-start  text-white"
                id="footer"
            >
                <div className="container p-3">
                    <div className="row">
                        <div className="col">
                            <p className="text-center">
                                VirtualClassroom is a simple classroom
                                simulation app built with React and Nodejs
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            <a href="https://www.facebook.com/sharer/sharer.php?u=http%3A//somecoolurl.com" className="fa fa-facebook">
                                <span></span>
                            </a>
                            <a href="https://twitter.com/intent/tweet?text=http%3A//somecoolurl.com" className="fa fa-twitter">
                                <span></span>
                            </a>
                            <a href="https://pinterest.com/pin/create/button/?url=http://somecoolurl.com&media=&description=" className="fa fa-pinterest">
                                <span></span>
                            </a>
                            <a href="https://www.linkedin.com/shareArticle?mini=true&url=http://somecoolurl.com" className="fa fa-linkedin">
                                <span></span>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
