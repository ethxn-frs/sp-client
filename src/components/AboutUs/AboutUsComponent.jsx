// src/components/AboutPage.js
import React from 'react';
import './AboutUsComponent.css';
import '../Home/HomeComponent.css'
import HeaderComponent from '../Header/HeaderComponent';
import FooterComponent from '../Footer/FooterComponent';

const AboutUsComponent = () => {
    return (
        <div>
            <div className="headers-home-page">
                <HeaderComponent />
            </div>
            <div className="main-home-page">
                <div className="about-page">
                    <div className="about-container">
                        <h2>A propos de nous</h2>
                        <p>SportVision est une organisation non gouvernementale dédiée à l'amélioration de la vie des jeunes
                            défavorisés par le pouvoir transformateur du sport. Fondée en 2010, notre mission est de
                            promouvoir l'inclusion sociale, l'éducation et le développement personnel à travers des
                            programmes sportifs innovants et accessibles. Nous croyons fermement que le sport est un outil
                            puissant pour briser les barrières sociales, favoriser l'esprit d'équipe et renforcer les
                            compétences interpersonnelles.</p>
                        <h3>Nos missions</h3>
                        <p>
                            Au fil des ans, SportVision a développé une multitude de projets qui touchent des milliers de
                            jeunes dans diverses communautés. Nos initiatives comprennent des camps de sport, des
                            compétitions interscolaires, et des ateliers de leadership. Nous travaillons en étroite
                            collaboration avec les écoles locales, les clubs sportifs et les autorités municipales pour
                            garantir que nos programmes répondent aux besoins spécifiques de chaque communauté.
                            Notre équipe est composée de professionnels passionnés et d'anciens athlètes qui partagent
                            la conviction que chaque enfant mérite une chance égale de réussir. Grâce à nos partenaires et
                            bénévoles dévoués, nous avons pu étendre notre portée et avoir un impact positif significatif.
                        </p>
                        <h3>Nos valeurs</h3>
                        <ul>
                            <li>Concentration sur le client : Nous plaçons nos clients au centre de tout ce que nous faisons.</li>
                            <li>Intégrité : Nous menons nos activités avec honnêteté et intégrité.</li>
                            <li>Excellence : Nous nous engageons à l'excellence dans tout ce que nous faisons.</li>
                            <li>Innovation : Nous accueillons l'innovation pour offrir les meilleures solutions.</li>
                            <li>Esprit d'équipe : Nous travaillons ensemble pour atteindre nos objectifs.</li>
                        </ul>
                        <br></br>

                    </div>
                </div>
            </div>
            <div className="footer-home-page">
                <FooterComponent />
            </div>

        </div>
    );
};

export default AboutUsComponent;