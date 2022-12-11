import React from "react";

function Footer() {
    const getSiteUrl = () => {
        return window.location.origin;
    };

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
                            <a
                                href={
                                    "https://www.facebook.com/sharer/sharer.php?u=" +
                                    getSiteUrl()
                                }
                                className="fa fa-facebook"
                                target={"_blank"}
                                rel="noreferrer"
                            >
                                <span></span>
                            </a>
                            <a
                                href={
                                    "https://twitter.com/intent/tweet?text=" +
                                    getSiteUrl()
                                }
                                className="fa fa-twitter"
                                target={"_blank"}
                                rel="noreferrer"
                            >
                                <span></span>
                            </a>
                            <a
                                href={`https://pinterest.com/pin/create/button/?url=${getSiteUrl()}&media=&description=`}
                                className="fa fa-pinterest"
                                target={"_blank"}
                                rel="noreferrer"
                            >
                                <span></span>
                            </a>
                            <a
                                href={
                                    "https://www.linkedin.com/shareArticle?mini=true&url=" +
                                    getSiteUrl()
                                }
                                target={"_blank"}
                                rel="noreferrer"
                                className="fa fa-linkedin"
                            >
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
