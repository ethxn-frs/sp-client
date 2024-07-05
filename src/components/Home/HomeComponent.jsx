import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HomeComponent.css';
import { useNavigate } from 'react-router-dom';
import HeaderComponent from '../Header/HeaderComponent';
import FooterComponent from '../Footer/FooterComponent';
import Swal from 'sweetalert2';

function HomeComponent() {
    const navigate = useNavigate();
    const [recentClubs, setRecentClubs] = useState([]);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        subject: '',
        content: ''
    });

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };

    useEffect(() => {
        fetchRecentClubs();
    }, []);

    const fetchRecentClubs = async () => {
        try {
            const response = await fetch('http://localhost:4000/clubs/recents');
            const data = await response.json();
            setRecentClubs(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des clubs récents:', error);
        }
    };

    const handleContactFormChange = (e) => {
        const { name, value } = e.target;
        setContactForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleContactFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactForm)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi du message.');
            }

            Swal.fire('Succès', 'Votre message a été envoyé avec succès.', 'success');
            setContactForm({
                name: '',
                email: '',
                subject: '',
                content: ''
            });
        } catch (error) {
            Swal.fire('Erreur', error.message, 'error');
        }
    };

    function handlerLearnMore() {
        navigate('/aboutus');
    }
    
    function handlerContact() {
        navigate('/contact');
    }

    return (
        <div>
            <div className="headers-home-page">
                <HeaderComponent />
            </div>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-text">
                    <h1>Franchise Club</h1>
                    <p>Nous construisons un avenir meilleur avec nos clubs partenaires dans le but d'aider les jeunes passionnés de sport
                        à réaliser leur rêve. Et pour y arriver nous avons mis en place des centres de formation pour accompagner ces
                        jeunes à se former afin de rentrer dans le monde professionnel. Pour faire un don <a href='/don'>cliquez ici.</a><br></br>
                        Votre soutien nous est utile pour aider d'autres jeunes à réaliser leur rêve.
                    </p>
                    <button onClick={handlerLearnMore}>Apprendre plus</button>
                </div>
                <div className="hero-image">
                    <img src='/assets/images/photo.jpeg' alt="Fitness Club" />
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <div className="about-text">
                    <h2>A propos de nous</h2>
                    <p>Au fil des ans, SportVision a développé une multitude de projets qui touchent des milliers de jeunes dans
                        diverses communautés. Nos initiatives comprennent des camps de sport, des compétitions interscolaires,
                        et des ateliers de leadership. Nous travaillons en étroite collaboration avec les écoles locales,
                        les clubs sportifs et les autorités municipales pour
                        garantir que nos programmes répondent aux besoins spécifiques de chaque communauté.<br></br>
                        Notre équipe est composée de professionnels passionnés et d'anciens athlètes qui partagent la conviction
                        que chaque enfant mérite une chance égale de réussir. Grâce à nos partenaires et bénévoles dévoués,
                        nous avons pu étendre notre portée et avoir un impact positif significatif.</p>
                    <button onClick={handlerContact}>Nous contacter</button>
                </div>
                <div className="about-image">
                    <img src='/assets/images/professional.jpeg' alt="About us" />
                </div>
            </section>

            {/* Format Section */}
            <section className="format-section">
                <h2>Ils nous ont rejoint récemment</h2>
                <div className="format-cards">
                    {recentClubs.map((club) => (
                        <div className="card" key={club.id}>
                            <h3>{club.name}</h3>
                            <p>{club.address}</p>
                            <p>{club.email}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Our Clubs Section */}
            <section className="clubs-section">
                <h1>Ambitions</h1>
                <div className="clubs-slider">
                    <Slider {...settings}>
                        <div>
                            <img src='/assets/images/image.png' alt="Club 1" />
                        </div>
                        <div>
                            <img src='/assets/images/image1.png' alt="Club 2" />
                        </div>
                        <div>
                            <img src='/assets/images/image2.png' alt="Club 3" />
                        </div>
                        <div>
                            <img src='/assets/images/image3.png' alt="Club 3" />
                        </div>
                    </Slider>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <h2>Nos actions</h2>
                <div className="testimonials">
                    <div className="testimonial">
                        <img src='/assets/images/actionvert2.png' alt="Client 1" />
                        <p>Une illustration montrant des personnes plantant des arbres et prenant soin de l'environnement
                            L'image représente un groupe de volontaires plantant des jeunes arbres dans un parc, avec en arrière-plan
                            des arbres verts et un ciel clair. L'atmosphère générale est positive et pleine d'espoir, soulignant la
                            conservation de l'environnement et l'effort communautaire.
                        </p>
                    </div>
                    <div className="testimonial">
                        <img src='/assets/images/actionvert.png' alt="Client 2" />
                        <p>Une illustration de personnes nettoyant une plage. L'image montre des volontaires ramassant des
                            déchets et des débris le long d'un rivage, avec en arrière-plan l'océan et un ciel ensoleillé.
                            L'atmosphère générale est proactive et orientée vers la communauté, soulignant l'importance de garder
                            nos plages propres et de protéger la vie marine.</p>
                    </div>
                    <div className="testimonial">
                        <img src='/assets/images/actionvert1.png' alt="Client 3" />
                        <p>Une illustration de personnes recyclant des déchets. L'image montre des individus triant
                            différents types de matériaux recyclables dans des bacs séparés, avec en arrière-plan un
                            centre de recyclage propre et organisé. L'atmosphère générale est responsable et écologique,
                            soulignant l'importance du recyclage et de la gestion des déchets pour un avenir durable.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <h2>Nous Contacter</h2>
                <form onSubmit={handleContactFormSubmit}>
                    <input
                        type="text"
                        placeholder="Votre nom"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactFormChange}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Votre email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactFormChange}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Objet"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleContactFormChange}
                        required
                    />
                    <textarea
                        placeholder="Entrer votre message"
                        name="content"
                        value={contactForm.content}
                        onChange={handleContactFormChange}
                        required
                    ></textarea>
                    <button type="submit">Envoyer</button>
                </form>
            </section>
            <FooterComponent />
        </div>
    );
}

export default HomeComponent;
