import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';

function SignUpComponent() {
  const [signupData, setSignupData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    birth_date: '',
    address: '',
    password: '',
    confirmpassword: '',
    roles:''
  });



  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);

  // image sélectionner
  const [file, setFile] = useState(null)

  const getRole = async () => {
    try {
      const response = await fetch('http://localhost:3030/roles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Échec de la récupération des rôles: ${response.status} (${response.statusText})`);
      }

      const roleData = await response.json();
      return roleData.roles;
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles:', error);
      alert("Erreur lors de la récupération des rôles. Veuillez réessayer.");

      return null;  // Retourne null pour indiquer un échec
    }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      const fetchedRoles = await getRole();

      if (fetchedRoles) {
        setRoles(fetchedRoles);
      }
    };

    fetchRoles();
  }, []);


  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    signupData.roles = selectedRole
    // Valider que les mots de passe correspondent
    if (signupData.password !== signupData.confirmpassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    

    const formData = new FormData();
    formData.append('firstname', signupData.firstname);
    formData.append('lastname', signupData.lastname);
    formData.append('email', signupData.email);
    formData.append('birth_date', signupData.birth_date);
    formData.append('address', signupData.address);
    formData.append('password', signupData.password);
    formData.append('roles', JSON.stringify(selectedRole));

    if (file) {
      formData.append('image', file);
    }

    try {


      const response = await fetch('http://localhost:3030/users/auth/signup', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Échec de l\'inscription');
      }

      const result = await response.json();
      alert("Inscription réussie !");
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert("Erreur lors de l'inscription.");
    }
  };

  const handleInputRole = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => JSON.parse(option.value)) : [];
    // const role = JSON.parse(event.target.value);
    setSelectedRole(values);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    //setSignupData(event.target.value);
    setSignupData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleInputFile = (event) => {
    const File = event.target.files[0];s
    setFile(File);
  };

  const optionsrole = roles.map(role => ({
    value: JSON.stringify(role),
    label: role.Role
  }));

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Existing Login Form */}

        {/* Signup Form */}
        <div className="col-md-6 mt-5 mb-5 mx-auto">
          <h2>Inscription</h2>
          <form onSubmit={handleSignupSubmit}>

            <div className="mb-3">
              <input type="text" className="form-control" id="firstname" name="firstname"
                value={signupData.firstname} onChange={handleInputChange} placeholder="nom" />
            </div>

            <div className="mb-3">
              <input type="text" className="form-control" id="lastname" name="lastname"
                value={signupData.lastname} onChange={handleInputChange} placeholder="Prenom" />
            </div>

            <div className="mb-3">
              <input type="email" id="signupEmail" name="email" className="form-control"
                value={signupData.email} onChange={handleInputChange} placeholder="email" />
            </div>

            <div className="mb-3">
              <input type="Date" className="form-control" id="birthday" name="birth_date"
                value={signupData.birth_date} onChange={handleInputChange} placeholder="Entrez votre date de naissance" />
            </div>

            <div className="mb-3">
              <input type="text" className="form-control" id="address" name="address"
                value={signupData.address} onChange={handleInputChange} placeholder="address" />
            </div>

            <div className="mb-3">
              <input type="password" className="form-control" id="signupPassword" name="password"
                value={signupData.password} onChange={handleInputChange} placeholder="Créez un mot de passe" />
            </div>
            <div className="mb-3">
              <input type="password" className="form-control" id="signupConfirmPassword" name="confirmpassword"
                value={signupData.confirmpassword} onChange={handleInputChange} placeholder="Confirmez votre mot de passe" />
            </div>

            <div className="mb-3">
              <input type="file" onChange={handleInputFile} accept="image/*" id="image" name="image" className="form-control" placeholder="image" />
            </div>

            <div className="mb-3">
              <Select
                placeholder="role"
                isMulti
                name="formation"
                options={optionsrole}
                value={optionsrole.filter(option => selectedRole.map(tc => JSON.stringify(tc)).includes(option.value))}
                onChange={handleInputRole}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>

            <p>Déjà membre chez nous ? <Link to="/login">Connectez vous ici</Link></p>
            <button type="submit" className="btn btn-success">S'inscrire</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpComponent;