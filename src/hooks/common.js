import {useHistory} from 'react-router-dom';
import {SMNotification} from '../view/components';
import {useEffect, useState} from 'react';


export const useNavigation = () => {

    const history = useHistory();

    return (path, {error, success}) => {
        if(error) {
            SMNotification('error', {message: error});
        } else if(success) {
            SMNotification('success', {message: success});
        }
        history.push(path);
    };
};

export const useValidator = (validator) => {

    const [isValid, setIsValid] = useState(false);
    const [value, setValue] = useState('');
    const reset = ()=> {
        setValue('');
        setIsValid(false);
    }

    const rule = {rules: [{validator: (rule, value, callback) => validator(rule, value, (e) => {
        if(e) {
            setIsValid(false);
        } else {
            setIsValid(true);
            callback();
        }
        setValue(value);
    })}]};

    return [isValid, value, rule.rules, reset];
};


export const useService = (service, ...args) => {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if(!error && !data){
            service(...args)
                .then(data => setData(data))
                .catch(error => setError(error))
                .finally(() => setIsCompleted(true));
        }
    }, [service, args, error, data]);

    return [isCompleted, data, error];
};

