import React, { useEffect, useState } from 'react';
import { formatDistance} from 'date-fns';
import { useParams } from 'react-router-dom';
import parseISO from 'date-fns/parseISO';
import axios from 'axios';
import unitedKingdom from '../../svg/unitedKingdom.svg';
import russia from '../../svg/russia.svg';
import portugal from '../../svg/portugal.svg';
import italy from '../../svg/italy.svg';
import france from '../../svg/france.svg';
import germany from '../../svg/germany.svg';
import spain from '../../svg/spain.svg';
import APIEndpoints from '../../api';
import Sidebar from '../Sidebar';
import LanguagesBeingStudied from './LanguagesBeingStudied';
import '../../styles/Profile.scss';

export default function Profile (props) {
    const [activeUser, setActiveUser] = useState('');
    const [uniqueId, setUniqueId] = useState('');
    const [nativeLanguageFlag, setNativeLanguageFlag] = useState();
    const [newLearningLanguage, setNewLearningLanguage] = useState('English');
    const [userCreatedDate, setUserCreatedDate] = useState();
    const { profile } = useParams();

    // Runs on component mount. This fetches all the users and then 
    // runs getActiveUser() to find the signed in user.
    useEffect(() => {
        async function getUserData () {
            try {
                const allUsers = await axios.get(APIEndpoints.userDataEndpoint, {withCredentials: true});
                getActiveUser(allUsers);
            } catch (error) {
                console.error(error);
            }
        }
        getUserData();
    },[]);

    // Displays a country's flag depending on the user's native language
    const displayFlag = (userData) => {
        if(userData.nativeLanguage === 'Portuguese') {
            setNativeLanguageFlag(portugal)
        } else if (userData.nativeLanguage === 'French') {
            setNativeLanguageFlag(france)
        } else if (userData.nativeLanguage === 'Italian') {
            setNativeLanguageFlag(italy) 
        } else if (userData.nativeLanguage === 'German') {
            setNativeLanguageFlag(germany)
        } else if (userData.nativeLanguage === 'Russian') {
            setNativeLanguageFlag(russia)
        } else if (userData.nativeLanguage === 'Spanish') {
            setNativeLanguageFlag(spain)
        } else if (userData.nativeLanguage === 'English') {
            setNativeLanguageFlag(unitedKingdom)
        }
    };

    // Called from useEffect() axios call on component mount. Sets all activeUser details
    const getActiveUser = (allUsers) => {
        const foundActiveUser = allUsers.data.find(element => element.data.username === profile);
        let dateCreated = foundActiveUser.createdAt.slice(0,10);
        setUserCreatedDate(dateCreated);
        displayFlag(foundActiveUser.data);
        setActiveUser(foundActiveUser);
        setUniqueId(foundActiveUser.uniqueId);
        console.log(foundActiveUser)
    }

    // Allows user to add another language that they are learning
    const addLanguage = () => {
        if(activeUser.data.nativeLanguage === newLearningLanguage){
            alert('You know this already')
        } else if(!activeUser.data.learningLanguage.includes(newLearningLanguage)){
            let updatedLanguages = [...activeUser.data.learningLanguage, newLearningLanguage]
            setActiveUser((prevState) => {
                const newState = Object.assign({}, prevState);
                newState.data.learningLanguage = updatedLanguages;
                return newState;
            });
        } else {
            alert('Already Learning')
        }
    };

    // Allows user to delete a language that they had selected to be learning
    const deleteLanguage = (languageToDelete) => {
        let updatedLanguages = activeUser.data.learningLanguage.filter(element => element !== languageToDelete)
        if(window.confirm('Really Delete Language?')){
            setActiveUser((prevState) => {
                const newState = Object.assign({}, prevState);
                newState.data.learningLanguage = updatedLanguages;
                return newState;
            });
        };
    }

    // This runs anytime the activeUser state is updated, and sends the new data to
    // the backend in a PUT request. Initial function is in Routes.js file.
    useEffect(() => {
        props.updateUser(uniqueId, activeUser);
    }, [activeUser])

    if(!activeUser) {
        return(
            <div className='profile-container'>
                <Sidebar className='sidebar'></Sidebar>
                <div className='profile-data-container'>
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
            </div>
        )
    } else {
        return(
            <div className='profile-container'>
                <Sidebar className='sidebar'></Sidebar>
                <div className='profile-data-container'>
                    <div className='profile-has-loaded'>
                        <div className='username-and-flag-container'>
                            <h1 className='profile-name'>{activeUser.data.username}</h1>
                            <img className='native-language-flag' src={nativeLanguageFlag} alt='flag-showing-native-language'></img>
                            <p className='member-for'> Member for {formatDistance(parseISO(userCreatedDate), new Date())}</p>
                        </div>
                        <LanguagesBeingStudied
                        activeUser={activeUser}
                        deleteLanguage={deleteLanguage}
                        >
                        </LanguagesBeingStudied>
                        <div className='another-language-div'>
                            <h3>Studying Another Language?</h3>
                            <div className='another-language-select'>
                                <select onChange={e => setNewLearningLanguage(e.currentTarget.value)} 
                                id="learningLanguage" 
                                name="learningLanguage"
                                placeholder="Another Language?">
                                    <option value="English">English</option>
                                    <option value="Russian">Russian</option>
                                    <option value="Portuguese">Portuguese</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                    <option value="Italian">Italian</option>
                                    <option value="German">German</option>
                                </select>
                                <button onClick={addLanguage} className='uibutton'>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

